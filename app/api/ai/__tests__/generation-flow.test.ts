import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mocks
vi.mock('ai', () => ({
  generateObject: vi.fn(async () => ({
    object: { basics: { name: 'Test User' } },
    usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
  })),
}))

vi.mock('@/lib/ai/model', () => ({
  getOpenAI: () => ({}),
  getModelName: () => 'mock-model',
}))

vi.mock('@/lib/supabase/server', () => ({
  getAuthSession: async () => ({ data: { session: { user: { id: 'u1' } } } }),
}))

// Minimal in-memory DB mock
type Row = Record<string, any>
const mem = {
  resumes: [{ id: 'r1', userId: 'u1', jsonResume: { basics: { name: 'Ada' } } }] as Row[],
  aiGenerations: [] as Row[],
  generatedDocuments: [] as Row[],
}

const resumes = {} as any
const aiGenerations = {} as any
const generatedDocuments = {} as any

vi.mock('@/lib/db', () => ({
  db: {
    select: () => ({
      from: (table: any) => ({
        where: (_: any) => ({
          limit: (n: number) => {
            if (table === resumes) return mem.resumes.slice(0, n)
            if (table === aiGenerations) return mem.aiGenerations.slice(0, n)
            if (table === generatedDocuments) return mem.generatedDocuments.slice(0, n)
            return []
          },
        }),
      }),
    }),
    insert: (table: any) => ({
      values: (val: any) => ({
        returning: () => {
          if (table === aiGenerations) {
            const row = { id: 'g1', ...val }
            mem.aiGenerations.push(row)
            return [row]
          }
          if (table === generatedDocuments) {
            const row = { id: 'd1', ...val }
            mem.generatedDocuments.push(row)
            return [row]
          }
          return [val]
        },
      }),
    }),
    update: (table: any) => ({
      set: (val: any) => ({
        where: (_: any) => {
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
    const reqPost: any = {
      json: async () => ({ jdText: 'Great role', resumeId: 'r1' }),
      headers: new Headers(),
      ip: '127.0.0.1',
    }
    const resPost = await GEN_POST(reqPost as any)
    expect(resPost.status).toBe(200)
    const bodyPost = await resPost.json()
    expect(bodyPost.status).toBe('succeeded')
    expect(bodyPost.id).toBe('g1')

    // Check status
    const reqGet: any = { url: 'http://localhost/api/ai/generations?id=g1' }
    const resGet = await GEN_GET(reqGet as any)
    expect(resGet.status).toBe(200)
    const bodyGet = await resGet.json()
    expect(bodyGet.status).toBe('succeeded')

    // Export PDF for the generated resume document
    const reqPdf: any = {
      json: async () => ({ documentId: 'd1', kind: 'resume' }),
    }
    const resPdf = await PDF_POST(reqPdf as any)
    expect(resPdf.status).toBe(200)
    expect(resPdf.headers.get('Content-Type')).toContain('application/pdf')
  })
})

