import type { JobDescriptionInput } from '@/lib/repositories/jobDescriptions'

export type LegacyJob = {
  id: string
  companyName: string
  jobLink?: string
  jobText: string
  createdAt: string
  updatedAt: string
  status: 'saved' | 'analyzed'
  tailoredResume?: unknown
  coverLetter?: string
}

// Migration helper: convert old Job interface to new JobDescription
export function convertLegacyJobToJobDescription(legacyJob: LegacyJob): JobDescriptionInput {
  return {
    companyName: legacyJob.companyName,
    jobTitle: 'Software Developer', // Default since legacy doesn't have this
    jobUrl: legacyJob.jobLink,
    description: legacyJob.jobText,
    location: undefined,
    salaryRange: undefined,
    employmentType: undefined,
    remote: false,
    requirements: undefined,
    benefits: undefined,
    metadata: {
      legacyId: legacyJob.id,
      legacyStatus: legacyJob.status,
      legacyTailoredResume: legacyJob.tailoredResume,
      legacyCoverLetter: legacyJob.coverLetter,
    },
  }
}
