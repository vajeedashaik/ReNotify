import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceRoleClient } from '@/lib/supabase/server';

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
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Missing environment variables:', {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      });
      return NextResponse.json(
        { error: 'Supabase is not configured. Please set up your environment variables.' },
        { status: 500 }
      );
    }

    // Use regular server client for authentication (this properly handles cookies)
    let supabase;
    try {
      supabase = await createClient();
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

    // Sign in with Supabase Auth using regular client (this sets cookies properly)
    console.log('Attempting to sign in user:', email);
    
    // Add timeout wrapper for Supabase auth call
    const authPromise = supabase.auth.signInWithPassword({
      email,
      password,
    });

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Supabase authentication timeout')), 10000); // 10 second timeout
    });

    let authData, authError;
    try {
      const result = await Promise.race([authPromise, timeoutPromise]) as any;
      authData = result.data;
      authError = result.error;
    } catch (error) {
      if (error instanceof Error && error.message.includes('timeout')) {
        console.error('Supabase authentication timed out');
        return NextResponse.json(
          { 
            error: 'Connection timeout. Please check if your Supabase project is active and accessible.',
            details: process.env.NODE_ENV === 'development' 
              ? 'The Supabase project might be paused. Check your Supabase dashboard.' 
              : undefined
          },
          { status: 504 }
        );
      }
      console.error('Unexpected auth error:', error);
      return NextResponse.json(
        { error: 'Authentication failed' },
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

    // Use service role client to check/update profile (bypasses RLS)
    let serviceRoleClient;
    try {
      serviceRoleClient = await createServiceRoleClient();
    } catch (serviceError) {
      console.error('Failed to create service role client:', serviceError);
      // Continue without service role - try with regular client
    }

    const clientForProfile = serviceRoleClient || supabase;

    // Check if user is admin
    const { data: profile, error: profileError } = await clientForProfile
      .from('profiles')
      .select('role')
      .eq('id', authUser.id)
      .single();

    // If profile doesn't exist, create it with ADMIN role
    if (profileError && profileError.code === 'PGRST116') {
      // Profile doesn't exist, create it
      const { error: insertError } = await clientForProfile
        .from('profiles')
        .insert({
          id: authUser.id,
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
      const { error: updateError } = await clientForProfile
        .from('profiles')
        .update({ role: 'ADMIN' })
        .eq('id', authUser.id);

      if (updateError) {
        console.error('Failed to update profile:', updateError);
        return NextResponse.json(
          { error: 'Failed to set admin role' },
          { status: 500 }
        );
      }
    }

    // Get the session from the regular client (cookies are already set)
    const { data: { session } } = await supabase.auth.getSession();

    return NextResponse.json({
      success: true,
      user: {
        id: authUser.id,
        email: authUser.email,
        role: 'ADMIN',
      },
      session: session,
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
