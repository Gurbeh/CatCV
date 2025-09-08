import {
  pgTable,
  uuid,
  text,
  timestamp,
  json,
  pgEnum,
  boolean,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums for application status
export const applicationStatusEnum = pgEnum('application_status', [
  'draft',
  'applied',
  'interview',
  'offer',
  'rejected',
  'withdrawn',
]);

// Users table - extends Supabase auth.users
export const users = pgTable('users', {
  id: uuid('id').primaryKey(), // matches auth.users.id
  email: text('email').notNull().unique(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Resumes table - stores JSON Resume data
export const resumes = pgTable('resumes', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  title: text('title').notNull(),
  jsonResume: json('json_resume').notNull(), // JSON Resume schema
  isDefault: boolean('is_default').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Job descriptions table - stores job postings with metadata
export const jobDescriptions = pgTable('job_descriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  companyName: text('company_name').notNull(),
  jobTitle: text('job_title').notNull(),
  jobUrl: text('job_url'),
  description: text('description').notNull(),
  location: text('location'),
  salaryRange: text('salary_range'),
  employmentType: text('employment_type'), // full-time, part-time, contract, etc.
  remote: boolean('remote').default(false),
  requirements: json('requirements'), // array of requirements
  benefits: json('benefits'), // array of benefits
  metadata: json('metadata'), // additional structured data
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Applications table - links resumes to job descriptions
export const applications = pgTable('applications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  resumeId: uuid('resume_id')
    .references(() => resumes.id, { onDelete: 'cascade' })
    .notNull(),
  jobDescriptionId: uuid('job_description_id')
    .references(() => jobDescriptions.id, { onDelete: 'cascade' })
    .notNull(),
  status: applicationStatusEnum('status').default('draft').notNull(),
  appliedAt: timestamp('applied_at'),
  coverLetter: text('cover_letter'),
  tailoredResume: json('tailored_resume'), // customized resume for this application
  notes: text('notes'),
  followUpDate: timestamp('follow_up_date'),
  interviewDate: timestamp('interview_date'),
  offerDetails: json('offer_details'), // salary, benefits, etc.
  rejectionReason: text('rejection_reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Application status history - tracks status changes over time
export const applicationStatusHistory = pgTable('application_status_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  applicationId: uuid('application_id')
    .references(() => applications.id, { onDelete: 'cascade' })
    .notNull(),
  previousStatus: applicationStatusEnum('previous_status'),
  newStatus: applicationStatusEnum('new_status').notNull(),
  notes: text('notes'),
  changedAt: timestamp('changed_at').defaultNow().notNull(),
  changedBy: uuid('changed_by')
    .references(() => users.id)
    .notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  resumes: many(resumes),
  jobDescriptions: many(jobDescriptions),
  applications: many(applications),
  statusChanges: many(applicationStatusHistory),
}));

export const resumesRelations = relations(resumes, ({ one, many }) => ({
  user: one(users, {
    fields: [resumes.userId],
    references: [users.id],
  }),
  applications: many(applications),
}));

export const jobDescriptionsRelations = relations(jobDescriptions, ({ one, many }) => ({
  user: one(users, {
    fields: [jobDescriptions.userId],
    references: [users.id],
  }),
  applications: many(applications),
}));

export const applicationsRelations = relations(applications, ({ one, many }) => ({
  user: one(users, {
    fields: [applications.userId],
    references: [users.id],
  }),
  resume: one(resumes, {
    fields: [applications.resumeId],
    references: [resumes.id],
  }),
  jobDescription: one(jobDescriptions, {
    fields: [applications.jobDescriptionId],
    references: [jobDescriptions.id],
  }),
  statusHistory: many(applicationStatusHistory),
}));

export const applicationStatusHistoryRelations = relations(
  applicationStatusHistory,
  ({ one }) => ({
    application: one(applications, {
      fields: [applicationStatusHistory.applicationId],
      references: [applications.id],
    }),
    changedByUser: one(users, {
      fields: [applicationStatusHistory.changedBy],
      references: [users.id],
    }),
  })
);

// Type exports for use in the application
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Resume = typeof resumes.$inferSelect;
export type NewResume = typeof resumes.$inferInsert;

export type JobDescription = typeof jobDescriptions.$inferSelect;
export type NewJobDescription = typeof jobDescriptions.$inferInsert;

export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;

export type ApplicationStatusHistory = typeof applicationStatusHistory.$inferSelect;
export type NewApplicationStatusHistory = typeof applicationStatusHistory.$inferInsert;

export type ApplicationStatus = typeof applicationStatusEnum.enumValues[number];

// AI-related tables and enums
export * from './schema/ai'