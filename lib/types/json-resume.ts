// JSON Resume Schema Types
// Based on https://jsonresume.org/schema/

export interface JsonResume {
  basics?: Basics;
  work?: Work[];
  volunteer?: Volunteer[];
  education?: Education[];
  awards?: Award[];
  certificates?: Certificate[];
  publications?: Publication[];
  skills?: Skill[];
  languages?: Language[];
  interests?: Interest[];
  references?: Reference[];
  projects?: Project[];
  meta?: Meta;
}

export interface Basics {
  name?: string;
  label?: string;
  image?: string;
  email?: string;
  phone?: string;
  url?: string;
  summary?: string;
  location?: Location;
  profiles?: Profile[];
}

export interface Location {
  address?: string;
  postalCode?: string;
  city?: string;
  countryCode?: string;
  region?: string;
}

export interface Profile {
  network?: string;
  username?: string;
  url?: string;
}

export interface Work {
  name?: string;
  position?: string;
  url?: string;
  startDate?: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
  location?: string;
}

export interface Volunteer {
  organization?: string;
  position?: string;
  url?: string;
  startDate?: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
}

export interface Education {
  institution?: string;
  url?: string;
  area?: string;
  studyType?: string;
  startDate?: string;
  endDate?: string;
  score?: string;
  courses?: string[];
}

export interface Award {
  title?: string;
  date?: string;
  awarder?: string;
  summary?: string;
}

export interface Certificate {
  name?: string;
  date?: string;
  issuer?: string;
  url?: string;
}

export interface Publication {
  name?: string;
  publisher?: string;
  releaseDate?: string;
  url?: string;
  summary?: string;
}

export interface Skill {
  name?: string;
  level?: string;
  keywords?: string[];
}

export interface Language {
  language?: string;
  fluency?: string;
}

export interface Interest {
  name?: string;
  keywords?: string[];
}

export interface Reference {
  name?: string;
  reference?: string;
}

export interface Project {
  name?: string;
  description?: string;
  highlights?: string[];
  keywords?: string[];
  startDate?: string;
  endDate?: string;
  url?: string;
  roles?: string[];
  entity?: string;
  type?: string;
}

export interface Meta {
  canonical?: string;
  version?: string;
  lastModified?: string;
}

// Validation schema using Zod
import { z } from 'zod';

export const LocationSchema = z.object({
  address: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  countryCode: z.string().optional(),
  region: z.string().optional(),
});

export const ProfileSchema = z.object({
  network: z.string().optional(),
  username: z.string().optional(),
  url: z.string().url().optional(),
});

export const BasicsSchema = z.object({
  name: z.string().optional(),
  label: z.string().optional(),
  image: z.string().url().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  url: z.string().url().optional(),
  summary: z.string().optional(),
  location: LocationSchema.optional(),
  profiles: z.array(ProfileSchema).optional(),
});

export const WorkSchema = z.object({
  name: z.string().optional(),
  position: z.string().optional(),
  url: z.string().url().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  summary: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  location: z.string().optional(),
});

export const EducationSchema = z.object({
  institution: z.string().optional(),
  url: z.string().url().optional(),
  area: z.string().optional(),
  studyType: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  score: z.string().optional(),
  courses: z.array(z.string()).optional(),
});

export const SkillSchema = z.object({
  name: z.string().optional(),
  level: z.string().optional(),
  keywords: z.array(z.string()).optional(),
});

export const ProjectSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  url: z.string().url().optional(),
  roles: z.array(z.string()).optional(),
  entity: z.string().optional(),
  type: z.string().optional(),
});

export const JsonResumeSchema = z.object({
  basics: BasicsSchema.optional(),
  work: z.array(WorkSchema).optional(),
  volunteer: z.array(z.object({
    organization: z.string().optional(),
    position: z.string().optional(),
    url: z.string().url().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    summary: z.string().optional(),
    highlights: z.array(z.string()).optional(),
  })).optional(),
  education: z.array(EducationSchema).optional(),
  awards: z.array(z.object({
    title: z.string().optional(),
    date: z.string().optional(),
    awarder: z.string().optional(),
    summary: z.string().optional(),
  })).optional(),
  certificates: z.array(z.object({
    name: z.string().optional(),
    date: z.string().optional(),
    issuer: z.string().optional(),
    url: z.string().url().optional(),
  })).optional(),
  publications: z.array(z.object({
    name: z.string().optional(),
    publisher: z.string().optional(),
    releaseDate: z.string().optional(),
    url: z.string().url().optional(),
    summary: z.string().optional(),
  })).optional(),
  skills: z.array(SkillSchema).optional(),
  languages: z.array(z.object({
    language: z.string().optional(),
    fluency: z.string().optional(),
  })).optional(),
  interests: z.array(z.object({
    name: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  })).optional(),
  references: z.array(z.object({
    name: z.string().optional(),
    reference: z.string().optional(),
  })).optional(),
  projects: z.array(ProjectSchema).optional(),
  meta: z.object({
    canonical: z.string().url().optional(),
    version: z.string().optional(),
    lastModified: z.string().optional(),
  }).optional(),
});

// Helper function to validate JSON Resume data
export function validateJsonResume(data: unknown): JsonResume {
  return JsonResumeSchema.parse(data);
}

// Helper function to create a basic empty JSON Resume
export function createEmptyJsonResume(): JsonResume {
  return {
    basics: {
      name: '',
      email: '',
      summary: '',
      location: {},
      profiles: [],
    },
    work: [],
    education: [],
    skills: [],
    projects: [],
  };
}