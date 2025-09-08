import { describe, it, expect } from 'vitest'
import { buildResumePrompt, sanitizeInput, PROMPT_VERSION as PV1 } from '../prompts/resumePrompt'
import { buildCoverLetterPrompt, PROMPT_VERSION as PV2 } from '../prompts/coverLetterPrompt'

describe('prompts', () => {
  it('sanitizes angle brackets and control characters', () => {
    const input = '<script>\u0001X</script>'
    const out = sanitizeInput(input)
    expect(out).not.toContain('<')
    expect(out).toContain('&lt;')
    expect(out).not.toContain('\u0001')
  })

  it('builds resume prompt including tone and seniority', () => {
    const p = buildResumePrompt({ jdText: 'JD text', options: { tone: 'friendly', seniority: 'senior' } })
    expect(p).toContain('friendly')
    expect(p).toContain('senior')
    expect(p).toContain('JD text')
    expect(typeof PV1).toBe('string')
  })

  it('builds cover letter prompt', () => {
    const p = buildCoverLetterPrompt({ jdText: 'Role description', resumeHighlights: 'Highlights' })
    expect(p).toContain('Role description')
    expect(p).toContain('Highlights')
    expect(typeof PV2).toBe('string')
  })
})

