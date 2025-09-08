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

## 3. Update .env
```bash
# Replace with your actual Supabase credentials
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_REF].supabase.co
SUPABASE_SERVICE_ROLE_KEY=[SERVICE_ROLE_KEY]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[ANON_PUBLIC_KEY]

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## 4. Enable Google OAuth in Supabase
1. Go to Supabase Dashboard → Authentication → URL Configuration
   - Add http://localhost:3000 to Allowed Redirect URLs
   - Add your production URL when deploying (e.g., https://yourdomain.com)
2. Go to Authentication → Providers → Google
   - Toggle Enabled
   - Paste GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET from your .env
   - Save

Note: In Google Cloud Console → Credentials, set the Authorized redirect URI to:
- https://[PROJECT_REF].supabase.co/auth/v1/callback

## 5. Run Migrations
```bash
npm run db:migrate
```

## 6. Apply RLS Policies
1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste contents of `lib/db/rls-policies.sql`
3. Click "Run"

## 7. Test Database
```bash
npm run db:studio
```