export const runtime = 'nodejs'

import { NextRequest } from 'next/server'
import { z } from 'zod'
import { streamText } from 'ai'
import { getModel, getModelName } from '@/lib/ai/model'
import { buildCoverLetterPrompt, PROMPT_VERSION } from '@/lib/ai/prompts/coverLetterPrompt'
import { db, aiGenerations, generatedDocuments } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { getAuthSession } from '@/lib/supabase/server'

const Query = z.object({ generationId: z.string().uuid(), jdText: z.string(), pro: z.boolean().optional() })

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const parsed = Query.safeParse({
    generationId: url.searchParams.get('generationId') || undefined,
    jdText: url.searchParams.get('jdText') || undefined,
    pro: url.searchParams.get('pro') === 'true' ? true : undefined,
  })
  if (!parsed.success) return new Response('Bad Request', { status: 400 })

  const { data: auth } = await getAuthSession()
  const userId = auth.session?.user?.id
  if (!userId) return new Response('Unauthorized', { status: 401 })

  const [gen] = await db
    .select()
    .from(aiGenerations)
    .where(eq(aiGenerations.id, parsed.data.generationId as unknown as typeof aiGenerations.id['_']['data']))
    .limit(1)
  if (!gen || gen.userId !== userId) return new Response('Not found', { status: 404 })

  const prompt = buildCoverLetterPrompt({ jdText: parsed.data.jdText })
  const model = getModel(parsed.data.pro ? 'pro' : 'default')
  const s = await streamText({
    model,
    prompt,
    onFinish: async ({ text }: { text: string }) => {
      try {
        await db.insert(generatedDocuments).values({
          userId,
          generationId: gen.id,
          type: 'cover_letter',
          format: 'markdown',
          content: text as unknown as Record<string, unknown>,
          version: PROMPT_VERSION,
        })
      } catch {/* no-op */}
    },
  })

  // Let the SDK format the SSE response
  return s.toAIStreamResponse({ headers: { 'X-Model': getModelName(parsed.data.pro ? 'pro' : 'default') } } as unknown as ResponseInit)
}

