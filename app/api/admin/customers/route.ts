import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { Customer, Product } from '@/lib/types';

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
      return NextResponse.json({ customers: [] });
    }

    // Get all products from user's datasets
    const { data: products, error: productsError } = await supabase
      .from('customer_products')
      .select('*')
      .in('dataset_id', datasetIds)
      .order('purchase_date', { ascending: false });

    if (productsError) {
      console.error('Error fetching products:', productsError);
      return NextResponse.json(
        { error: 'Failed to fetch products', details: productsError.message },
        { status: 500 }
      );
    }

    if (!products || products.length === 0) {
      return NextResponse.json({ customers: [] });
    }

    // Group by customer_mobile
    const customerMap = new Map<string, any[]>();
    products.forEach((product: any) => {
      const mobile = (product.customer_mobile || '').trim();
      if (!mobile) return; // Skip products without mobile
      
      if (!customerMap.has(mobile)) {
        customerMap.set(mobile, []);
      }
      customerMap.get(mobile)!.push(product);
    });

    // Transform to Customer objects
    const customers: Customer[] = [];
    let customerIdCounter = 1;
    let productIdCounter = 1;
    const today = new Date();

    customerMap.forEach((rows, mobile) => {
      const firstRow = rows[0];
      const products: Product[] = rows.map((row: any) => {
        // Calculate warranty status
        const warrantyEnd = row.warranty_end ? new Date(row.warranty_end) : null;
        let warrantyStatus: 'active' | 'expired' | 'expiring_soon' = 'active';
        let daysRemaining: number | undefined = undefined;
        
        if (warrantyEnd) {
          const daysRemainingCalc = Math.ceil((warrantyEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          daysRemaining = daysRemainingCalc;
          if (daysRemainingCalc < 0) warrantyStatus = 'expired';
          else if (daysRemainingCalc <= 30) warrantyStatus = 'expiring_soon';
        }

        // Calculate AMC status
        let amcStatus: 'active' | 'inactive' | 'expiring_soon' = 'inactive';
        let amcDaysRemaining: number | undefined = undefined;
        
        if (row.amc_active && row.amc_end_date) {
          const amcEnd = new Date(row.amc_end_date);
          const amcDaysRemainingCalc = Math.ceil((amcEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          amcDaysRemaining = amcDaysRemainingCalc;
          if (amcDaysRemainingCalc < 0) amcStatus = 'inactive';
          else if (amcDaysRemainingCalc <= 30) amcStatus = 'expiring_soon';
          else amcStatus = 'active';
        }

        // Calculate service reminder days
        let serviceDaysUntil = 0;
        if (row.next_service_due) {
          const serviceDue = new Date(row.next_service_due);
          serviceDaysUntil = Math.ceil((serviceDue.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        }

        return {
          id: `p${productIdCounter++}`,
          product_name: row.product_name || 'Unknown Product',
          brand: row.brand,
          model_number: row.model_number,
          serial_number: row.serial_number,
          retailer_name: row.retailer_name,
          invoice_id: row.invoice_id,
          purchase_date: row.purchase_date,
          warranty: {
            warranty_type: row.warranty_type,
            warranty_start: row.warranty_start,
            warranty_end: row.warranty_end,
            status: warrantyStatus,
            days_remaining: daysRemaining,
          },
          amc: {
            amc_active: row.amc_active,
            amc_end_date: row.amc_end_date,
            status: amcStatus,
            days_remaining: amcDaysRemaining,
          },
          service_reminder: {
            next_service_due: row.next_service_due,
            days_until_due: serviceDaysUntil,
          },
        };
      });

      customers.push({
        id: `c${customerIdCounter++}`,
        customer_mobile: mobile,
        consent_flag: firstRow.consent_flag || false,
        city: firstRow.city || '',
        pincode: firstRow.pincode || '',
        products,
      });
    });

    return NextResponse.json({ customers });
  } catch (error) {
    console.error('Customers API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
