# Environment Variables Setup Guide

## Issue: "Supabase is not configured" Error

If you're seeing this error, it means your environment variables are not being read by Next.js.

## Quick Fix Steps:

### 1. Verify Your `.env.local` File

Make sure you have a `.env.local` file in the **root directory** of your project (same level as `package.json`).

### 2. Add Your Supabase Credentials

Your `.env.local` file should contain:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Important:**
- No spaces around the `=` sign
- No quotes around the values (unless they contain spaces)
- Each variable on its own line
- No trailing spaces

### 3. Get Your Supabase Credentials

1. Go to your Supabase project: https://app.supabase.com
2. Click on **Settings** (gear icon) → **API**
3. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

### 4. Restart Your Dev Server

**This is critical!** Next.js only loads environment variables when the server starts.

1. Stop your current dev server (Ctrl+C)
2. Start it again: `npm run dev`

### 5. Verify It's Working

After restarting, check the browser console. You should no longer see the "Supabase is not configured" error.

## Common Issues:

### Issue: Variables still not loading after restart
- Check that the file is named exactly `.env.local` (not `.env` or `.env.local.txt`)
- Make sure it's in the root directory, not in a subfolder
- Check for typos in variable names (must be exactly as shown above)

### Issue: Variables work in server but not client
- Client-side variables MUST have `NEXT_PUBLIC_` prefix
- Server-side variables (like `SUPABASE_SERVICE_ROLE_KEY`) don't need the prefix

### Issue: File is ignored by Git
- This is correct! `.env.local` should be in `.gitignore`
- Never commit your `.env.local` file to version control

## Example `.env.local` File:

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjE2MjM5MDIyLCJleHAiOjE5MzE4MTUwMjJ9.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Still Having Issues?

1. Double-check your Supabase project is active
2. Verify you copied the keys correctly (they're very long)
3. Make sure there are no extra spaces or line breaks
4. Try deleting `.env.local` and recreating it
5. Check that your dev server is running from the correct directory
