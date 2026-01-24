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

// Service Center types
export interface ServiceCenter {
  service_center_id: string;
  service_center_name: string;
  service_center_type?: string;
  parent_partner?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  supported_brands?: string[];
  supported_categories?: string[];
  warranty_supported: boolean;
  amc_supported: boolean;
  rating?: number;
  contact_number?: string;
  opening_hours?: string;
  latitude?: number;
  longitude?: number;
  last_verified_at?: string | null;
  active_status: boolean;
  distance_km?: number; // Calculated field
  ranking_score?: number; // Calculated field
}

// Calendar reminder: flattened from product (warranty / AMC / service)
export type ReminderType = 'warranty' | 'amc' | 'service';

export type ReminderStatus = 'active' | 'expiring_soon' | 'expired';

export interface CalendarReminder {
  id: string;
  type: ReminderType;
  due_date: string;
  status: ReminderStatus;
  days_until: number; // negative = past
  product_id: string;
  product_name: string;
  brand: string;
  model_number: string;
  retailer_name: string;
  customer_mobile: string;
  consent_flag: boolean;
  city: string;
  pincode: string;
  // For expiry progress
  start_date?: string;
  end_date: string;
}

// Service Center dataset row structure
export interface ServiceCenterRow {
  service_center_id: string;
  service_center_name: string;
  service_center_type?: string;
  parent_partner?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  supported_brands?: string;
  supported_categories?: string;
  warranty_supported?: string | boolean;
  amc_supported?: string | boolean;
  rating?: string | number;
  contact_number?: string;
  opening_hours?: string;
  latitude?: string | number;
  longitude?: string | number;
  last_verified_at?: string | null;
  active_status?: string | boolean;
}