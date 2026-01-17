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

    const today = new Date().toISOString().split('T')[0];

    // Get all products for this customer (RLS filtered)
    const { data: products } = await supabase
      .from('customer_products')
      .select('*')
      .eq('customer_mobile', profile.customer_mobile);

    if (!products) {
      return NextResponse.json({
        totalProducts: 0,
        activeWarranties: 0,
        activeAMCs: 0,
        upcomingExpiries: 0,
      });
    }

    const totalProducts = products.length;
    const activeWarranties = products.filter(p => p.warranty_end >= today).length;
    const activeAMCs = products.filter(p => p.amc_active && p.amc_end_date && p.amc_end_date >= today).length;

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const thirtyDaysStr = thirtyDaysFromNow.toISOString().split('T')[0];

    const upcomingExpiries = products.filter(p => {
      const warrantyExpiring = p.warranty_end >= today && p.warranty_end <= thirtyDaysStr;
      const amcExpiring = p.amc_active && p.amc_end_date && p.amc_end_date >= today && p.amc_end_date <= thirtyDaysStr;
      const serviceDue = p.next_service_due && p.next_service_due <= thirtyDaysStr && p.next_service_due >= today;
      return warrantyExpiring || amcExpiring || serviceDue;
    }).length;

    return NextResponse.json({
      totalProducts,
      activeWarranties,
      activeAMCs,
      upcomingExpiries,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
