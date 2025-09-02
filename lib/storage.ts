const STORAGE_KEY = 'job-app-assistant:jobs:v1'

export function loadRaw(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function saveRaw(value: string) {
  try {
    localStorage.setItem(STORAGE_KEY, value)
  } catch {
    // ignore
  }
}

export function clearAll() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

export function getStorageKey() {
  return STORAGE_KEY
}

