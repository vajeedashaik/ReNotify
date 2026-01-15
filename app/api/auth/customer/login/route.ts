import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { mobile } = await request.json();

    if (!mobile) {
      return NextResponse.json(
        { error: 'Mobile number required' },
        { status: 400 }
      );
    }

    const normalizedMobile = mobile.trim();
    const supabase = await createServiceRoleClient();

    // Check if mobile exists in customer_products with consent
    const { data: products, error: productsError } = await supabase
      .from('customer_products')
      .select('customer_mobile, consent_flag')
      .eq('customer_mobile', normalizedMobile)
      .eq('consent_flag', true)
      .limit(1);

    if (productsError || !products || products.length === 0) {
      return NextResponse.json(
        { error: 'Mobile number not found or consent not provided' },
        { status: 404 }
      );
    }

    // Check if user already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('customer_mobile', normalizedMobile)
      .single();

    let userId: string;

    if (existingProfile) {
      userId = existingProfile.id;
    } else {
      // Create new auth user with mobile as email (temporary)
      const tempEmail = `${normalizedMobile.replace(/\s+/g, '')}@customer.renotify.local`;
      const tempPassword = `temp_${Date.now()}_${Math.random().toString(36).slice(2)}`;

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: tempEmail,
        password: tempPassword,
      });

      if (authError || !authData.user) {
        return NextResponse.json(
          { error: 'Failed to create account' },
          { status: 500 }
        );
      }

      userId = authData.user.id;

      // Update profile with customer_mobile and ensure role is CUSTOMER
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          role: 'CUSTOMER',
          customer_mobile: normalizedMobile,
        })
        .eq('id', userId);

      if (profileError) {
        return NextResponse.json(
          { error: 'Failed to update profile' },
          { status: 500 }
        );
      }
    }

    // Return user info - client will handle session management
    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        mobile: normalizedMobile,
        role: 'CUSTOMER',
      },
    });
  } catch (error) {
    console.error('Customer login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
