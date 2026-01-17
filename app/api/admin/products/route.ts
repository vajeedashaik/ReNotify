import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    // Get user from session (using regular client to read cookies)
    const { createClient } = await import('@/lib/supabase/server');
    const supabaseClient = await createClient();
    const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();

    if (sessionError || !session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized: Please log in' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Verify user is admin (using service role to bypass RLS)
    const supabase = await createServiceRoleClient();
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (profile?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    // Get user's datasets to filter products
    const { data: userDatasets } = await supabase
      .from('datasets')
      .select('id')
      .eq('uploaded_by', userId);

    const datasetIds = userDatasets?.map(d => d.id) || [];

    // If user has no datasets, return empty array
    if (datasetIds.length === 0) {
      return NextResponse.json({ products: [] });
    }

    // Get all products from user's datasets only
    const { data: products, error } = await supabase
      .from('customer_products')
      .select('*')
      .in('dataset_id', datasetIds)
      .order('purchase_date', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }

    if (!products) {
      return NextResponse.json({ products: [] });
    }

    const today = new Date().toISOString().split('T')[0];

    // Transform products with status calculations
    const transformedProducts = products.map((product) => {
      const warrantyEnd = product.warranty_end || today;
      const warrantyDays = Math.ceil((new Date(warrantyEnd).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24));
      
      let warrantyStatus: 'active' | 'expired' | 'expiring_soon' = 'active';
      if (warrantyDays < 0) warrantyStatus = 'expired';
      else if (warrantyDays <= 30) warrantyStatus = 'expiring_soon';

      let amcStatus: 'active' | 'inactive' | 'expiring_soon' = 'inactive';
      if (product.amc_active && product.amc_end_date) {
        const amcDays = Math.ceil((new Date(product.amc_end_date).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24));
        if (amcDays < 0) amcStatus = 'inactive';
        else if (amcDays <= 30) amcStatus = 'expiring_soon';
        else amcStatus = 'active';
      }

      return {
        id: product.id,
        product_name: product.product_name,
        brand: product.brand,
        model_number: product.model_number,
        serial_number: product.serial_number,
        customer_mobile: product.customer_mobile,
        customer_id: `c-${product.customer_mobile}`,
        warranty: {
          status: warrantyStatus,
        },
        amc: {
          status: amcStatus,
        },
      };
    });

    return NextResponse.json({ products: transformedProducts });
  } catch (error) {
    console.error('Products error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
