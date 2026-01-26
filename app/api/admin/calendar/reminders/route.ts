import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import type { CalendarReminder, ReminderStatus } from '@/lib/types';
import { daysUntil, todayStr, statusFromDays } from '@/lib/utils/calendarUtils';

export async function GET(request: NextRequest) {
  try {
    const { createClient } = await import('@/lib/supabase/server');
    const supabaseClient = await createClient();
    const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();

    if (sessionError || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized: Please log in' }, { status: 401 });
    }

    const userId = session.user.id;
    const supabase = await createServiceRoleClient();
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (profile?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const { data: userDatasets } = await supabase
      .from('datasets')
      .select('id')
      .eq('uploaded_by', userId);
    const datasetIds = userDatasets?.map((d) => d.id) || [];

    if (datasetIds.length === 0) {
      return NextResponse.json({ reminders: [] });
    }

    const { data: products, error } = await supabase
      .from('customer_products')
      .select('*')
      .in('dataset_id', datasetIds)
      .order('purchase_date', { ascending: false });

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
    if (!products) {
      return NextResponse.json({ reminders: [] });
    }

    const today = todayStr();
    const reminders: CalendarReminder[] = [];

    products.forEach((p: any) => {
      // Warranty
      const wDays = daysUntil(today, p.warranty_end);
      const wStatus: ReminderStatus = statusFromDays(wDays);
      reminders.push({
        id: `rem-w-${p.id}`,
        type: 'warranty',
        due_date: p.warranty_end,
        status: wStatus,
        days_until: wDays,
        product_id: p.id,
        product_name: p.product_name,
        brand: p.brand ?? '',
        model_number: p.model_number ?? '',
        retailer_name: p.retailer_name ?? '',
        customer_mobile: p.customer_mobile,
        consent_flag: p.consent_flag,
        city: p.city ?? '',
        pincode: p.pincode ?? '',
        start_date: p.warranty_start ?? p.purchase_date,
        end_date: p.warranty_end,
      });

      // AMC (only if active and has end date)
      if (p.amc_active && p.amc_end_date) {
        const aDays = daysUntil(today, p.amc_end_date);
        const aStatus: ReminderStatus = statusFromDays(aDays);
        reminders.push({
          id: `rem-a-${p.id}`,
          type: 'amc',
          due_date: p.amc_end_date,
          status: aStatus,
          days_until: aDays,
          product_id: p.id,
          product_name: p.product_name,
          brand: p.brand ?? '',
          model_number: p.model_number ?? '',
          retailer_name: p.retailer_name ?? '',
          customer_mobile: p.customer_mobile,
          consent_flag: p.consent_flag,
          city: p.city ?? '',
          pincode: p.pincode ?? '',
          start_date: p.purchase_date,
          end_date: p.amc_end_date,
        });
      }

      // Service (only if next_service_due)
      if (p.next_service_due) {
        const sDays = daysUntil(today, p.next_service_due);
        const sStatus: ReminderStatus = statusFromDays(sDays);
        reminders.push({
          id: `rem-s-${p.id}`,
          type: 'service',
          due_date: p.next_service_due,
          status: sStatus,
          days_until: sDays,
          product_id: p.id,
          product_name: p.product_name,
          brand: p.brand ?? '',
          model_number: p.model_number ?? '',
          retailer_name: p.retailer_name ?? '',
          customer_mobile: p.customer_mobile,
          consent_flag: p.consent_flag,
          city: p.city ?? '',
          pincode: p.pincode ?? '',
          start_date: p.purchase_date,
          end_date: p.next_service_due,
        });
      }
    });

    return NextResponse.json({ reminders });
  } catch (err) {
    console.error('Calendar reminders error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
