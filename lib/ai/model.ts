"use server"

import { createOpenAI } from "@ai-sdk/openai"

export type ModelKind = "default" | "pro"

export function getModelName(kind: ModelKind = "default"): string {
  const name = kind === "pro" ? process.env.AI_MODEL_PRO : process.env.AI_MODEL
  if (!name) {
    throw new Error(
      kind === "pro"
        ? "AI_MODEL_PRO env var is required for pro model"
        : "AI_MODEL env var is required for default model"
    )
  }
  return name
}

export function getOpenAI(kind: ModelKind = "default") {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error("OPENAI_API_KEY env var is required")
  return createOpenAI({ apiKey, compatibility: "strict" })
}

export function getModel(kind: ModelKind = "default") {
  const openai = getOpenAI(kind)
  const modelName = getModelName(kind)
  return openai(modelName)
}

