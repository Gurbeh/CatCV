import { migrateLegacyJobsAction } from '@/lib/actions/jobDescriptions'

// Client-side helper to check for existing localStorage data
export function checkForLegacyData(): string | null {
  if (typeof window === 'undefined') return null
  
  try {
    return window.localStorage.getItem('job-app-assistant:jobs:v1')
  } catch {
    return null
  }
}

// Client-side helper to clear localStorage after migration
export function clearLegacyData(): void {
  if (typeof window === 'undefined') return
  
  try {
    window.localStorage.removeItem('job-app-assistant:jobs:v1')
  } catch {
    // Ignore errors
  }
}

// Migration utility for localStorage data
export async function migrateFromLocalStorage(legacyData: string): Promise<{
  success: boolean
  migratedCount: number
  totalCount: number
  error?: string
}> {
  try {
    const parsed = JSON.parse(legacyData)
    
    if (!Array.isArray(parsed)) {
      return {
        success: false,
        migratedCount: 0,
        totalCount: 0,
        error: 'Invalid localStorage data format. Expected an array of jobs.'
      }
    }
    
    const result = await migrateLegacyJobsAction(parsed)
    
    return {
      success: result.success,
      migratedCount: result.data?.migratedCount || 0,
      totalCount: result.data?.totalCount || 0,
      error: result.error
    }
  } catch (error) {
    return {
      success: false,
      migratedCount: 0,
      totalCount: 0,
      error: error instanceof Error ? error.message : 'Failed to parse localStorage data'
    }
  }
}
