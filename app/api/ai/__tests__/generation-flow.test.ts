import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mocks
vi.mock('ai', () => ({
  generateObject: vi.fn(async () => ({
    object: { basics: { name: 'Test User' } },
    usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
  })),
}))

vi.mock('@/lib/ai/model', () => ({
  getModel: () => ({}),
  getModelName: () => 'mock-model',
}))

vi.mock('@/lib/supabase/server', () => ({
  getAuthSession: async () => ({ data: { session: { user: { id: 'u1' } } } }),
}))

// Minimal in-memory DB mock
type Row = Record<string, unknown>
const RESUME_ID = '00000000-0000-0000-0000-000000000001'
const DOC_ID = '00000000-0000-0000-0000-000000000002'
const mem = {
  resumes: [{ id: RESUME_ID, userId: 'u1', jsonResume: { basics: { name: 'Ada' } } }] as Row[],
  aiGenerations: [] as Row[],
  generatedDocuments: [] as Row[],
}

const resumes = {} as Record<string, never>
const aiGenerations = {} as Record<string, never>
const generatedDocuments = {} as Record<string, never>

vi.mock('@/lib/db', () => ({
  db: {
    select: () => ({
      from: (table: unknown) => ({
        where: (_: unknown) => ({
          limit: (n: number) => {
            if (table === resumes) return mem.resumes.slice(0, n)
            if (table === aiGenerations) return mem.aiGenerations.slice(0, n)
            if (table === generatedDocuments) return mem.generatedDocuments.slice(0, n)
            return []
          },
        }),
      }),
    }),
    insert: (table: unknown) => ({
      values: (val: Row) => ({
        returning: () => {
          if (table === aiGenerations) {
            const row = { id: 'g1', ...val }
            mem.aiGenerations.push(row)
            return [row]
          }
          if (table === generatedDocuments) {
            const row = { id: DOC_ID, ...val }
            mem.generatedDocuments.push(row)
            return [row]
          }
          return [val]
        },
      }),
    }),
    update: (table: unknown) => ({
      set: (val: Row) => ({
        where: (_: unknown) => {
          if (table === aiGenerations) {
            mem.aiGenerations = mem.aiGenerations.map((r) => ({ ...r, ...val }))
          }
          return []
        },
      }),
    }),
  },
  aiGenerations,
  generatedDocuments,
  resumes,
}))

// Some modules used by routes but not relevant to logic can be left as-is

describe('AI generation -> export flow (mocked)', () => {
  beforeEach(() => {
    mem.aiGenerations.length = 0
    mem.generatedDocuments.length = 0
  })

  it('creates a generation, stores resume doc, and exports PDF', async () => {
    const { POST: GEN_POST, GET: GEN_GET } = await import('../../ai/generations/route')
    const { POST: PDF_POST } = await import('../../ai/exports/pdf/route')

    // Create generation
    const reqPost = {
      json: async () => ({ jdText: 'Great role', resumeId: RESUME_ID }),
      headers: new Headers(),
      ip: '127.0.0.1',
    }
    const resPost = await GEN_POST(reqPost as unknown as Request)
    expect(resPost.status).toBe(200)
    const bodyPost = await resPost.json()
    expect(bodyPost.status).toBe('succeeded')
    expect(bodyPost.id).toBe('g1')

    // Check status
    const reqGet = { url: 'http://localhost/api/ai/generations?id=g1' } as unknown as Request
    const resGet = await GEN_GET(reqGet)
    expect(resGet.status).toBe(200)
    const bodyGet = await resGet.json()
    expect(bodyGet.status).toBe('succeeded')

    // Export PDF for the generated resume document
    // Ensure a document exists for export in the mock store
    mem.generatedDocuments.push({
      id: DOC_ID,
      userId: 'u1',
      generationId: 'g1',
      type: 'resume',
      format: 'jsonresume',
      content: { basics: { name: 'Test User' } },
      version: 'mvp-ai-001',
    })

    const reqPdf = { json: async () => ({ documentId: DOC_ID, kind: 'resume' }) } as unknown as Request
    const resPdf = await PDF_POST(reqPdf)
    expect(resPdf.status).toBe(200)
    expect(resPdf.headers.get('Content-Type')).toContain('application/pdf')
  })
})

