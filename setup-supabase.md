# Quick Supabase Setup

## 1. Create Free Supabase Project
1. Go to https://supabase.com
2. Sign up/login
3. Click "New Project"
4. Choose organization, name your project "catcv"
5. Generate a strong password
6. Wait for setup (2-3 minutes)

## 2. Get Database Credentials
1. Go to Settings → Database
2. Copy the connection string
3. It looks like: `postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres`

## 3. Update .env.local
```bash
# Replace with your actual Supabase credentials
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_REF].supabase.co
SUPABASE_SERVICE_ROLE_KEY=[SERVICE_ROLE_KEY]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[ANON_PUBLIC_KEY]
```

## 4. Run Migrations
```bash
npm run db:migrate
```

## 5. Apply RLS Policies
1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste contents of `lib/db/rls-policies.sql`
3. Click "Run"

## 6. Test Database
```bash
npm run db:studio
```