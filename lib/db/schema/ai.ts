import { pgTable, uuid, text, timestamp, json, pgEnum } from "drizzle-orm/pg-core"
import { users, resumes } from "../schema"

export const generationStatusEnum = pgEnum("ai_generation_status", [
  "running",
  "succeeded",
  "failed",
])

export const documentTypeEnum = pgEnum("generated_document_type", [
  "resume",
  "cover_letter",
])

export const documentFormatEnum = pgEnum("generated_document_format", [
  "jsonresume",
  "markdown",
])

export const jobDescriptionDrafts = pgTable("job_description_drafts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const aiGenerations = pgTable("ai_generations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  jdSnapshot: text("jd_snapshot").notNull(),
  resumeId: uuid("resume_id")
    .references(() => resumes.id, { onDelete: "set null" }),
  status: generationStatusEnum("status").default("running").notNull(),
  provider: text("provider").notNull(),
  model: text("model").notNull(),
  promptVersion: text("prompt_version").notNull(),
  metricsJson: json("metrics_json"),
  errorJson: json("error_json"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const generatedDocuments = pgTable("generated_documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  generationId: uuid("generation_id")
    .references(() => aiGenerations.id, { onDelete: "cascade" })
    .notNull(),
  type: documentTypeEnum("type").notNull(),
  format: documentFormatEnum("format").notNull(),
  content: json("content").notNull(),
  version: text("version").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

