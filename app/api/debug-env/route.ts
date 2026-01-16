import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function GET() {
  // Only expose in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  const envCheck = {
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    supabaseUrlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
    supabaseAnonKeyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
    serviceRoleKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
    // Show first 20 chars of each (for debugging, not full keys)
    supabaseUrlPreview: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) || 'NOT SET',
    supabaseAnonKeyPreview: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 30) || 'NOT SET',
    serviceRoleKeyPreview: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 30) || 'NOT SET',
  };

  // Test Supabase connection
  let connectionTest = { success: false, error: null as string | null };
  try {
    const supabase = await createServiceRoleClient();
    // Try a simple query to test connection
    const { error } = await supabase.from('profiles').select('count').limit(1);
    connectionTest.success = !error;
    connectionTest.error = error?.message || null;
  } catch (error) {
    connectionTest.error = error instanceof Error ? error.message : 'Unknown error';
  }

  return NextResponse.json({
    ...envCheck,
    connectionTest,
  });
}
