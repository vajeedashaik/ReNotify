import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServiceRoleClient();

    // Get all products (admin has full access)
    const { data: products, error } = await supabase
      .from('customer_products')
      .select('*')
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
