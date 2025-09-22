import { eq, and, desc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { jobDescriptions, users, type JobDescription, type NewJobDescription } from '@/lib/db/schema'
import { getServerSupabase } from '@/lib/supabase/server'
import { z } from 'zod'

// Validation schemas
const JobDescriptionInputSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  jobUrl: z.string().url().optional().or(z.literal('')),
  description: z.string().min(1, 'Job description is required'),
  location: z.string().optional(),
  salaryRange: z.string().optional(),
  employmentType: z.string().optional(),
  remote: z.boolean().default(false),
  requirements: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
})

const JobDescriptionUpdateSchema = JobDescriptionInputSchema.partial().omit({ companyName: true })

export type JobDescriptionInput = z.infer<typeof JobDescriptionInputSchema>
export type JobDescriptionUpdate = z.infer<typeof JobDescriptionUpdateSchema>

// Ensure a corresponding profile row exists for the authenticated user
async function ensureUserProfileRow(userId: string, email: string | null) {
  try {
    await db
      .insert(users)
      .values({ id: userId, email: email ?? '' })
      // Ignore if it already exists
      .onConflictDoNothing();
  } catch {
    // Best-effort; ignore if policy prevents it (service tasks can backfill)
  }
}

// Helper to get current user ID (verified) and ensure profile row exists
async function getCurrentUserId(): Promise<string> {
  const supabase = await getServerSupabase()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user?.id) {
    throw new Error('User not authenticated')
  }
  // Best-effort ensure user profile row exists to satisfy FK
  await ensureUserProfileRow(data.user.id, data.user.email ?? null)
  return data.user.id
}

// Repository functions
export async function getAllJobDescriptions(): Promise<JobDescription[]> {
  const userId = await getCurrentUserId()
  
  const result = await db
    .select()
    .from(jobDescriptions)
    .where(eq(jobDescriptions.userId, userId))
    .orderBy(desc(jobDescriptions.createdAt))
  
  return result
}

export async function getJobDescriptionById(id: string): Promise<JobDescription | null> {
  const userId = await getCurrentUserId()
  
  const result = await db
    .select()
    .from(jobDescriptions)
    .where(and(
      eq(jobDescriptions.id, id),
      eq(jobDescriptions.userId, userId)
    ))
    .limit(1)
  
  return result[0] || null
}

export async function createJobDescription(input: JobDescriptionInput): Promise<JobDescription> {
  const userId = await getCurrentUserId()
  const validatedInput = JobDescriptionInputSchema.parse(input)
  
  // Clean up empty strings
  const cleanedInput = {
    ...validatedInput,
    jobUrl: validatedInput.jobUrl === '' ? null : validatedInput.jobUrl,
    location: validatedInput.location === '' ? null : validatedInput.location,
    salaryRange: validatedInput.salaryRange === '' ? null : validatedInput.salaryRange,
    employmentType: validatedInput.employmentType === '' ? null : validatedInput.employmentType,
  }
  
  const result = await db
    .insert(jobDescriptions)
    .values({
      ...cleanedInput,
      userId,
    })
    .returning()
  
  return result[0]
}

export async function updateJobDescription(
  id: string, 
  updates: JobDescriptionUpdate
): Promise<JobDescription | null> {
  const userId = await getCurrentUserId()
  const validatedUpdates = JobDescriptionUpdateSchema.parse(updates)
  
  // Clean up empty strings
  const cleanedUpdates = {
    ...validatedUpdates,
    jobUrl: validatedUpdates.jobUrl === '' ? null : validatedUpdates.jobUrl,
    location: validatedUpdates.location === '' ? null : validatedUpdates.location,
    salaryRange: validatedUpdates.salaryRange === '' ? null : validatedUpdates.salaryRange,
    employmentType: validatedUpdates.employmentType === '' ? null : validatedUpdates.employmentType,
  }
  
  const result = await db
    .update(jobDescriptions)
    .set({
      ...cleanedUpdates,
      updatedAt: new Date(),
    })
    .where(and(
      eq(jobDescriptions.id, id),
      eq(jobDescriptions.userId, userId)
    ))
    .returning()
  
  return result[0] || null
}

export async function deleteJobDescription(id: string): Promise<boolean> {
  const userId = await getCurrentUserId()
  
  const result = await db
    .delete(jobDescriptions)
    .where(and(
      eq(jobDescriptions.id, id),
      eq(jobDescriptions.userId, userId)
    ))
    .returning({ id: jobDescriptions.id })
  
  return result.length > 0
}

export async function clearAllJobDescriptions(): Promise<number> {
  const userId = await getCurrentUserId()
  
  const result = await db
    .delete(jobDescriptions)
    .where(eq(jobDescriptions.userId, userId))
    .returning({ id: jobDescriptions.id })
  
  return result.length
}

