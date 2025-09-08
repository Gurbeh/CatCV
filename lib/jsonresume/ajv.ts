import Ajv from "ajv"
import resumeSchema from "@jsonresume/schema/schema.json" assert { type: "json" }

export const ajv = new Ajv({
  allErrors: true,
  strict: true,
  allowUnionTypes: false,
  removeAdditional: false,
})

export const validateJsonResume = ajv.compile(resumeSchema as any)

export type AjvError = {
  instancePath?: string
  message?: string
}

export function formatAjvErrors(errors: readonly Ajv.ErrorObject[] | null | undefined): string[] {
  if (!errors) return []
  return errors.map((e) => `${e.instancePath || "/"}: ${e.message || "invalid"}`)
}

