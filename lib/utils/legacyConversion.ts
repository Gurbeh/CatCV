import type { JobDescriptionInput } from '@/lib/repositories/jobDescriptions'

// Migration helper: convert old Job interface to new JobDescription
export function convertLegacyJobToJobDescription(legacyJob: {
  id: string
  companyName: string
  jobLink?: string
  jobText: string
  createdAt: string
  updatedAt: string
  status: 'saved' | 'analyzed'
  tailoredResume?: any
  coverLetter?: string
}): JobDescriptionInput {
  return {
    companyName: legacyJob.companyName,
    jobTitle: 'Software Developer', // Default since legacy doesn't have this
    jobUrl: legacyJob.jobLink,
    description: legacyJob.jobText,
    location: null,
    salaryRange: null,
    employmentType: null,
    remote: false,
    requirements: null,
    benefits: null,
    metadata: {
      legacyId: legacyJob.id,
      legacyStatus: legacyJob.status,
      legacyTailoredResume: legacyJob.tailoredResume,
      legacyCoverLetter: legacyJob.coverLetter,
    },
  }
}
