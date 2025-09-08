export const PROMPT_VERSION = "mvp-ai-001"

export function buildResumePrompt(params: {
  jdText: string
  baseResumeText?: string
  options?: { tone?: string; seniority?: string }
}): string {
  const { jdText, baseResumeText, options } = params
  const tone = options?.tone ?? "professional"
  const seniority = options?.seniority ?? "mid"

  const safeJd = sanitizeInput(jdText)
  const safeBase = sanitizeInput(baseResumeText ?? "")

  return [
    `You are an assistant that outputs ONLY a JSON object conforming to JSON Resume v1.`,
    `Do not include markdown backticks or extra commentary.`,
    `Tone: ${tone}. Target seniority: ${seniority}.`,
    `Tailor the resume to this job description:`,
    safeJd,
    safeBase ? `\nBase resume/context (use facts only, do not invent):\n${safeBase}` : "",
    `\nRespond with a single JSON object only.`,
  ]
    .filter(Boolean)
    .join("\n\n")
}

export function sanitizeInput(input: string): string {
  // Basic sanitization per rules: strip control chars, limit length, neutralize angle brackets
  const trimmed = input.replace(/[\u0000-\u001F\u007F]/g, " ")
  const limited = trimmed.slice(0, 50_000)
  return limited.replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

