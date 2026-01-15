import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServiceRoleClient();

    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const thirtyDaysStr = thirtyDaysFromNow.toISOString().split('T')[0];

    // Get all products (admin has full access)
    const { data: products, error } = await supabase
      .from('customer_products')
      .select('*')
      .order('purchase_date', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }

    if (!products) {
      return NextResponse.json({ alerts: [] });
    }

    // Generate alerts
    const alerts: any[] = [];

    products.forEach((product) => {
      // Service due alerts
      if (product.next_service_due && product.next_service_due <= thirtyDaysStr && product.next_service_due >= today) {
        const daysUntil = Math.ceil((new Date(product.next_service_due).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24));
        alerts.push({
          id: `alert-service-${product.id}`,
          type: 'service_due',
          customer_mobile: product.customer_mobile,
          product_name: product.product_name,
          product_id: product.id,
          due_date: product.next_service_due,
          consent_flag: product.consent_flag,
          days_until: daysUntil,
        });
      }

      // Warranty expiring alerts
      if (product.warranty_end && product.warranty_end <= thirtyDaysStr && product.warranty_end >= today) {
        const daysUntil = Math.ceil((new Date(product.warranty_end).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24));
        alerts.push({
          id: `alert-warranty-${product.id}`,
          type: 'warranty_expiring',
          customer_mobile: product.customer_mobile,
          product_name: product.product_name,
          product_id: product.id,
          due_date: product.warranty_end,
          consent_flag: product.consent_flag,
          days_until: daysUntil,
        });
      }

      // AMC ending alerts
      if (product.amc_active && product.amc_end_date && product.amc_end_date <= thirtyDaysStr && product.amc_end_date >= today) {
        const daysUntil = Math.ceil((new Date(product.amc_end_date).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24));
        alerts.push({
          id: `alert-amc-${product.id}`,
          type: 'amc_ending',
          customer_mobile: product.customer_mobile,
          product_name: product.product_name,
          product_id: product.id,
          due_date: product.amc_end_date,
          consent_flag: product.consent_flag,
          days_until: daysUntil,
        });
      }
    });

    return NextResponse.json({ alerts });
  } catch (error) {
    console.error('Alerts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
