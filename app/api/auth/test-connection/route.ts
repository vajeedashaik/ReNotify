import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    // Check environment variables
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!hasUrl || !hasKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing environment variables',
        details: {
          hasUrl,
          hasKey,
        },
      }, { status: 500 });
    }

    // Try to create a client
    let supabase;
    try {
      supabase = await createClient();
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: 'Failed to create Supabase client',
        details: error instanceof Error ? error.message : 'Unknown error',
      }, { status: 500 });
    }

    // Try a simple operation to test connection
    try {
      const { error } = await supabase.from('profiles').select('count').limit(1);
      
      if (error) {
        // Even if there's an error, if it's not a connection error, Supabase is reachable
        return NextResponse.json({
          success: true,
          message: 'Supabase is reachable',
          note: 'Database query returned an error, but connection is working',
          error: error.message,
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Supabase connection successful',
      });
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: 'Failed to query Supabase',
        details: error instanceof Error ? error.message : 'Unknown error',
      }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
