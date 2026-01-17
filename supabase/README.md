# Supabase Setup Instructions

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be fully provisioned

## 2. Get Your Credentials

1. Go to Project Settings → API
2. Copy the following:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

## 3. Set Up Environment Variables

1. Copy `.env.local.example` to `.env.local`
2. Fill in your Supabase credentials

## 4. Run Database Schema

1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the contents of `supabase/schema.sql`
3. Run the SQL script
4. Verify tables are created: `profiles`, `datasets`, `customer_products`

## 5. Set Up Storage Bucket

1. Go to Storage in Supabase Dashboard
2. Create a new bucket named `datasets`
3. Set it to **Private**
4. Create a policy:
   - Policy name: "Admins can upload datasets"
   - Allowed operation: INSERT
   - Policy definition:
     ```sql
     EXISTS (
       SELECT 1 FROM profiles
       WHERE profiles.id = auth.uid()
       AND role = 'ADMIN'
     )
     ```
   - Allowed operation: SELECTth
     ```sql
     EXISTS (
       SELECT 1 FROM profiles
       WHERE profiles.id = auth.uid()
       AND role = 'ADMIN'
     )
     ```

## 6. Create Admin User

After running the schema, you'll need to create an admin user:

1. Go to Authentication → Users in Supabase Dashboard
2. Create a new user with email/password
3. Go to SQL Editor and run:
   ```sql
   UPDATE profiles
   SET role = 'ADMIN'
   WHERE id = 'your_user_id_here';
   ```

Or use the signup flow which will be handled by the app.

## 7. Verify Setup

- Check that all tables exist
- Verify RLS is enabled on all tables
- Test that storage bucket exists and is private
