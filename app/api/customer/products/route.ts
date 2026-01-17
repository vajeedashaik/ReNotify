import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get customer mobile from profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('customer_mobile, role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'CUSTOMER' || !profile.customer_mobile) {
      return NextResponse.json(
        { error: 'Invalid customer profile' },
        { status: 403 }
      );
    }

    // RLS will automatically filter to this customer's products
    const { data: products, error: productsError } = await supabase
      .from('customer_products')
      .select('*')
      .eq('customer_mobile', profile.customer_mobile)
      .order('purchase_date', { ascending: false });

    if (productsError) {
      return NextResponse.json(
        { error: 'Failed to fetch products', details: productsError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ products: products || [] });
  } catch (error) {
    console.error('Products error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
