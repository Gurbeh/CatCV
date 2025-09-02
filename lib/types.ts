export type JobId = string

export interface Job {
  id: JobId
  companyName: string
  jobLink?: string
  jobText: string
  createdAt: string
  updatedAt: string
  status: 'saved' | 'analyzed'
}

export interface JobInput {
  companyName: string
  jobLink?: string
  jobText: string
}
