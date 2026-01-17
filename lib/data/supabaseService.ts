import { createClient } from '@/lib/supabase/client';
import { Customer, Product } from '../types';
import { transformDatasetToCustomers } from './dataTransformers';

export class SupabaseService {
  private getSupabase() {
    return createClient();
  }

  async getCustomers(): Promise<Customer[]> {
    const supabase = this.getSupabase();
    // For admin, get all unique customers
    const { data: products, error } = await supabase
      .from('customer_products')
      .select('*')
      .order('purchase_date', { ascending: false });

    if (error || !products) {
      return [];
    }

    // Group by customer_mobile
    const customerMap = new Map<string, any[]>();
    products.forEach((product: any) => {
      const mobile = product.customer_mobile.trim();
      if (!customerMap.has(mobile)) {
        customerMap.set(mobile, []);
      }
      customerMap.get(mobile)!.push(product);
    });

    // Transform to Customer objects
    const customers: Customer[] = [];
    let customerIdCounter = 1;
    let productIdCounter = 1;

    customerMap.forEach((rows, mobile) => {
      const firstRow = rows[0];
      const products: Product[] = rows.map((row: any) => {
        // Calculate warranty status
        const warrantyEnd = new Date(row.warranty_end);
        const today = new Date();
        const daysRemaining = Math.ceil((warrantyEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        let warrantyStatus: 'active' | 'expired' | 'expiring_soon' = 'active';
        if (daysRemaining < 0) warrantyStatus = 'expired';
        else if (daysRemaining <= 30) warrantyStatus = 'expiring_soon';

        // Calculate AMC status
        let amcStatus: 'active' | 'inactive' | 'expiring_soon' = 'inactive';
        if (row.amc_active && row.amc_end_date) {
          const amcEnd = new Date(row.amc_end_date);
          const amcDaysRemaining = Math.ceil((amcEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          if (amcDaysRemaining < 0) amcStatus = 'inactive';
          else if (amcDaysRemaining <= 30) amcStatus = 'expiring_soon';
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
          product_name: row.product_name,
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
            days_remaining: daysRemaining >= 0 ? daysRemaining : undefined,
          },
          amc: {
            amc_active: row.amc_active,
            amc_end_date: row.amc_end_date,
            status: amcStatus,
            days_remaining: amcStatus === 'active' || amcStatus === 'expiring_soon' ? 
              (row.amc_end_date ? Math.ceil((new Date(row.amc_end_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : undefined) : undefined,
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
        consent_flag: firstRow.consent_flag,
        city: firstRow.city,
        pincode: firstRow.pincode,
        products,
      });
    });

    return customers;
  }

  async getCustomerByMobile(mobile: string): Promise<Customer | null> {
    const supabase = this.getSupabase();
    const { data: products, error } = await supabase
      .from('customer_products')
      .select('*')
      .eq('customer_mobile', mobile.trim())
      .order('purchase_date', { ascending: false });

    if (error || !products || products.length === 0) {
      return null;
    }

    // Transform first product to get customer info
    const firstRow = products[0];
    const customer: Customer = {
      id: `c-${mobile}`,
      customer_mobile: mobile.trim(),
      consent_flag: firstRow.consent_flag,
      city: firstRow.city,
      pincode: firstRow.pincode,
      products: products.map((row: any, index: number) => {
        const warrantyEnd = new Date(row.warranty_end);
        const today = new Date();
        const daysRemaining = Math.ceil((warrantyEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        let warrantyStatus: 'active' | 'expired' | 'expiring_soon' = 'active';
        if (daysRemaining < 0) warrantyStatus = 'expired';
        else if (daysRemaining <= 30) warrantyStatus = 'expiring_soon';

        let amcStatus: 'active' | 'inactive' | 'expiring_soon' = 'inactive';
        if (row.amc_active && row.amc_end_date) {
          const amcEnd = new Date(row.amc_end_date);
          const amcDaysRemaining = Math.ceil((amcEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          if (amcDaysRemaining < 0) amcStatus = 'inactive';
          else if (amcDaysRemaining <= 30) amcStatus = 'expiring_soon';
          else amcStatus = 'active';
        }

        let serviceDaysUntil = 0;
        if (row.next_service_due) {
          const serviceDue = new Date(row.next_service_due);
          serviceDaysUntil = Math.ceil((serviceDue.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        }

        return {
          id: `p-${row.id}`,
          product_name: row.product_name,
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
            days_remaining: daysRemaining >= 0 ? daysRemaining : undefined,
          },
          amc: {
            amc_active: row.amc_active,
            amc_end_date: row.amc_end_date,
            status: amcStatus,
            days_remaining: amcStatus === 'active' || amcStatus === 'expiring_soon' ? 
              (row.amc_end_date ? Math.ceil((new Date(row.amc_end_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : undefined) : undefined,
          },
          service_reminder: {
            next_service_due: row.next_service_due,
            days_until_due: serviceDaysUntil,
          },
        };
      }),
    };

    return customer;
  }
}

export const supabaseService = new SupabaseService();
