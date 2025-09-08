export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAuthSession } from '@/lib/supabase/server'
import { db, generatedDocuments } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { renderToStream } from '@react-pdf/renderer'

const Body = z.object({ documentId: z.string().uuid(), kind: z.enum(['resume', 'cover_letter']) })

export async function POST(req: NextRequest) {
  const { data: auth } = await getAuthSession()
  const userId = auth.session?.user?.id
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const json = await req.json().catch(() => ({}))
  const parsed = Body.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: 'Bad Request' }, { status: 400 })

  const [doc] = await db
    .select()
    .from(generatedDocuments)
    .where(eq(generatedDocuments.id, parsed.data.documentId as unknown as typeof generatedDocuments.id['_']['data']))
    .limit(1)
  if (!doc || doc.userId !== userId) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Simple theme placeholder to satisfy route; implement full theme under lib/pdf/theme/*
  const { default: React } = await import('react')
  const { Document, Page, Text, View, StyleSheet } = await import('@react-pdf/renderer')

  const styles = StyleSheet.create({
    page: { padding: 24 },
    h1: { fontSize: 18, marginBottom: 8 },
    p: { fontSize: 12, marginBottom: 6 },
  })

  const Content = () => (
    React.createElement(
      Document,
      null,
      React.createElement(
        Page,
        { size: 'A4', style: styles.page },
        React.createElement(Text, { style: styles.h1 }, parsed.data.kind === 'resume' ? 'Resume' : 'Cover Letter'),
        React.createElement(View, null,
          React.createElement(Text, { style: styles.p }, typeof doc.content === 'string' ? doc.content : JSON.stringify(doc.content, null, 2))
        )
      )
    )
  )

  const stream = await renderToStream(React.createElement(Content))
  return new NextResponse(stream as unknown as ReadableStream, {
    headers: {
      'Content-Type': 'application/pdf',
      'Cache-Control': 'no-store',
    },
  })
}

