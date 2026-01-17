import { DatasetRow } from '../types';

const REQUIRED_COLUMNS = [
  'customer_mobile',
  'consent_flag',
  'retailer_name',
  'invoice_id',
  'purchase_date',
  'product_category',
  'product_name',
  'brand',
  'model_number',
  'serial_number',
  'warranty_start',
  'warranty_end',
  'warranty_type',
  'amc_active',
  'amc_end_date',
  'next_service_due',
  'city',
  'pincode',
];

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateDatasetColumns(headers: string[]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const normalizedHeaders = headers.map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));

  // Check for required columns
  for (const required of REQUIRED_COLUMNS) {
    if (!normalizedHeaders.includes(required.toLowerCase())) {
      errors.push(`Missing required column: ${required}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function validateDatasetRow(row: any, index: number): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate customer_mobile
  if (!row.customer_mobile || typeof row.customer_mobile !== 'string') {
    errors.push(`Row ${index + 1}: customer_mobile is required`);
  } else {
    const mobile = String(row.customer_mobile).trim();
    if (mobile.length < 10) {
      errors.push(`Row ${index + 1}: customer_mobile appears invalid`);
    }
  }

  // Validate consent_flag
  if (row.consent_flag === undefined || row.consent_flag === null) {
    errors.push(`Row ${index + 1}: consent_flag is required`);
  } else {
    const consent = String(row.consent_flag).toUpperCase();
    if (!['YES', 'NO', 'TRUE', 'FALSE', '1', '0'].includes(consent)) {
      warnings.push(`Row ${index + 1}: consent_flag has unexpected value: ${row.consent_flag}`);
    }
  }

  // Validate dates
  const dateFields = ['purchase_date', 'warranty_start', 'warranty_end', 'next_service_due'];
  for (const field of dateFields) {
    if (row[field] && isNaN(Date.parse(row[field]))) {
      warnings.push(`Row ${index + 1}: ${field} may have invalid date format`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function normalizeConsentFlag(value: any): boolean {
  if (typeof value === 'boolean') return value;
  const str = String(value).toUpperCase().trim();
  return ['YES', 'TRUE', '1', 'Y'].includes(str);
}

export function normalizeAMCActive(value: any): boolean {
  if (typeof value === 'boolean') return value;
  const str = String(value).toUpperCase().trim();
  return ['YES', 'TRUE', '1', 'Y'].includes(str);
}
