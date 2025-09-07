/**
 * Mock Database Schema Test
 * This simulates what the database would look like with sample data
 * Run: node test-schema-mock.js
 */

// Sample data that would be in the database
const mockDatabase = {
  users: [
    {
      id: "550e8400-e29b-41d4-a716-446655440000",
      email: "john@example.com",
      full_name: "John Doe",
      avatar_url: null,
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z"
    }
  ],
  
  resumes: [
    {
      id: "550e8400-e29b-41d4-a716-446655440001",
      user_id: "550e8400-e29b-41d4-a716-446655440000",
      title: "Software Engineer Resume",
      json_resume: {
        basics: {
          name: "John Doe",
          email: "john@example.com",
          summary: "Experienced software engineer with 5+ years in full-stack development",
          location: { city: "San Francisco", region: "CA" }
        },
        work: [
          {
            name: "Tech Corp",
            position: "Senior Software Engineer",
            startDate: "2020-01-01",
            endDate: "2024-01-01",
            highlights: ["Led team of 5 developers", "Increased performance by 40%"]
          }
        ],
        skills: [
          { name: "JavaScript", keywords: ["React", "Node.js", "TypeScript"] },
          { name: "Databases", keywords: ["PostgreSQL", "MongoDB"] }
        ]
      },
      is_default: true,
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:30:00Z"
    }
  ],
  
  job_descriptions: [
    {
      id: "550e8400-e29b-41d4-a716-446655440002",
      user_id: "550e8400-e29b-41d4-a716-446655440000",
      company_name: "Amazing Startup",
      job_title: "Full Stack Developer",
      job_url: "https://amazingstartup.com/careers/fullstack",
      description: "We're looking for a passionate full-stack developer to join our growing team...",
      location: "Remote",
      salary_range: "$120k - $180k",
      employment_type: "full-time",
      remote: true,
      requirements: ["React", "Node.js", "PostgreSQL", "5+ years experience"],
      benefits: ["Health insurance", "401k", "Unlimited PTO", "Remote work"],
      created_at: "2024-01-16T09:00:00Z",
      updated_at: "2024-01-16T09:00:00Z"
    }
  ],
  
  applications: [
    {
      id: "550e8400-e29b-41d4-a716-446655440003",
      user_id: "550e8400-e29b-41d4-a716-446655440000",
      resume_id: "550e8400-e29b-41d4-a716-446655440001",
      job_description_id: "550e8400-e29b-41d4-a716-446655440002",
      status: "applied",
      applied_at: "2024-01-16T14:30:00Z",
      cover_letter: "Dear Hiring Manager,\n\nI am excited to apply for the Full Stack Developer position...",
      notes: "Applied via company website. Followed up with recruiter on LinkedIn.",
      follow_up_date: "2024-01-23T09:00:00Z",
      created_at: "2024-01-16T14:00:00Z",
      updated_at: "2024-01-16T14:30:00Z"
    }
  ],
  
  application_status_history: [
    {
      id: "550e8400-e29b-41d4-a716-446655440004",
      application_id: "550e8400-e29b-41d4-a716-446655440003",
      previous_status: null,
      new_status: "draft",
      notes: "Application created",
      changed_at: "2024-01-16T14:00:00Z",
      changed_by: "550e8400-e29b-41d4-a716-446655440000"
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440005",
      application_id: "550e8400-e29b-41d4-a716-446655440003",
      previous_status: "draft",
      new_status: "applied",
      notes: "Application submitted via company website",
      changed_at: "2024-01-16T14:30:00Z",
      changed_by: "550e8400-e29b-41d4-a716-446655440000"
    }
  ]
};

function displayMockDatabase() {
  console.log('🗄️  Mock Database Schema Visualization\n');
  console.log('This shows what your database would contain with sample data:\n');
  
  // Display Users
  console.log('👤 USERS TABLE:');
  console.log('================');
  mockDatabase.users.forEach(user => {
    console.log(`ID: ${user.id}`);
    console.log(`Email: ${user.email}`);
    console.log(`Name: ${user.full_name}`);
    console.log(`Created: ${user.created_at}\n`);
  });
  
  // Display Resumes
  console.log('📄 RESUMES TABLE:');
  console.log('==================');
  mockDatabase.resumes.forEach(resume => {
    console.log(`ID: ${resume.id}`);
    console.log(`Title: ${resume.title}`);
    console.log(`Default: ${resume.is_default}`);
    console.log(`Skills: ${resume.json_resume.skills.map(s => s.name).join(', ')}`);
    console.log(`Work Experience: ${resume.json_resume.work.length} positions\n`);
  });
  
  // Display Job Descriptions
  console.log('💼 JOB_DESCRIPTIONS TABLE:');
  console.log('===========================');
  mockDatabase.job_descriptions.forEach(job => {
    console.log(`ID: ${job.id}`);
    console.log(`Company: ${job.company_name}`);
    console.log(`Title: ${job.job_title}`);
    console.log(`Location: ${job.location}`);
    console.log(`Salary: ${job.salary_range}`);
    console.log(`Remote: ${job.remote}`);
    console.log(`Requirements: ${job.requirements.join(', ')}\n`);
  });
  
  // Display Applications
  console.log('📋 APPLICATIONS TABLE:');
  console.log('=======================');
  mockDatabase.applications.forEach(app => {
    console.log(`ID: ${app.id}`);
    console.log(`Status: ${app.status}`);
    console.log(`Applied: ${app.applied_at}`);
    console.log(`Notes: ${app.notes}`);
    console.log(`Follow-up: ${app.follow_up_date}\n`);
  });
  
  // Display Status History
  console.log('📊 APPLICATION_STATUS_HISTORY TABLE:');
  console.log('=====================================');
  mockDatabase.application_status_history.forEach(history => {
    console.log(`Application: ${history.application_id}`);
    console.log(`Status Change: ${history.previous_status || 'null'} → ${history.new_status}`);
    console.log(`Notes: ${history.notes}`);
    console.log(`When: ${history.changed_at}\n`);
  });
  
  console.log('🎯 RELATIONSHIPS:');
  console.log('==================');
  console.log('• User has 1 resume (default)');
  console.log('• User has 1 job description saved');
  console.log('• User has 1 application linking the resume to the job');
  console.log('• Application has 2 status history entries (draft → applied)');
  console.log('\n✅ This demonstrates the complete MVP database schema!');
}

// Run the visualization
displayMockDatabase();