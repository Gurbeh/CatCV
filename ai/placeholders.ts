import type { Job } from '@/lib/types'
import type { JsonResume } from '@/lib/types/json-resume'

export interface TailorInput {
  baseResume: JsonResume
  job: Job
}

export interface TailorResult {
  tailoredResume: JsonResume
  coverLetter: string
}

// Placeholder: in MVP, return base resume unchanged and a basic cover letter template.
export async function analyzeJob(_job: Job) {
  return Promise.resolve()
}

export async function tailorResumeAndCoverLetter(input: TailorInput): Promise<TailorResult> {
  const { baseResume, job } = input
  const name = baseResume.basics?.name ?? 'Candidate'
  const company = job.companyName
  const jdSnippet = job.jobText.slice(0, 300)

  const coverLetter = [
    `Dear Hiring Manager at ${company},`,
    '',
    `I am excited to apply for the role at ${company}. My background aligns well with the requirements described, and I would welcome the opportunity to contribute.`,
    '',
    `Highlights:`,
    `- Relevant experience from my resume tailored to this role.`,
    `- Skills aligned with the job description.`,
    '',
    `Job description snippet for context:`,
    jdSnippet,
    '',
    `Sincerely,`,
    name,
  ].join('\n')

  // For MVP placeholder, return the base resume unchanged
  return {
    tailoredResume: baseResume,
    coverLetter,
  }
}

