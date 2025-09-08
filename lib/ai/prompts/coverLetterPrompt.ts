export const PROMPT_VERSION = "mvp-ai-001"

export function buildCoverLetterPrompt(params: {
  jdText: string
  resumeHighlights?: string
  options?: { tone?: string; seniority?: string }
}): string {
  const { jdText, resumeHighlights, options } = params
  const tone = options?.tone ?? "professional"
  const seniority = options?.seniority ?? "mid"
  const safeJd = sanitizeInput(jdText)
  const safeHighlights = sanitizeInput(resumeHighlights ?? "")
  return [
    `Write a concise, ${tone} cover letter targeting a ${seniority}-level role.`,
    `Use 3-5 paragraphs, under 300 words.`,
    `Reference the job description and the candidate's experience honestly.`,
    `Output plain Markdown, no code fences.`,
    `Job description:`,
    safeJd,
    safeHighlights ? `\nCandidate highlights:\n${safeHighlights}` : "",
  ]
    .filter(Boolean)
    .join("\n\n")
}

export function sanitizeInput(input: string): string {
  const trimmed = input.replace(/[\u0000-\u001F\u007F]/g, " ")
  const limited = trimmed.slice(0, 50_000)
  return limited.replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

