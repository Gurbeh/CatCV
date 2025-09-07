-- Complete Database Setup for CatCV
-- Run this in Supabase SQL Editor

-- Create the enum for application status
CREATE TYPE "application_status" AS ENUM('draft', 'applied', 'interview', 'offer', 'rejected', 'withdrawn');

-- Create tables
CREATE TABLE IF NOT EXISTS "users" (
    "id" uuid PRIMARY KEY NOT NULL,
    "email" text NOT NULL,
    "full_name" text,
    "avatar_url" text,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "users_email_unique" UNIQUE("email")
);

CREATE TABLE IF NOT EXISTS "resumes" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "title" text NOT NULL,
    "json_resume" json NOT NULL,
    "is_default" boolean DEFAULT false NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "job_descriptions" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "company_name" text NOT NULL,
    "job_title" text NOT NULL,
    "job_url" text,
    "description" text NOT NULL,
    "location" text,
    "salary_range" text,
    "employment_type" text,
    "remote" boolean DEFAULT false,
    "requirements" json,
    "benefits" json,
    "metadata" json,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "applications" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "resume_id" uuid NOT NULL REFERENCES "resumes"("id") ON DELETE CASCADE,
    "job_description_id" uuid NOT NULL REFERENCES "job_descriptions"("id") ON DELETE CASCADE,
    "status" "application_status" DEFAULT 'draft' NOT NULL,
    "applied_at" timestamp,
    "cover_letter" text,
    "tailored_resume" json,
    "notes" text,
    "follow_up_date" timestamp,
    "interview_date" timestamp,
    "offer_details" json,
    "rejection_reason" text,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "application_status_history" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "application_id" uuid NOT NULL REFERENCES "applications"("id") ON DELETE CASCADE,
    "previous_status" "application_status",
    "new_status" "application_status" NOT NULL,
    "notes" text,
    "changed_at" timestamp DEFAULT now() NOT NULL,
    "changed_by" uuid NOT NULL REFERENCES "users"("id")
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_descriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_status_history ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Users policies
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Resumes policies
CREATE POLICY "Users can view own resumes" ON resumes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resumes" ON resumes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes" ON resumes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes" ON resumes
    FOR DELETE USING (auth.uid() = user_id);

-- Job descriptions policies
CREATE POLICY "Users can view own job descriptions" ON job_descriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own job descriptions" ON job_descriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own job descriptions" ON job_descriptions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own job descriptions" ON job_descriptions
    FOR DELETE USING (auth.uid() = user_id);

-- Applications policies
CREATE POLICY "Users can view own applications" ON applications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications" ON applications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications" ON applications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own applications" ON applications
    FOR DELETE USING (auth.uid() = user_id);

-- Application status history policies
CREATE POLICY "Users can view own application status history" ON application_status_history
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM applications 
            WHERE applications.id = application_status_history.application_id 
            AND applications.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own application status history" ON application_status_history
    FOR INSERT WITH CHECK (
        auth.uid() = changed_by AND
        EXISTS (
            SELECT 1 FROM applications 
            WHERE applications.id = application_status_history.application_id 
            AND applications.user_id = auth.uid()
        )
    );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_job_descriptions_user_id ON job_descriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_resume_id ON applications(resume_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_description_id ON applications(job_description_id);
CREATE INDEX IF NOT EXISTS idx_application_status_history_application_id ON application_status_history(application_id);
CREATE INDEX IF NOT EXISTS idx_application_status_history_changed_by ON application_status_history(changed_by);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resumes_updated_at BEFORE UPDATE ON resumes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_descriptions_updated_at BEFORE UPDATE ON job_descriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verify setup
SELECT 'Database setup complete!' as message;

-- Check tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'resumes', 'job_descriptions', 'applications', 'application_status_history')
ORDER BY table_name;