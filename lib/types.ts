export interface Customer {
  id: string;
  customer_mobile: string;
  consent_flag: boolean;
  city: string;
  pincode: string;
  products: Product[];
}

export interface Product {
  id: string;
  product_name: string;
  brand: string;
  model_number: string;
  serial_number: string;
  retailer_name: string;
  invoice_id: string;
  purchase_date: string;
  warranty: Warranty;
  amc: AMC;
  service_reminder: ServiceReminder;
}

export interface Warranty {
  warranty_type: string;
  warranty_start: string;
  warranty_end: string;
  status: 'active' | 'expired' | 'expiring_soon';
  days_remaining?: number;
}

export interface AMC {
  amc_active: boolean;
  amc_end_date: string | null;
  status: 'active' | 'inactive' | 'expiring_soon';
  days_remaining?: number;
}

export interface ServiceReminder {
  next_service_due: string;
  days_until_due: number;
}

export interface Invoice {
  id: string;
  invoice_id: string;
  customer_mobile: string;
  retailer_name: string;
  purchase_date: string;
  product_category: string;
  product_name: string;
  brand: string;
  model_number: string;
  serial_number: string;
  amount: number;
}

export interface Alert {
  id: string;
  type: 'service_due' | 'warranty_expiring' | 'amc_ending';
  customer_mobile: string;
  customer_id: string;
  product_name: string;
  product_id: string;
  due_date: string;
  consent_flag: boolean;
  days_until: number;
}

export interface Activity {
  id: string;
  type: 'warranty_expiring' | 'amc_ending' | 'service_due' | 'customer_added' | 'invoice_uploaded';
  message: string;
  timestamp: string;
  customer_id?: string;
  product_id?: string;
}

// Dataset row structure matching Excel/CSV format
export interface DatasetRow {
  customer_mobile: string;
  consent_flag: string | boolean;
  retailer_name: string;
  invoice_id: string;
  purchase_date: string | null;
  product_category: string;
  product_name: string;
  brand: string;
  model_number: string;
  serial_number: string;
  warranty_start: string | null;
  warranty_end: string | null;
  warranty_type: string;
  amc_active: string | boolean;
  amc_end_date: string | null;
  next_service_due: string | null;
  city: string;
  pincode: string;
}

// Auth user types
export interface AdminUser {
  email: string;
  role: 'ADMIN';
}

export interface CustomerUser {
  mobile: string;
  role: 'CUSTOMER';
}

export type AuthUser = AdminUser | CustomerUser;
