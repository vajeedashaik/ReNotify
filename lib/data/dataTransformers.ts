import { DatasetRow, Customer, Product, Warranty, AMC, ServiceReminder } from '../types';

// Helper function to calculate days between dates
const daysBetween = (date1: string, date2: string): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Helper function to get warranty status
const getWarrantyStatus = (endDate: string): 'active' | 'expired' | 'expiring_soon' => {
  const days = daysBetween(new Date().toISOString().split('T')[0], endDate);
  if (days < 0) return 'expired';
  if (days <= 30) return 'expiring_soon';
  return 'active';
};

// Helper function to get AMC status
const getAMCStatus = (endDate: string | null, active: boolean): 'active' | 'inactive' | 'expiring_soon' => {
  if (!active || !endDate) return 'inactive';
  const days = daysBetween(new Date().toISOString().split('T')[0], endDate);
  if (days < 0) return 'inactive';
  if (days <= 30) return 'expiring_soon';
  return 'active';
};

export function transformDatasetRowToProduct(row: DatasetRow, productId: string): Product {
  const warrantyStatus = getWarrantyStatus(row.warranty_end);
  const amcStatus = getAMCStatus(row.amc_end_date, row.amc_active as boolean);

  return {
    id: productId,
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
      days_remaining: warrantyStatus !== 'expired' ? daysBetween(new Date().toISOString().split('T')[0], row.warranty_end) : undefined,
    },
    amc: {
      amc_active: row.amc_active as boolean,
      amc_end_date: row.amc_end_date,
      status: amcStatus,
      days_remaining: amcStatus === 'active' || amcStatus === 'expiring_soon' ? (row.amc_end_date ? daysBetween(new Date().toISOString().split('T')[0], row.amc_end_date) : undefined) : undefined,
    },
    service_reminder: {
      next_service_due: row.next_service_due,
      days_until_due: daysBetween(new Date().toISOString().split('T')[0], row.next_service_due),
    },
  };
}

export function transformDatasetToCustomers(rows: DatasetRow[]): Customer[] {
  // Group rows by customer_mobile
  const customerMap = new Map<string, DatasetRow[]>();
  
  rows.forEach((row) => {
    const mobile = row.customer_mobile.trim();
    if (!customerMap.has(mobile)) {
      customerMap.set(mobile, []);
    }
    customerMap.get(mobile)!.push(row);
  });

  // Transform to Customer objects
  const customers: Customer[] = [];
  let customerIdCounter = 1;
  let productIdCounter = 1;

  customerMap.forEach((rows, mobile) => {
    // Use first row for customer info (assuming same mobile = same customer)
    const firstRow = rows[0];
    
    const products: Product[] = rows.map((row) => {
      const product = transformDatasetRowToProduct(row, `p${productIdCounter++}`);
      return product;
    });

    customers.push({
      id: `c${customerIdCounter++}`,
      customer_mobile: mobile,
      consent_flag: firstRow.consent_flag as boolean,
      city: firstRow.city,
      pincode: firstRow.pincode,
      products,
    });
  });

  return customers;
}
