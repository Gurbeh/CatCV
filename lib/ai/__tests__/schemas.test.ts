import { describe, it, expect } from 'vitest'
import { ResumeZodSchema } from '../schemas/resume.zod'
import { CoverLetterSchema } from '../schemas/cover-letter.zod'

describe('zod schemas', () => {
  it('accepts minimal resume', () => {
    const r = ResumeZodSchema.safeParse({ basics: { name: 'Grace Hopper' } })
    expect(r.success).toBe(true)
  })

  it('rejects wrong types', () => {
    const r = ResumeZodSchema.safeParse({ basics: { name: 1 } })
    expect(r.success).toBe(false)
  })

  it('cover letter schema validates', () => {
    const r = CoverLetterSchema.safeParse({ text: 'Hello', version: 'mvp-ai-001' })
    expect(r.success).toBe(true)
  })
})

