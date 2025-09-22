"use server"

import { revalidatePath } from 'next/cache'
import * as repo from '@/lib/repositories/jobDescriptions'
import type { JobDescriptionUpdate } from '@/lib/repositories/jobDescriptions'
import { convertLegacyJobToJobDescription, type LegacyJob } from '@/lib/utils/legacyConversion'

// Server action results
export type ActionResult<T = void> = {
  success: boolean
  data?: T
  error?: string
}

// Create job description
export async function createJobDescriptionAction(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  try {
    const input = {
      companyName: formData.get('companyName') as string,
      jobTitle: formData.get('jobTitle') as string || 'Software Developer',
      jobUrl: formData.get('jobUrl') as string || undefined,
      description: formData.get('jobText') as string,
      location: formData.get('location') as string || undefined,
      salaryRange: formData.get('salaryRange') as string || undefined,
      employmentType: formData.get('employmentType') as string || undefined,
      remote: formData.get('remote') === 'true',
      requirements: undefined,
      benefits: undefined,
      metadata: undefined,
    }

    const created = await repo.createJobDescription(input)
    
    revalidatePath('/dashboard')
    return { success: true, data: { id: created.id } }
  } catch (error) {
    console.error('Failed to create job description:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create job description' 
    }
  }
}

// Update job description
export async function updateJobDescriptionAction(
  id: string,
  updates: JobDescriptionUpdate
): Promise<ActionResult<unknown>> {
  try {
    const result = await repo.updateJobDescription(id, updates)
    
    if (!result) {
      return { success: false, error: 'Job description not found' }
    }
    
    revalidatePath('/dashboard')
    revalidatePath(`/jobs/${id}`)
    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to update job description:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update job description' 
    }
  }
}

// Delete job description
export async function deleteJobDescriptionAction(id: string): Promise<ActionResult<void>> {
  try {
    const deleted = await repo.deleteJobDescription(id)
    
    if (!deleted) {
      return { success: false, error: 'Job description not found' }
    }
    
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete job description:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete job description' 
    }
  }
}

// Clear all job descriptions
export async function clearAllJobDescriptionsAction(): Promise<ActionResult<{ count: number }>> {
  try {
    const count = await repo.clearAllJobDescriptions()
    revalidatePath('/dashboard')
    return { success: true, data: { count } }
  } catch (error) {
    console.error('Failed to clear job descriptions:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to clear job descriptions' 
    }
  }
}

// Get all job descriptions (for server components)
export async function getAllJobDescriptionsAction() {
  try {
    return await repo.getAllJobDescriptions()
  } catch (error) {
    console.error('Failed to get job descriptions:', error)
    return []
  }
}

// Get job description by ID (for server components)
export async function getJobDescriptionByIdAction(id: string) {
  try {
    return await repo.getJobDescriptionById(id)
  } catch (error) {
    console.error('Failed to get job description:', error)
    return null
  }
}

// Migration action: convert localStorage data to database
export async function migrateLegacyJobsAction(legacyJobs: LegacyJob[]): Promise<ActionResult<{ migratedCount: number; totalCount: number }>> {
  try {
    let migratedCount = 0
    
    for (const legacyJob of legacyJobs) {
      try {
        const jobDescriptionInput = convertLegacyJobToJobDescription(legacyJob)
        await repo.createJobDescription(jobDescriptionInput)
        migratedCount++
      } catch (error) {
        console.error(`Failed to migrate job ${legacyJob.id}:`, error)
        // Continue with other jobs
      }
    }
    
    revalidatePath('/dashboard')
    return { 
      success: true, 
      data: { migratedCount, totalCount: legacyJobs.length } 
    }
  } catch (error) {
    console.error('Failed to migrate legacy jobs:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to migrate legacy jobs' 
    }
  }
}
