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

    // Normalize mobile for email (remove spaces, special chars)
    const cleanMobile = normalizedMobile.replace(/\s+/g, '').replace(/[^0-9]/g, '');
    
    // Validate mobile number format
    if (!cleanMobile || cleanMobile.length < 10) {
      return NextResponse.json(
        { error: 'Invalid mobile number format' },
        { status: 400 }
      );
    }
    
    // Use format with standard domain (.com instead of .local) and ensure it starts with a letter
    // Format: c{last9digits}@renotify.app (using last 9 digits to keep it shorter)
    // This ensures valid email format that Supabase will accept
    const mobileSuffix = cleanMobile.slice(-9); // Last 9 digits
    const customerEmail = `c${mobileSuffix}@renotify.app`;
    
    // Use a consistent password based on mobile (for mobile-based auth)
    // In production, you might want to use OTP or magic links instead
    const customerPassword = `customer_${cleanMobile}_${process.env.CUSTOMER_AUTH_SECRET || 'default_secret'}`;

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('customer_mobile', normalizedMobile)
      .single();

    let userId: string;

    if (existingProfile) {
      // Profile exists, use existing user ID
      userId = existingProfile.id;
    } else {
      // New user - create auth account first
      // Note: The database trigger will automatically create a profile with role='CUSTOMER'
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: customerEmail,
        password: customerPassword,
      });

      if (authError) {
        // If user already exists (email taken), try to sign in to get the user ID
        if (authError.message.includes('already registered') || authError.message.includes('already exists')) {
          // Try to sign in to get user ID
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: customerEmail,
            password: customerPassword,
          });

          if (signInError || !signInData.user) {
            console.error('Sign in error after signup failed:', signInError);
            return NextResponse.json(
              { error: 'Account exists but password mismatch. Please contact support.' },
              { status: 500 }
            );
          }

          userId = signInData.user.id;
        } else {
          console.error('Auth creation error:', authError);
          return NextResponse.json(
            { error: 'Failed to create account', details: authError.message },
            { status: 500 }
          );
        }
      } else if (!authData.user) {
        return NextResponse.json(
          { error: 'Failed to create account - no user returned' },
          { status: 500 }
        );
      } else {
        userId = authData.user.id;
      }

      // Wait for trigger to create profile (trigger runs automatically on user signup)
      // Poll for profile to exist (up to 2 seconds)
      let profileExists = false;
      for (let i = 0; i < 10; i++) {
        const { data: checkProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', userId)
          .single();
        
        if (checkProfile) {
          profileExists = true;
          break;
        }
        await new Promise(resolve => setTimeout(resolve, 200)); // Wait 200ms between checks
      }

      if (!profileExists) {
        // Profile wasn't created by trigger (shouldn't happen, but handle it)
        console.warn('Profile not created by trigger, attempting direct insert');
      }

      // Update or insert profile with customer_mobile
      // Try UPDATE first (if trigger created it)
      let profileError;
      if (profileExists) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            customer_mobile: normalizedMobile,
            role: 'CUSTOMER', // Ensure role is set correctly
          })
          .eq('id', userId);
        
        profileError = updateError;
      }

      // If update failed or profile doesn't exist, try insert (using service role should bypass RLS)
      if (profileError || !profileExists) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            role: 'CUSTOMER',
            customer_mobile: normalizedMobile,
          });

        if (insertError) {
          console.error('Profile insert error:', insertError);
          // If insert also fails, try upsert as last resort
          const { error: upsertError } = await supabase
            .from('profiles')
            .upsert({
              id: userId,
              role: 'CUSTOMER',
              customer_mobile: normalizedMobile,
            }, {
              onConflict: 'id'
            });

          if (upsertError) {
            console.error('Profile upsert error:', upsertError);
            return NextResponse.json(
              { error: 'Failed to create/update profile. Please ensure the database trigger is working correctly.', 
                details: upsertError.message || insertError.message || profileError?.message },
              { status: 500 }
            );
          }
        }
      }
    }

    // Return credentials for client to sign in
    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        mobile: normalizedMobile,
        role: 'CUSTOMER',
        email: customerEmail,
        password: customerPassword, // Client will use this to sign in
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
