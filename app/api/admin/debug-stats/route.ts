import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient, createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    // Get user from session
    const supabaseClient = await createClient();
    const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();

    if (sessionError || !session?.user) {
      return NextResponse.json({
        error: 'Unauthorized',
        hasSession: false,
      }, { status: 401 });
    }

    const userId = session.user.id;

    // Use service role client for debugging
    const supabase = await createServiceRoleClient();

    // Check profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    // Check datasets
    const { data: datasets, error: datasetsError } = await supabase
      .from('datasets')
      .select('id, file_name, row_count, uploaded_at')
      .eq('uploaded_by', userId);

    const datasetIds = datasets?.map(d => d.id) || [];

    // Check products
    let productsCount = 0;
    let productsSample: any[] = [];
    
    if (datasetIds.length > 0) {
      const { data: products, error: productsError } = await supabase
        .from('customer_products')
        .select('id, customer_mobile, product_name, dataset_id')
        .in('dataset_id', datasetIds)
        .limit(10);

      if (!productsError && products) {
        productsCount = products.length;
        productsSample = products;
      }
    }

    // Get total count from database
    let totalProductsCount = 0;
    if (datasetIds.length > 0) {
      const { count } = await supabase
        .from('customer_products')
        .select('*', { count: 'exact', head: true })
        .in('dataset_id', datasetIds);
      
      totalProductsCount = count || 0;
    }

    return NextResponse.json({
      debug: true,
      userId,
      profile: profile || null,
      profileError: profileError?.message || null,
      role: profile?.role || null,
      datasets: datasets || [],
      datasetsError: datasetsError?.message || null,
      datasetCount: datasets?.length || 0,
      datasetIds,
      productsSample,
      productsSampleCount: productsCount,
      totalProductsCount,
      hasData: totalProductsCount > 0,
    });
  } catch (error) {
    console.error('Debug stats error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
