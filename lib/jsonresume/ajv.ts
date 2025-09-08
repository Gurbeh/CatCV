import Ajv from "ajv"
import addFormats from "ajv-formats"
import resumeSchema from "@jsonresume/schema/schema.json" assert { type: "json" }

export const ajv = new Ajv({
  allErrors: true,
  strict: true,
  // The upstream JSON Resume schema uses draft-07 tuple constructs that
  // trigger strict-schema warnings in Ajv v8; allow the schema while keeping
  // data validation strict.
  strictSchema: false,
  allowUnionTypes: false,
  removeAdditional: false,
})

addFormats(ajv)

export const validateJsonResume = ajv.compile<Record<string, unknown>>(resumeSchema as unknown as Record<string, unknown>)

export type AjvError = {
  instancePath?: string
  message?: string
}

export function formatAjvErrors(errors: readonly Ajv.ErrorObject[] | null | undefined): string[] {
  if (!errors) return []
  return errors.map((e) => `${e.instancePath || "/"}: ${e.message || "invalid"}`)
}

