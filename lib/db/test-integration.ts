/**
 * Database Integration Test
 * 
 * This file demonstrates the database setup and can be used to verify
 * that all components work together correctly.
 * 
 * To run this test:
 * 1. Set up your DATABASE_URL in .env.local
 * 2. Run migrations: npm run db:migrate
 * 3. Apply RLS policies from lib/db/rls-policies.sql
 * 4. Uncomment and run this code in a test environment
 */

import { db as _db } from './index';
import { 
  UserService, 
  ResumeService, 
  JobDescriptionService, 
  ApplicationService 
} from './utils';
import { createSampleJsonResume } from './utils';

export async function testDatabaseIntegration() {
  try {
    console.log('🧪 Starting database integration test...');

    // Test 1: Create a user
    console.log('📝 Creating test user...');
    const [user] = await UserService.createUser({
      id: 'test-user-123',
      email: 'test@example.com',
      fullName: 'Test User',
    });
    console.log('✅ User created:', user.id);

    // Test 2: Create a resume
    console.log('📄 Creating test resume...');
    const [resume] = await ResumeService.createResume({
      userId: user.id,
      title: 'Software Engineer Resume',
      jsonResume: createSampleJsonResume('Test User', 'test@example.com'),
      isDefault: true,
    });
    console.log('✅ Resume created:', resume.id);

    // Test 3: Create a job description
    console.log('💼 Creating test job description...');
    const [jobDesc] = await JobDescriptionService.createJobDescription({
      userId: user.id,
      companyName: 'Test Company',
      jobTitle: 'Senior Software Engineer',
      description: 'We are looking for a senior software engineer...',
      location: 'San Francisco, CA',
      remote: true,
      requirements: ['JavaScript', 'TypeScript', 'React'],
      benefits: ['Health insurance', 'Remote work', '401k'],
    });
    console.log('✅ Job description created:', jobDesc.id);

    // Test 4: Create an application
    console.log('📋 Creating test application...');
    const application = await ApplicationService.createApplication({
      userId: user.id,
      resumeId: resume.id,
      jobDescriptionId: jobDesc.id,
      status: 'draft',
      notes: 'Initial application draft',
    });
    console.log('✅ Application created:', application.id);

    // Test 5: Update application status
    console.log('🔄 Updating application status...');
    await ApplicationService.updateApplicationStatus(
      application.id,
      'applied',
      user.id,
      'Application submitted via company website'
    );
    console.log('✅ Application status updated to applied');

    // Test 6: Query with relations
    console.log('🔍 Querying user applications with relations...');
    const userApplications = await ApplicationService.getUserApplications(user.id);
    console.log('✅ Found applications:', userApplications.length);
    console.log('📊 Application details:', {
      id: userApplications[0]?.id,
      status: userApplications[0]?.status,
      company: userApplications[0]?.jobDescription?.companyName,
      resumeTitle: userApplications[0]?.resume?.title,
      statusHistoryCount: userApplications[0]?.statusHistory?.length,
    });

    console.log('🎉 All database integration tests passed!');
    return true;

  } catch (error) {
    console.error('❌ Database integration test failed:', error);
    return false;
  }
}

// Cleanup function for test data
export async function cleanupTestData() {
  try {
    // In a real test environment, you might want to clean up test data
    // This would require direct SQL or admin privileges
    console.log('🧹 Test cleanup would go here...');
    return true;
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    return false;
  }
}

// Export for potential use in actual test files
export const testConfig = {
  testUserId: 'test-user-123',
  testEmail: 'test@example.com',
  testCompany: 'Test Company',
};