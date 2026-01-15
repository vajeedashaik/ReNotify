import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client if env vars are not set (for development)
    // This allows the app to run without Supabase configured
    const mockClient: any = {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
        onAuthStateChange: (callback: any) => {
          // Return a subscription object
          return {
            data: {
              subscription: {
                unsubscribe: () => {},
              },
            },
          };
        },
        signOut: async () => ({ error: null }),
        setSession: async () => ({ error: null }),
        signInWithPassword: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
      },
      from: (table: string) => ({
        select: (columns?: string) => ({
          eq: (column: string, value: any) => ({
            single: async () => ({ data: null, error: null }),
            limit: async () => ({ data: [], error: null }),
          }),
          limit: async () => ({ data: [], error: null }),
        }),
        update: (values: any) => ({
          eq: async () => ({ error: null }),
        }),
        insert: async () => ({ error: null }),
      }),
      storage: {
        from: (bucket: string) => ({
          upload: async () => ({ error: { message: 'Supabase not configured' } }),
        }),
      },
    };
    return mockClient;
  }

  try {
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error('Failed to create Supabase browser client:', error);
    // Return mock client as fallback
    return {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signOut: async () => ({ error: null }),
        setSession: async () => ({ error: null }),
      },
      from: () => ({
        select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }),
        update: () => ({ eq: async () => ({ error: null }) }),
      }),
      storage: {
        from: () => ({
          upload: async () => ({ error: null }),
        }),
      },
    } as any;
  }
}
