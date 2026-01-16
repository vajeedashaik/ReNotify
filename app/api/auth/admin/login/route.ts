import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    // Verify Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing environment variables:', {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      });
      return NextResponse.json(
        { error: 'Supabase is not configured. Please set up your environment variables.' },
        { status: 500 }
      );
    }

    let supabase;
    try {
      supabase = await createServiceRoleClient();
    } catch (clientError) {
      console.error('Failed to create Supabase client:', clientError);
      return NextResponse.json(
        { 
          error: 'Failed to connect to Supabase',
          details: process.env.NODE_ENV === 'development' 
            ? (clientError instanceof Error ? clientError.message : 'Unknown error')
            : undefined,
        },
        { status: 500 }
      );
    }

    // Sign in with Supabase Auth
    console.log('Attempting to sign in user:', email);
    
    // Create a timeout wrapper
    const withTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
      return Promise.race([
        promise,
        new Promise<T>((_, reject) => {
          setTimeout(() => reject(new Error('Request timed out')), timeoutMs);
        }),
      ]);
    };

    let authData, authError;
    try {
      const authResult = await withTimeout(
        supabase.auth.signInWithPassword({
          email,
          password,
        }),
        10000 // 10 second timeout
      );
      
      authData = authResult.data;
      authError = authResult.error;
      console.log('Auth result:', { hasUser: !!authData?.user, error: authError?.message });
    } catch (error) {
      if (error instanceof Error && error.message.includes('timed out')) {
        console.error('Auth request timed out');
        return NextResponse.json(
          { error: 'Authentication request timed out. Please check your Supabase connection and try again.' },
          { status: 504 }
        );
      }
      console.error('Unexpected auth error:', error);
      return NextResponse.json(
        { 
          error: 'Authentication failed',
          details: process.env.NODE_ENV === 'development' 
            ? (error instanceof Error ? error.message : 'Unknown error')
            : undefined,
        },
        { status: 500 }
      );
    }

    if (authError || !authData?.user) {
      console.error('Auth error:', authError);
      return NextResponse.json(
        { error: authError?.message || 'Invalid email or password' },
        { status: 401 }
      );
    }

    const authUser = authData.user;

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .single();

    // If profile doesn't exist, create it with ADMIN role
    if (profileError && profileError.code === 'PGRST116') {
      // Profile doesn't exist, create it
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          role: 'ADMIN',
          customer_mobile: null,
        });

      if (insertError) {
        console.error('Failed to create profile:', insertError);
        return NextResponse.json(
          { error: 'Failed to create user profile' },
          { status: 500 }
        );
      }
    } else if (profileError) {
      console.error('Profile error:', profileError);
      return NextResponse.json(
        { error: 'Failed to check user role' },
        { status: 500 }
      );
    } else if (profile?.role !== 'ADMIN') {
      // Profile exists but not admin - update it
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'ADMIN' })
        .eq('id', authData.user.id);

      if (updateError) {
        console.error('Failed to update profile:', updateError);
        return NextResponse.json(
          { error: 'Failed to set admin role' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authUser.id,
        email: authUser.email,
        role: 'ADMIN',
      },
      session: authData.session,
    });
  } catch (error) {
    console.error('Login error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    // Log full error details for debugging
    console.error('Full error details:', {
      message: errorMessage,
      stack: errorStack,
      env: {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        urlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
        serviceKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
      },
    });
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
