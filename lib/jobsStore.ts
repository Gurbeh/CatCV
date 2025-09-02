import { nanoid } from 'nanoid'
import { z } from 'zod'
import { clearAll as storageClear, loadRaw, saveRaw } from './storage'
import type { Job, JobId, JobInput } from './types'

const JobSchema = z.object({
  id: z.string(),
  companyName: z.string().min(1),
  jobLink: z.string().url().optional(),
  jobText: z.string().min(1),
  createdAt: z.string(),
  updatedAt: z.string(),
  status: z.union([z.literal('saved'), z.literal('analyzed')]),
})

const JobInputSchema = z.object({
  companyName: z.string().min(1),
  jobLink: z.preprocess(
    (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
    z.string().url().optional(),
  ),
  jobText: z.string().min(1),
})

const JobsArraySchema = z.array(JobSchema)

function load(): Job[] {
  const raw = loadRaw()
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    const result = JobsArraySchema.safeParse(parsed)
    if (result.success) return result.data
    return []
  } catch {
    return []
  }
}

function persist(jobs: Job[]) {
  saveRaw(JSON.stringify(jobs))
}

export function getAll(): Job[] {
  return load()
}

export function get(id: JobId): Job | undefined {
  return load().find((j) => j.id === id)
}

export function create(input: JobInput): Job {
  const parsed = JobInputSchema.parse(input)
  const now = new Date().toISOString()
  const job: Job = {
    id: nanoid(),
    companyName: parsed.companyName,
    ...(parsed.jobLink ? { jobLink: parsed.jobLink } : {}),
    jobText: parsed.jobText,
    createdAt: now,
    updatedAt: now,
    status: 'saved',
  }
  const current = load()
  const updated = [job, ...current]
  persist(updated)
  return job
}

export function update(id: JobId, patch: Partial<Omit<Job, 'id' | 'createdAt'>>) {
  const current = load()
  const idx = current.findIndex((j) => j.id === id)
  if (idx === -1) return
  const updated: Job = {
    ...current[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  }
  JobSchema.parse(updated)
  current[idx] = updated
  persist(current)
  return updated
}

export function remove(id: JobId) {
  const current = load()
  const updated = current.filter((j) => j.id !== id)
  persist(updated)
}

export function clearAll() {
  storageClear()
}

export const schemas = { JobSchema, JobInputSchema }
