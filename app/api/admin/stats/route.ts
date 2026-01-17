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

    // If user has no datasets, return zeros
    if (datasetIds.length === 0) {
      return NextResponse.json({
        totalCustomers: 0,
        totalProducts: 0,
        activeWarranties: 0,
        expiringWarranties30: 0,
        activeAMCs: 0,
        upcomingServices: 0,
      });
    }

    // Get total customers (unique mobile numbers) - only from user's datasets
    const { data: uniqueCustomers } = await supabase
      .from('customer_products')
      .select('customer_mobile')
      .in('dataset_id', datasetIds)
      .limit(10000);

    const uniqueCustomerCount = new Set(uniqueCustomers?.map(c => c.customer_mobile) || []).size;

    // Get total products - only from user's datasets
    const { count: totalProducts } = await supabase
      .from('customer_products')
      .select('*', { count: 'exact', head: true })
      .in('dataset_id', datasetIds);

    // Get active warranties (warranty_end > today) - only from user's datasets
    const today = new Date().toISOString().split('T')[0];
    const { count: activeWarranties } = await supabase
      .from('customer_products')
      .select('*', { count: 'exact', head: true })
      .in('dataset_id', datasetIds)
      .gte('warranty_end', today);

    // Get expiring warranties (within 30 days) - only from user's datasets
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const { count: expiringWarranties } = await supabase
      .from('customer_products')
      .select('*', { count: 'exact', head: true })
      .in('dataset_id', datasetIds)
      .gte('warranty_end', today)
      .lte('warranty_end', thirtyDaysFromNow.toISOString().split('T')[0]);

    // Get active AMCs - only from user's datasets
    const { count: activeAMCs } = await supabase
      .from('customer_products')
      .select('*', { count: 'exact', head: true })
      .in('dataset_id', datasetIds)
      .eq('amc_active', true)
      .gte('amc_end_date', today);

    // Get upcoming services (within 30 days) - only from user's datasets
    const { count: upcomingServices } = await supabase
      .from('customer_products')
      .select('*', { count: 'exact', head: true })
      .in('dataset_id', datasetIds)
      .lte('next_service_due', thirtyDaysFromNow.toISOString().split('T')[0])
      .gte('next_service_due', today);

    return NextResponse.json({
      totalCustomers: uniqueCustomerCount,
      totalProducts: totalProducts || 0,
      activeWarranties: activeWarranties || 0,
      expiringWarranties30: expiringWarranties || 0,
      activeAMCs: activeAMCs || 0,
      upcomingServices: upcomingServices || 0,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
