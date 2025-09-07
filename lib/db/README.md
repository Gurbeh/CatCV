# Database Setup - MVP Foundation

This directory contains the complete database schema setup for the CatCV application using Drizzle ORM and Supabase PostgreSQL.

## Schema Overview

The database consists of 5 main tables designed for secure multi-tenant job application management:

### Core Tables

1. **users** - User profiles (extends Supabase auth.users)
   - Primary key: `id` (UUID, matches auth.users.id)
   - Fields: email, full_name, avatar_url, timestamps

2. **resumes** - JSON Resume storage with user ownership
   - Stores complete JSON Resume format data
   - Supports multiple resumes per user with default flag
   - Foreign key: `user_id` → users.id

3. **job_descriptions** - Job posting data with metadata
   - Company info, job details, requirements, benefits
   - Flexible JSON fields for requirements and benefits
   - Foreign key: `user_id` → users.id

4. **applications** - Links resumes to job descriptions
   - Tracks application status and timeline
   - Stores cover letters and tailored resumes
   - Foreign keys: `user_id` → users.id, `resume_id` → resumes.id, `job_description_id` → job_descriptions.id

5. **application_status_history** - Audit trail for status changes
   - Immutable log of all status transitions
   - Foreign keys: `application_id` → applications.id, `changed_by` → users.id

### Enums

- **application_status**: 'draft', 'applied', 'interview', 'offer', 'rejected', 'withdrawn'

## Security Features

### Row Level Security (RLS)
All tables have RLS enabled with policies ensuring:
- Users can only access their own data
- Cross-user data isolation is enforced at the database level
- Status history respects application ownership

### Indexes
Performance indexes created on:
- Foreign key columns
- User ID columns for efficient RLS queries

### Triggers
Automatic `updated_at` timestamp updates on all tables.

## Files Structure

```
lib/db/
├── schema.ts              # Complete Drizzle schema definitions
├── index.ts               # Database client configuration
├── migrations/            # Generated migration files
│   └── 0000_*.sql        # Initial schema migration
├── rls-policies.sql       # Row Level Security policies
└── README.md             # This documentation
```

## Setup Instructions

### 1. Environment Variables
Copy `env.example` to `.env.local` and configure:
```bash
DATABASE_URL=postgresql://postgres:password@localhost:5432/catcv
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key-here
```

### 2. Database Migration
Run the migration to create all tables:
```bash
npm run db:migrate
```

### 3. Apply RLS Policies
Execute the RLS policies in your Supabase SQL editor:
```sql
-- Copy and paste contents of lib/db/rls-policies.sql
```

### 4. Verify Setup
Generate types and test connection:
```bash
npm run db:generate  # Generate fresh migrations if schema changes
npm run db:studio    # Open Drizzle Studio for database inspection
```

## Usage Examples

### Import Database Client
```typescript
import { db } from '@/lib/db';
import { users, resumes, applications } from '@/lib/db';
```

### Create a User
```typescript
const newUser = await db.insert(users).values({
  id: 'user-uuid-from-auth',
  email: 'user@example.com',
  fullName: 'John Doe',
}).returning();
```

### Create a Resume
```typescript
const resume = await db.insert(resumes).values({
  userId: 'user-uuid',
  title: 'Software Engineer Resume',
  jsonResume: {
    basics: {
      name: 'John Doe',
      email: 'john@example.com',
      // ... JSON Resume format
    }
  },
  isDefault: true,
}).returning();
```

### Query with Relations
```typescript
const userApplications = await db.query.applications.findMany({
  where: eq(applications.userId, userId),
  with: {
    resume: true,
    jobDescription: true,
    statusHistory: true,
  },
});
```

## Migration Workflow

1. **Schema Changes**: Edit `lib/db/schema.ts`
2. **Generate Migration**: `npm run db:generate`
3. **Apply Migration**: `npm run db:migrate`
4. **Update RLS**: Modify `rls-policies.sql` if needed

## Security Notes

- All queries automatically respect RLS when using Supabase client
- Use `supabaseAdmin` client only for server-side operations that need to bypass RLS
- Never expose service role key to client-side code
- All foreign key relationships have CASCADE delete for data consistency

## Troubleshooting

### Common Issues

1. **Migration Fails**: Check DATABASE_URL format and database connectivity
2. **RLS Blocks Queries**: Ensure user is authenticated and policies are correct
3. **Type Errors**: Regenerate types with `npm run db:generate`

### Debug Tools

- Use `npm run db:studio` to inspect data visually
- Check Supabase logs for RLS policy violations
- Use `EXPLAIN` queries to debug performance issues