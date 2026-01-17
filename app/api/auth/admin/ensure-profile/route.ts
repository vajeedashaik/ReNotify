import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    // Verify Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Supabase is not configured' },
        { status: 500 }
      );
    }

    const supabase = await createServiceRoleClient();

    // Check if profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    // If profile doesn't exist, create it with ADMIN role
    if (profileError && profileError.code === 'PGRST116') {
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
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

      return NextResponse.json({ success: true, created: true });
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
        .eq('id', userId);

      if (updateError) {
        console.error('Failed to update profile:', updateError);
        return NextResponse.json(
          { error: 'Failed to set admin role' },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, updated: true });
    }

    return NextResponse.json({ success: true, alreadyAdmin: true });
  } catch (error) {
    console.error('Ensure profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
