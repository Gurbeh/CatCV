import { z } from "zod"

// Minimal JSON Resume v1 Zod mirror (expand as needed)
export const ResumeZodSchema = z.object({
  basics: z
    .object({
      name: z.string().min(1),
      email: z.string().email().optional(),
      label: z.string().optional(),
      summary: z.string().optional(),
      location: z
        .object({
          city: z.string().optional(),
          countryCode: z.string().optional(),
        })
        .partial()
        .optional(),
      profiles: z
        .array(
          z.object({
            network: z.string().optional(),
            username: z.string().optional(),
            url: z.string().url().optional(),
          })
        )
        .optional(),
    })
    .strict(),
  work: z
    .array(
      z
        .object({
          name: z.string().min(1),
          position: z.string().optional(),
          startDate: z.string().optional(),
          endDate: z.string().optional(),
          summary: z.string().optional(),
          highlights: z.array(z.string()).optional(),
        })
        .strict()
    )
    .optional(),
  education: z
    .array(
      z
        .object({
          institution: z.string().min(1),
          area: z.string().optional(),
          studyType: z.string().optional(),
          startDate: z.string().optional(),
          endDate: z.string().optional(),
        })
        .strict()
    )
    .optional(),
  skills: z
    .array(
      z
        .object({
          name: z.string().min(1),
          level: z.string().optional(),
          keywords: z.array(z.string()).optional(),
        })
        .strict()
    )
    .optional(),
  projects: z
    .array(
      z
        .object({
          name: z.string().min(1),
          description: z.string().optional(),
          url: z.string().url().optional(),
          highlights: z.array(z.string()).optional(),
        })
        .strict()
    )
    .optional(),
  meta: z
    .object({
      version: z.string().optional(),
      canonical: z.string().url().optional(),
    })
    .partial()
    .optional(),
})
  .strict()

export type ResumeZod = z.infer<typeof ResumeZodSchema>

