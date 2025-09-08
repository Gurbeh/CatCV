export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getModel, getModelName } from '@/lib/ai/model'
import { generateObject } from 'ai'
import type { LanguageModelV1 } from 'ai'
import { ResumeZodSchema } from '@/lib/ai/schemas/resume.zod'
import { buildResumePrompt, PROMPT_VERSION } from '@/lib/ai/prompts/resumePrompt'
import { validateJsonResume, formatAjvErrors } from '@/lib/jsonresume/ajv'
import { db, aiGenerations, generatedDocuments, resumes as resumesTable } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { enforceRateLimits } from '@/lib/rate-limit'
import { getAuthSession } from '@/lib/supabase/server'

const CreateSchema = z.object({
  jdId: z.string().uuid().optional(),
  jdText: z.string().optional(),
  resumeId: z.string().uuid().optional(),
  pro: z.boolean().optional(),
  options: z.object({ tone: z.string().optional(), seniority: z.string().optional() }).optional(),
})

export async function POST(req: NextRequest) {
  const { data: auth } = await getAuthSession()
  const userId = auth.session?.user?.id
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const xff = req.headers.get('x-forwarded-for') || ''
  const xri = req.headers.get('x-real-ip') || ''
  const ip = (xff.split(',')[0] || xri || 'unknown').trim()
  const rl = await enforceRateLimits({ userId, ip })
  if (!rl.ok) {
    return NextResponse.json(
      { error: `Rate limit exceeded (${rl.scope})`, retryAfter: rl.retryAfter },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter ?? 60) } }
    )
  }

  const body = await req.json().catch(() => ({}))
  const parsed = CreateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const { jdText, resumeId, pro, options } = parsed.data
  if (!jdText) {
    return NextResponse.json({ error: 'jdText is required in this MVP' }, { status: 400 })
  }

  // Resolve resume (if provided) and validate JSON Resume via AJV
  let baseResumeText: string | undefined
  if (resumeId) {
    const [resume] = await db
      .select()
      .from(resumesTable)
      .where(eq(resumesTable.id, resumeId as unknown as typeof resumesTable.id['_']['data']))
      .limit(1)
    if (!resume || resume.userId !== userId) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }
    const valid = validateJsonResume(resume.jsonResume as Record<string, unknown>)
    if (!valid) {
      const errors = formatAjvErrors(validateJsonResume.errors || [])
      return NextResponse.json({ error: 'Resume schema invalid', errors }, { status: 400 })
    }
    baseResumeText = JSON.stringify(resume.jsonResume)
  }

  // Persist generation row (running)
  const [gen] = await db
    .insert(aiGenerations)
    .values({
      userId,
      jdSnapshot: jdText,
      resumeId: resumeId as unknown as typeof resumesTable.id['_']['data'],
      status: 'running',
      provider: 'openai',
      model: getModelName(pro ? 'pro' : 'default'),
      promptVersion: PROMPT_VERSION,
    })
    .returning()

  try {
    const prompt = buildResumePrompt({ jdText, baseResumeText, options })
    const model = getModel(pro ? 'pro' : 'default') as unknown as LanguageModelV1
    const start = Date.now()
    const result = await generateObject({ model, schema: ResumeZodSchema, prompt })
    const durationMs = Date.now() - start

    // Validate result against JSON Resume via AJV strictly
    const jsonResume = result.object
    const valid = validateJsonResume(jsonResume as Record<string, unknown>)
    if (!valid) {
      const errors = formatAjvErrors(validateJsonResume.errors || [])
      throw new Error(`Generated resume failed JSON Resume validation: ${errors.join('; ')}`)
    }

    await db.insert(generatedDocuments).values({
      userId,
      generationId: gen.id,
      type: 'resume',
      format: 'jsonresume',
      content: jsonResume as unknown as Record<string, unknown>,
      version: PROMPT_VERSION,
    })

    await db
      .update(aiGenerations)
      .set({ status: 'succeeded', metricsJson: { durationMs, usage: result.usage } as Record<string, unknown> })
      .where(eq(aiGenerations.id, gen.id))

    return NextResponse.json({ id: gen.id, status: 'succeeded' })
  } catch (err: unknown) {
    await db
      .update(aiGenerations)
      .set({ status: 'failed', errorJson: { message: String((err as Error)?.message || 'Failed') } as Record<string, unknown> })
      .where(eq(aiGenerations.id, gen.id))
    return NextResponse.json({ id: gen.id, status: 'failed', error: 'Generation failed' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const { data: auth } = await getAuthSession()
  const userId = auth.session?.user?.id
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [row] = await db
    .select()
    .from(aiGenerations)
    .where(eq(aiGenerations.id, id as unknown as typeof aiGenerations.id['_']['data']))
    .limit(1)
  if (!row || row.userId !== userId) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ id: row.id, status: row.status, metrics: row.metricsJson })
}

