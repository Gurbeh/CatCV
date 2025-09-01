import * as React from 'react'
import type { Job, JobInput, JobId } from './types'
import * as store from './jobsStore'

interface JobsContextValue {
  jobs: Job[]
  refresh: () => void
  createJob: (input: JobInput) => Job
  updateJob: (id: JobId, patch: Partial<Omit<Job, 'id' | 'createdAt'>>) => Job | undefined
  removeJob: (id: JobId) => void
  clearAll: () => void
}

const JobsContext = React.createContext<JobsContextValue | undefined>(undefined)

export function JobsProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = React.useState<Job[]>(() => store.getAll())

  const refresh = React.useCallback(() => setJobs(store.getAll()), [])

  const createJob = React.useCallback((input: JobInput) => {
    const j = store.create(input)
    setJobs((prev) => [j, ...prev])
    return j
  }, [])

  const updateJob = React.useCallback<JobsContextValue['updateJob']>((id, patch) => {
    const updated = store.update(id, patch)
    if (updated) setJobs((prev) => prev.map((j) => (j.id === id ? updated : j)))
    return updated
  }, [])

  const removeJob = React.useCallback((id: JobId) => {
    store.remove(id)
    setJobs((prev) => prev.filter((j) => j.id !== id))
  }, [])

  const clearAll = React.useCallback(() => {
    store.clearAll()
    setJobs([])
  }, [])

  const value = React.useMemo(
    () => ({ jobs, refresh, createJob, updateJob, removeJob, clearAll }),
    [jobs, refresh, createJob, updateJob, removeJob, clearAll],
  )

  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>
}

export function useJobs() {
  const ctx = React.useContext(JobsContext)
  if (!ctx) throw new Error('useJobs must be used within JobsProvider')
  return ctx
}

