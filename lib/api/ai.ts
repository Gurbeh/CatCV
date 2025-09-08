export async function createGeneration(input: {
  jdText: string
  resumeId?: string
  pro?: boolean
  options?: { tone?: string; seniority?: string }
}) {
  const res = await fetch('/api/ai/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function getGenerationStatus(id: string) {
  const res = await fetch(`/api/ai/generations?id=${encodeURIComponent(id)}`)
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function streamCoverLetter(params: { generationId: string; jdText: string; pro?: boolean }) {
  const url = `/api/ai/cover-letter/stream?generationId=${encodeURIComponent(params.generationId)}&jdText=${encodeURIComponent(params.jdText)}${params.pro ? '&pro=true' : ''}`
  const res = await fetch(url)
  if (!res.ok || !res.body) throw new Error('Stream failed')
  return res.body
}

export async function exportPdf(input: { documentId: string; kind: 'resume' | 'cover_letter' }) {
  const res = await fetch('/api/ai/exports/pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error(await res.text())
  return await res.blob()
}

