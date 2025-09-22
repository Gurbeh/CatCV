import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { db } from '@/lib/db'
import { jobDescriptions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import * as repo from '@/lib/repositories/jobDescriptions'
import { convertLegacyJobToJobDescription } from '@/lib/utils/legacyConversion'

// Mock the auth functions
vi.mock('@/lib/supabase/server', () => ({
  getServerSupabase: vi.fn(() => ({
    auth: {
      getSession: vi.fn(() => ({
        data: {
          session: {
            user: {
              id: 'test-user-id'
            }
          }
        }
      }))
    }
  }))
}))

describe('JobDescriptions Repository', () => {
  const testUserId = 'test-user-id'
  
  beforeEach(async () => {
    // Clean up any existing test data
    await db.delete(jobDescriptions).where(eq(jobDescriptions.userId, testUserId))
  })
  
  afterEach(async () => {
    // Clean up test data
    await db.delete(jobDescriptions).where(eq(jobDescriptions.userId, testUserId))
  })

  it('should create a job description', async () => {
    const input = {
      companyName: 'Test Company',
      jobTitle: 'Software Engineer',
      description: 'Test job description',
      jobUrl: 'https://example.com/job',
    }

    const result = await repo.createJobDescription(input)
    
    expect(result).toBeDefined()
    expect(result.companyName).toBe(input.companyName)
    expect(result.jobTitle).toBe(input.jobTitle)
    expect(result.description).toBe(input.description)
    expect(result.jobUrl).toBe(input.jobUrl)
    expect(result.userId).toBe(testUserId)
  })

  it('should get all job descriptions for a user', async () => {
    // Create test data
    await db.insert(jobDescriptions).values([
      {
        userId: testUserId,
        companyName: 'Company 1',
        jobTitle: 'Job 1',
        description: 'Description 1',
      },
      {
        userId: testUserId,
        companyName: 'Company 2',
        jobTitle: 'Job 2',
        description: 'Description 2',
      }
    ])

    const result = await repo.getAllJobDescriptions()
    
    expect(result).toHaveLength(2)
    expect(result[0].companyName).toBe('Company 1')
    expect(result[1].companyName).toBe('Company 2')
  })

  it('should get a job description by ID', async () => {
    const inserted = await db.insert(jobDescriptions).values({
      userId: testUserId,
      companyName: 'Test Company',
      jobTitle: 'Test Job',
      description: 'Test Description',
    }).returning()

    const result = await repo.getJobDescriptionById(inserted[0].id)
    
    expect(result).toBeDefined()
    expect(result?.id).toBe(inserted[0].id)
    expect(result?.companyName).toBe('Test Company')
  })

  it('should update a job description', async () => {
    const inserted = await db.insert(jobDescriptions).values({
      userId: testUserId,
      companyName: 'Original Company',
      jobTitle: 'Original Job',
      description: 'Original Description',
    }).returning()

    const updates = {
      companyName: 'Updated Company',
      description: 'Updated Description',
    }

    const result = await repo.updateJobDescription(inserted[0].id, updates)
    
    expect(result).toBeDefined()
    expect(result?.companyName).toBe('Updated Company')
    expect(result?.description).toBe('Updated Description')
    expect(result?.jobTitle).toBe('Original Job') // Should remain unchanged
  })

  it('should delete a job description', async () => {
    const inserted = await db.insert(jobDescriptions).values({
      userId: testUserId,
      companyName: 'Test Company',
      jobTitle: 'Test Job',
      description: 'Test Description',
    }).returning()

    const result = await repo.deleteJobDescription(inserted[0].id)
    
    expect(result).toBe(true)
    
    // Verify it's deleted
    const found = await repo.getJobDescriptionById(inserted[0].id)
    expect(found).toBeNull()
  })

  it('should convert legacy job to job description', () => {
    const legacyJob = {
      id: 'legacy-id',
      companyName: 'Legacy Company',
      jobLink: 'https://legacy.com/job',
      jobText: 'Legacy job description',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
      status: 'saved' as const,
      tailoredResume: { basics: { name: 'John Doe' } },
      coverLetter: 'Legacy cover letter',
    }

    const result = convertLegacyJobToJobDescription(legacyJob)
    
    expect(result.companyName).toBe(legacyJob.companyName)
    expect(result.jobUrl).toBe(legacyJob.jobLink)
    expect(result.description).toBe(legacyJob.jobText)
    expect(result.metadata?.legacyId).toBe(legacyJob.id)
    expect(result.metadata?.legacyStatus).toBe(legacyJob.status)
    expect(result.metadata?.legacyTailoredResume).toEqual(legacyJob.tailoredResume)
    expect(result.metadata?.legacyCoverLetter).toBe(legacyJob.coverLetter)
  })
})
