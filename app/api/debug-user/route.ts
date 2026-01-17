import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  // Only expose in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('id') || '7ff2e136-2304-44d8-ab30-1ab91c48cfd8';

  try {
    const supabase = await createServiceRoleClient();

    // Check if user exists in auth
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId);
    
    // Check if profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    return NextResponse.json({
      userId,
      authUser: authUser ? {
        id: authUser.user?.id,
        email: authUser.user?.email,
        exists: !!authUser.user,
      } : null,
      authError: authError?.message,
      profile: profile || null,
      profileError: profileError?.message,
      hasAdminRole: profile?.role === 'ADMIN',
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      userId,
    }, { status: 500 });
  }
}
