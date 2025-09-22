import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as actions from '@/lib/actions/jobDescriptions'
import * as repo from '@/lib/repositories/jobDescriptions'
import { convertLegacyJobToJobDescription } from '@/lib/utils/legacyConversion'

// Mock the repository
vi.mock('@/lib/repositories/jobDescriptions', () => ({
  createJobDescription: vi.fn(),
  updateJobDescription: vi.fn(),
  deleteJobDescription: vi.fn(),
  getAllJobDescriptions: vi.fn(),
  getJobDescriptionById: vi.fn(),
  clearAllJobDescriptions: vi.fn(),
  migrateLegacyJobsAction: vi.fn(),
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  revalidatePath: vi.fn(),
}))

// Mock the legacy conversion utility
vi.mock('@/lib/utils/legacyConversion', () => ({
  convertLegacyJobToJobDescription: vi.fn(),
}))

describe('JobDescriptions Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createJobDescriptionAction', () => {
    it('should create a job description successfully', async () => {
      const mockJob = {
        id: 'test-id',
        companyName: 'Test Company',
        jobTitle: 'Software Engineer',
        description: 'Test description',
        userId: 'test-user',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      vi.mocked(repo.createJobDescription).mockResolvedValue(mockJob)

      const formData = new FormData()
      formData.append('companyName', 'Test Company')
      formData.append('jobTitle', 'Software Engineer')
      formData.append('jobText', 'Test description')

      const result = await actions.createJobDescriptionAction(formData)

      expect(result.success).toBe(true)
      expect(repo.createJobDescription).toHaveBeenCalledWith({
        companyName: 'Test Company',
        jobTitle: 'Software Engineer',
        description: 'Test description',
        jobUrl: undefined,
        location: undefined,
        salaryRange: undefined,
        employmentType: undefined,
        remote: false,
        requirements: undefined,
        benefits: undefined,
        metadata: undefined,
      })
    })

    it('should handle validation errors', async () => {
      vi.mocked(repo.createJobDescription).mockRejectedValue(new Error('Validation failed'))

      const formData = new FormData()
      formData.append('companyName', '')
      formData.append('jobText', '')

      const result = await actions.createJobDescriptionAction(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Validation failed')
    })
  })

  describe('updateJobDescriptionAction', () => {
    it('should update a job description successfully', async () => {
      const mockUpdatedJob = {
        id: 'test-id',
        companyName: 'Updated Company',
        jobTitle: 'Software Engineer',
        description: 'Updated description',
        userId: 'test-user',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      vi.mocked(repo.updateJobDescription).mockResolvedValue(mockUpdatedJob)

      const updates = {
        companyName: 'Updated Company',
        description: 'Updated description',
      }

      const result = await actions.updateJobDescriptionAction('test-id', updates)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockUpdatedJob)
    })

    it('should handle job not found', async () => {
      vi.mocked(repo.updateJobDescription).mockResolvedValue(null)

      const result = await actions.updateJobDescriptionAction('non-existent-id', {
        companyName: 'Updated Company',
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe('Job description not found')
    })
  })

  describe('deleteJobDescriptionAction', () => {
    it('should delete a job description successfully', async () => {
      vi.mocked(repo.deleteJobDescription).mockResolvedValue(true)

      const result = await actions.deleteJobDescriptionAction('test-id')

      expect(result.success).toBe(true)
    })

    it('should handle job not found', async () => {
      vi.mocked(repo.deleteJobDescription).mockResolvedValue(false)

      const result = await actions.deleteJobDescriptionAction('non-existent-id')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Job description not found')
    })
  })

  describe('getAllJobDescriptionsAction', () => {
    it('should get all job descriptions', async () => {
      const mockJobs = [
        {
          id: 'job-1',
          companyName: 'Company 1',
          jobTitle: 'Job 1',
          description: 'Description 1',
          userId: 'test-user',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'job-2',
          companyName: 'Company 2',
          jobTitle: 'Job 2',
          description: 'Description 2',
          userId: 'test-user',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      vi.mocked(repo.getAllJobDescriptions).mockResolvedValue(mockJobs)

      const result = await actions.getAllJobDescriptionsAction()

      expect(result).toEqual(mockJobs)
    })

    it('should return empty array on error', async () => {
      vi.mocked(repo.getAllJobDescriptions).mockRejectedValue(new Error('Database error'))

      const result = await actions.getAllJobDescriptionsAction()

      expect(result).toEqual([])
    })
  })

  describe('migrateLegacyJobsAction', () => {
    it('should migrate legacy jobs successfully', async () => {
      const legacyJobs = [
        {
          id: 'legacy-1',
          companyName: 'Legacy Company',
          jobText: 'Legacy description',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
          status: 'saved',
        },
      ]

      vi.mocked(repo.migrateLegacyJobsAction).mockResolvedValue({
        success: true,
        data: { migratedCount: 1, totalCount: 1 },
      })

      const result = await actions.migrateLegacyJobsAction(legacyJobs)

      expect(result.success).toBe(true)
      expect(result.data?.migratedCount).toBe(1)
      expect(result.data?.totalCount).toBe(1)
    })

    it('should handle migration errors', async () => {
      const legacyJobs = [
        {
          id: 'legacy-1',
          companyName: 'Legacy Company',
          jobText: 'Legacy description',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
          status: 'saved',
        },
      ]

      vi.mocked(repo.migrateLegacyJobsAction).mockResolvedValue({
        success: false,
        error: 'Migration failed',
      })

      const result = await actions.migrateLegacyJobsAction(legacyJobs)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Migration failed')
    })
  })
})
