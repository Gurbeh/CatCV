import { z } from "zod"

export const CoverLetterSchema = z.object({
  text: z.string().min(1),
  version: z.string().default("mvp-ai-001"),
})

export type CoverLetter = z.infer<typeof CoverLetterSchema>

