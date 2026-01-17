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
      return NextResponse.json({ invoices: [] });
    }

    // Get all products from user's datasets only
    const { data: products, error } = await supabase
      .from('customer_products')
      .select('*')
      .in('dataset_id', datasetIds)
      .order('purchase_date', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch invoices' },
        { status: 500 }
      );
    }

    if (!products) {
      return NextResponse.json({ invoices: [] });
    }

    // Transform products to invoices
    const invoices = products.map((product) => ({
      id: `inv-${product.id}`,
      invoice_id: product.invoice_id,
      customer_mobile: product.customer_mobile,
      retailer_name: product.retailer_name,
      purchase_date: product.purchase_date,
      product_category: product.product_category || 'Home Appliances',
      product_name: product.product_name,
      brand: product.brand,
      model_number: product.model_number,
      serial_number: product.serial_number,
      amount: 0, // Not in dataset
    }));

    return NextResponse.json({ invoices });
  } catch (error) {
    console.error('Invoices error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
