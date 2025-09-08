-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_descriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_description_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_documents ENABLE ROW LEVEL SECURITY;

-- Users table policies
-- Users can only see and modify their own record
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Resumes table policies
-- Users can only access their own resumes
CREATE POLICY "Users can view own resumes" ON resumes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resumes" ON resumes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes" ON resumes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes" ON resumes
  FOR DELETE USING (auth.uid() = user_id);

-- Job descriptions table policies
-- Users can only access their own job descriptions
CREATE POLICY "Users can view own job descriptions" ON job_descriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own job descriptions" ON job_descriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own job descriptions" ON job_descriptions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own job descriptions" ON job_descriptions
  FOR DELETE USING (auth.uid() = user_id);

-- Applications table policies
-- Users can only access their own applications
CREATE POLICY "Users can view own applications" ON applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications" ON applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications" ON applications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own applications" ON applications
  FOR DELETE USING (auth.uid() = user_id);

-- Application status history table policies
-- Users can only access status history for their own applications
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

-- Note: We typically don't allow UPDATE or DELETE on status history for audit purposes
-- But if needed, you can add similar policies

-- Create indexes for better performance on RLS queries
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_job_descriptions_user_id ON job_descriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_resume_id ON applications(resume_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_description_id ON applications(job_description_id);
CREATE INDEX IF NOT EXISTS idx_application_status_history_application_id ON application_status_history(application_id);
CREATE INDEX IF NOT EXISTS idx_application_status_history_changed_by ON application_status_history(changed_by);
CREATE INDEX IF NOT EXISTS idx_job_description_drafts_user_id ON job_description_drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_generations_user_id ON ai_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_documents_user_id ON generated_documents(user_id);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resumes_updated_at BEFORE UPDATE ON resumes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_descriptions_updated_at BEFORE UPDATE ON job_descriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- AI-related table policies
-- JD Drafts: owner-only access
CREATE POLICY "Users can view own jd drafts" ON job_description_drafts
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own jd drafts" ON job_description_drafts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own jd drafts" ON job_description_drafts
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own jd drafts" ON job_description_drafts
  FOR DELETE USING (auth.uid() = user_id);

-- AI Generations: owner-only
CREATE POLICY "Users can view own ai generations" ON ai_generations
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own ai generations" ON ai_generations
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ai generations" ON ai_generations
  FOR UPDATE USING (auth.uid() = user_id);

-- Generated documents: owner-only
CREATE POLICY "Users can view own generated documents" ON generated_documents
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own generated documents" ON generated_documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_job_description_drafts_updated_at BEFORE UPDATE ON job_description_drafts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_generations_updated_at BEFORE UPDATE ON ai_generations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();