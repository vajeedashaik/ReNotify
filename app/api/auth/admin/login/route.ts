import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

// Mock admin credentials (fallback when Supabase not configured)
const MOCK_ADMIN_EMAIL = 'admin@renotify.com';
const MOCK_ADMIN_PASSWORD = 'admin123';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    // Check if Supabase is configured
    const hasSupabaseConfig = 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Fallback to mock credentials if Supabase not configured
    if (!hasSupabaseConfig) {
      if (email === MOCK_ADMIN_EMAIL && password === MOCK_ADMIN_PASSWORD) {
        return NextResponse.json({
          success: true,
          user: {
            id: 'mock-admin-user',
            email: MOCK_ADMIN_EMAIL,
            role: 'ADMIN',
          },
          session: {
            access_token: 'mock-token',
            refresh_token: 'mock-refresh-token',
          },
        });
      } else {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }
    }

    // Use Supabase Auth
    try {
      const supabase = await createServiceRoleClient();

      // Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError || !authData.user) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      // Check if user is admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single();

      if (profileError || profile?.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Unauthorized: Admin access required' },
          { status: 403 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          id: authData.user.id,
          email: authData.user.email,
          role: 'ADMIN',
        },
        session: authData.session,
      });
    } catch (supabaseError) {
      console.error('Supabase error:', supabaseError);
      // Fallback to mock if Supabase fails
      if (email === MOCK_ADMIN_EMAIL && password === MOCK_ADMIN_PASSWORD) {
        return NextResponse.json({
          success: true,
          user: {
            id: 'mock-admin-user',
            email: MOCK_ADMIN_EMAIL,
            role: 'ADMIN',
          },
          session: {
            access_token: 'mock-token',
            refresh_token: 'mock-refresh-token',
          },
        });
      }
      throw supabaseError;
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
