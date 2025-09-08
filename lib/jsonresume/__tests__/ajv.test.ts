import { describe, it, expect } from 'vitest'
import { validateJsonResume } from '../ajv'

describe('AJV JSON Resume', () => {
  it('validates a minimal resume', () => {
    const resume = {
      basics: { name: 'Ada Lovelace' },
    }
    const ok = validateJsonResume(resume as any)
    expect(ok).toBe(true)
  })

  it('rejects invalid resume', () => {
    const resume = { basics: { name: 123 } } // invalid type
    const ok = validateJsonResume(resume as any)
    expect(ok).toBe(false)
  })
})

