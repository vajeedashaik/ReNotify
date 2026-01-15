import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServiceRoleClient();
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 401 }
      );
    }

    // Verify user is admin
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

    // Get total customers (unique mobile numbers)
    const { count: totalCustomers } = await supabase
      .from('customer_products')
      .select('customer_mobile', { count: 'exact', head: true })
      .limit(1);

    const { data: uniqueCustomers } = await supabase
      .from('customer_products')
      .select('customer_mobile')
      .limit(10000);

    const uniqueCustomerCount = new Set(uniqueCustomers?.map(c => c.customer_mobile) || []).size;

    // Get total products
    const { count: totalProducts } = await supabase
      .from('customer_products')
      .select('*', { count: 'exact', head: true });

    // Get active warranties (warranty_end > today)
    const today = new Date().toISOString().split('T')[0];
    const { count: activeWarranties } = await supabase
      .from('customer_products')
      .select('*', { count: 'exact', head: true })
      .gte('warranty_end', today);

    // Get expiring warranties (within 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const { count: expiringWarranties } = await supabase
      .from('customer_products')
      .select('*', { count: 'exact', head: true })
      .gte('warranty_end', today)
      .lte('warranty_end', thirtyDaysFromNow.toISOString().split('T')[0]);

    // Get active AMCs
    const { count: activeAMCs } = await supabase
      .from('customer_products')
      .select('*', { count: 'exact', head: true })
      .eq('amc_active', true)
      .gte('amc_end_date', today);

    // Get upcoming services (within 30 days)
    const { count: upcomingServices } = await supabase
      .from('customer_products')
      .select('*', { count: 'exact', head: true })
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
