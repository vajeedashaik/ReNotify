import { createBrowserClient } from '@supabase/ssr';

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  // Return cached client if it exists (prevents creating multiple instances)
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseAnonKey) {
    const errorMsg = `Supabase is not configured. Please:
1. Create a .env.local file in the root directory
2. Add the following variables:
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
3. Restart your dev server (stop and run 'npm run dev' again)

Current values:
- NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? 'Set' : 'NOT SET'}
- NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? 'Set' : 'NOT SET'}`;
    
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  try {
    // createBrowserClient automatically handles cookies via localStorage/cookies
    // It will persist sessions properly
    supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
    return supabaseClient;
  } catch (error) {
    console.error('Failed to create Supabase browser client:', error);
    throw new Error('Failed to initialize Supabase client. Please check your configuration.');
  }
}
