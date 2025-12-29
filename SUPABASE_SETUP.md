# Supabase Setup Guide for Silver Spring Observatory

This guide will help you set up the database and authentication for managing images.

## Step 1: Create a Supabase Account & Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account (or log in)
3. Click "New Project"
4. Fill in:
   - **Name**: `silverspringastro`
   - **Database Password**: (save this somewhere safe!)
   - **Region**: Choose closest to you (e.g., East US)
5. Click "Create new project" and wait for setup

## Step 2: Get Your API Keys

1. In your project, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like `https://xxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

## Step 3: Set Up Environment Variables

### For Local Development:
Create a file called `.env.local` in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### For Vercel Deployment:
1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add both variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 4: Create the Database Tables

1. In Supabase, go to **SQL Editor**
2. Copy the contents of `supabase/schema.sql`
3. Paste and click **Run**

## Step 5: Create the Storage Bucket

1. Go to **Storage** in the sidebar
2. Click **New bucket**
3. Name it: `images`
4. Check ✅ **Public bucket**
5. Click **Create bucket**

### Set Storage Policies:
1. Click on the `images` bucket
2. Go to **Policies**
3. Click **New Policy** → **For full customization**
4. Create these policies:

**Policy 1: Public Read**
- Name: `Public Read`
- Allowed operation: `SELECT`
- Target roles: Check `anon` and `authenticated`
- Policy: `true`

**Policy 2: Auth Upload**
- Name: `Auth Upload`
- Allowed operation: `INSERT`
- Target roles: Check `authenticated` only
- Policy: `true`

**Policy 3: Auth Delete**
- Name: `Auth Delete`
- Allowed operation: `DELETE`
- Target roles: Check `authenticated` only
- Policy: `true`

## Step 6: Create Admin User (Ken's Account)

1. Go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter Ken's email and a strong password
4. Click **Create user**
5. (Optional) Click on the user and verify the email manually

## Step 7: Test the Setup

1. Start your dev server: `npm run dev`
2. Go to `http://localhost:3000/login`
3. Log in with the admin credentials
4. You should see the admin dashboard!

## Troubleshooting

### "Invalid API key"
- Double-check your `.env.local` file
- Make sure there are no extra spaces
- Restart the dev server after changing env vars

### "Permission denied"
- Check that RLS policies are set up correctly
- Verify the storage bucket is public

### Images not loading
- Check the storage bucket policies
- Verify the bucket is named exactly `images`

## Security Notes

- The `anon` key is safe to expose publicly (it's designed for that)
- RLS policies protect your data
- Only authenticated users can upload/delete
- Keep your service role key secret (never use in frontend)

---

Need help? Contact your developer!

