import { db } from './index';
import { 
  users, 
  resumes, 
  jobDescriptions, 
  applications, 
  applicationStatusHistory,
  type NewUser,
  type NewResume,
  type NewJobDescription,
  type NewApplication,
  type ApplicationStatus,
} from './schema';
import { eq, and, desc } from 'drizzle-orm';
import type { JsonResume } from '@/lib/types/json-resume';

// User utilities
export class UserService {
  static async createUser(userData: NewUser) {
    return await db.insert(users).values(userData).returning();
  }

  static async getUserById(id: string) {
    return await db.query.users.findFirst({
      where: eq(users.id, id),
    });
  }

  static async updateUser(id: string, updates: Partial<NewUser>) {
    return await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
  }
}

// Resume utilities
export class ResumeService {
  static async createResume(resumeData: NewResume) {
    // If this is marked as default, unset other defaults for this user
    if (resumeData.isDefault) {
      await db
        .update(resumes)
        .set({ isDefault: false })
        .where(eq(resumes.userId, resumeData.userId));
    }

    return await db.insert(resumes).values(resumeData).returning();
  }

  static async getUserResumes(userId: string) {
    return await db.query.resumes.findMany({
      where: eq(resumes.userId, userId),
      orderBy: [desc(resumes.createdAt)],
    });
  }

  static async getDefaultResume(userId: string) {
    return await db.query.resumes.findFirst({
      where: and(
        eq(resumes.userId, userId),
        eq(resumes.isDefault, true)
      ),
    });
  }

  static async updateResume(id: string, updates: Partial<NewResume>) {
    return await db
      .update(resumes)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(resumes.id, id))
      .returning();
  }

  static async deleteResume(id: string) {
    return await db.delete(resumes).where(eq(resumes.id, id)).returning();
  }
}

// Job Description utilities
export class JobDescriptionService {
  static async createJobDescription(jobData: NewJobDescription) {
    return await db.insert(jobDescriptions).values(jobData).returning();
  }

  static async getUserJobDescriptions(userId: string) {
    return await db.query.jobDescriptions.findMany({
      where: eq(jobDescriptions.userId, userId),
      orderBy: [desc(jobDescriptions.createdAt)],
    });
  }

  static async getJobDescriptionById(id: string) {
    return await db.query.jobDescriptions.findFirst({
      where: eq(jobDescriptions.id, id),
    });
  }

  static async updateJobDescription(id: string, updates: Partial<NewJobDescription>) {
    return await db
      .update(jobDescriptions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(jobDescriptions.id, id))
      .returning();
  }

  static async deleteJobDescription(id: string) {
    return await db.delete(jobDescriptions).where(eq(jobDescriptions.id, id)).returning();
  }
}

// Application utilities
export class ApplicationService {
  static async createApplication(applicationData: NewApplication) {
    const [application] = await db.insert(applications).values(applicationData).returning();
    
    // Create initial status history entry
    if (application) {
      await db.insert(applicationStatusHistory).values({
        applicationId: application.id,
        previousStatus: null,
        newStatus: application.status,
        notes: 'Application created',
        changedBy: application.userId,
      });
    }

    return application;
  }

  static async getUserApplications(userId: string) {
    return await db.query.applications.findMany({
      where: eq(applications.userId, userId),
      with: {
        resume: true,
        jobDescription: true,
        statusHistory: {
          orderBy: [desc(applicationStatusHistory.changedAt)],
        },
      },
      orderBy: [desc(applications.createdAt)],
    });
  }

  static async getApplicationById(id: string) {
    return await db.query.applications.findFirst({
      where: eq(applications.id, id),
      with: {
        resume: true,
        jobDescription: true,
        statusHistory: {
          orderBy: [desc(applicationStatusHistory.changedAt)],
        },
      },
    });
  }

  static async updateApplicationStatus(
    id: string, 
    newStatus: ApplicationStatus, 
    changedBy: string,
    notes?: string
  ) {
    // Get current application
    const currentApp = await db.query.applications.findFirst({
      where: eq(applications.id, id),
    });

    if (!currentApp) {
      throw new Error('Application not found');
    }

    // Update application status
    const [updatedApp] = await db
      .update(applications)
      .set({ 
        status: newStatus, 
        updatedAt: new Date(),
        ...(newStatus === 'applied' && !currentApp.appliedAt ? { appliedAt: new Date() } : {}),
      })
      .where(eq(applications.id, id))
      .returning();

    // Create status history entry
    await db.insert(applicationStatusHistory).values({
      applicationId: id,
      previousStatus: currentApp.status,
      newStatus,
      notes,
      changedBy,
    });

    return updatedApp;
  }

  static async updateApplication(id: string, updates: Partial<NewApplication>) {
    return await db
      .update(applications)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(applications.id, id))
      .returning();
  }

  static async deleteApplication(id: string) {
    return await db.delete(applications).where(eq(applications.id, id)).returning();
  }
}

// Application Status History utilities
export class StatusHistoryService {
  static async getApplicationHistory(applicationId: string) {
    return await db.query.applicationStatusHistory.findMany({
      where: eq(applicationStatusHistory.applicationId, applicationId),
      with: {
        changedByUser: true,
      },
      orderBy: [desc(applicationStatusHistory.changedAt)],
    });
  }
}

// Helper function to migrate existing Job data to new schema
export async function migrateJobToJobDescription(
  userId: string,
  job: {
    id: string;
    companyName: string;
    jobLink?: string;
    jobText: string;
    createdAt: string;
    updatedAt: string;
  }
): Promise<string> {
  const [jobDesc] = await db.insert(jobDescriptions).values({
    userId,
    companyName: job.companyName,
    jobTitle: 'Imported Job', // Default title since old schema doesn't have it
    jobUrl: job.jobLink,
    description: job.jobText,
    createdAt: new Date(job.createdAt),
    updatedAt: new Date(job.updatedAt),
  }).returning();

  return jobDesc.id;
}

// Utility to create a sample JSON Resume
export function createSampleJsonResume(name: string, email: string): JsonResume {
  return {
    basics: {
      name,
      email,
      summary: 'Experienced professional seeking new opportunities',
      location: {
        city: 'San Francisco',
        region: 'CA',
        countryCode: 'US',
      },
      profiles: [],
    },
    work: [],
    education: [],
    skills: [],
    projects: [],
  };
}