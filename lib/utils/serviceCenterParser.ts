import * as XLSX from 'xlsx';
import { ServiceCenterRow } from '../types';

export interface ServiceCenterParseResult {
  success: boolean;
  data: ServiceCenterRow[];
  errors: string[];
  warnings: string[];
  rowCount: number;
}

// Required columns for service centers
const REQUIRED_COLUMNS = ['service_center_id', 'service_center_name'];

// Helper function to normalize date values
function normalizeDate(value: any): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  
  const str = String(value).trim();
  
  if (str === '' || str.toLowerCase() === 'null' || str.toLowerCase() === 'n/a' || str.toLowerCase() === 'na') {
    return null;
  }
  
  return str;
}

// Helper function to normalize boolean values
function normalizeBoolean(value: any): boolean {
  if (typeof value === 'boolean') return value;
  if (value === null || value === undefined) return false;
  
  const str = String(value).trim().toLowerCase();
  return str === 'true' || str === 'yes' || str === '1' || str === 'y';
}

// Helper function to parse array fields (comma-separated)
function parseArray(value: any): string[] | undefined {
  if (!value) return undefined;
  const str = String(value).trim();
  if (str === '' || str.toLowerCase() === 'null') return undefined;
  return str.split(',').map(item => item.trim()).filter(item => item.length > 0);
}

// Helper function to parse number
function parseNumber(value: any): number | undefined {
  if (value === null || value === undefined || value === '') return undefined;
  const num = Number(value);
  return isNaN(num) ? undefined : num;
}

// Helper function to convert File to ArrayBuffer
async function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  if (typeof FileReader !== 'undefined') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  } else {
    return file.arrayBuffer();
  }
}

// Helper function to convert File to text
async function fileToText(file: File): Promise<string> {
  if (typeof FileReader !== 'undefined') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  } else {
    return file.text();
  }
}

// Validate columns
function validateColumns(headers: string[]): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const normalizedHeaders = headers.map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));
  
  // Check required columns
  const missingColumns = REQUIRED_COLUMNS.filter(col => !normalizedHeaders.includes(col));
  if (missingColumns.length > 0) {
    errors.push(`Missing required columns: ${missingColumns.join(', ')}`);
  }
  
  return { valid: errors.length === 0, errors, warnings };
}

export async function parseServiceCenterExcelFile(file: File): Promise<ServiceCenterParseResult> {
  try {
    const arrayBuffer = await fileToArrayBuffer(file);
    const data = new Uint8Array(arrayBuffer);
    
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });

    if (jsonData.length === 0) {
      return {
        success: false,
        data: [],
        errors: ['Excel file is empty'],
        warnings: [],
        rowCount: 0,
      };
    }

    // Normalize headers
    const headers = Object.keys(jsonData[0] || {});
    const normalizedHeaders = headers.map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));

    // Validate columns
    const columnValidation = validateColumns(headers);
    if (!columnValidation.valid) {
      return {
        success: false,
        data: [],
        errors: columnValidation.errors,
        warnings: columnValidation.warnings,
        rowCount: 0,
      };
    }

    // Parse rows
    const parsedRows: ServiceCenterRow[] = [];
    const errors: string[] = [];
    const warnings: string[] = [];

    jsonData.forEach((row: any, index: number) => {
      const normalizedRow: any = {};
      headers.forEach((header, i) => {
        const normalizedKey = normalizedHeaders[i];
        normalizedRow[normalizedKey] = row[header];
      });

      // Validate required fields
      if (!normalizedRow.service_center_id || String(normalizedRow.service_center_id).trim() === '') {
        errors.push(`Row ${index + 2}: service_center_id is required`);
        return;
      }

      if (!normalizedRow.service_center_name || String(normalizedRow.service_center_name).trim() === '') {
        errors.push(`Row ${index + 2}: service_center_name is required`);
        return;
      }

      // Transform to ServiceCenterRow
      const serviceCenterRow: ServiceCenterRow = {
        service_center_id: String(normalizedRow.service_center_id || '').trim(),
        service_center_name: String(normalizedRow.service_center_name || '').trim(),
        service_center_type: normalizedRow.service_center_type ? String(normalizedRow.service_center_type).trim() : undefined,
        parent_partner: normalizedRow.parent_partner ? String(normalizedRow.parent_partner).trim() : undefined,
        address: normalizedRow.address ? String(normalizedRow.address).trim() : undefined,
        city: normalizedRow.city ? String(normalizedRow.city).trim() : undefined,
        state: normalizedRow.state ? String(normalizedRow.state).trim() : undefined,
        pincode: normalizedRow.pincode ? String(normalizedRow.pincode).trim() : undefined,
        supported_brands: normalizedRow.supported_brands ? String(normalizedRow.supported_brands).trim() : undefined,
        supported_categories: normalizedRow.supported_categories ? String(normalizedRow.supported_categories).trim() : undefined,
        warranty_supported: normalizeBoolean(normalizedRow.warranty_supported),
        amc_supported: normalizeBoolean(normalizedRow.amc_supported),
        rating: parseNumber(normalizedRow.rating),
        contact_number: normalizedRow.contact_number ? String(normalizedRow.contact_number).trim() : undefined,
        opening_hours: normalizedRow.opening_hours ? String(normalizedRow.opening_hours).trim() : undefined,
        latitude: parseNumber(normalizedRow.latitude),
        longitude: parseNumber(normalizedRow.longitude),
        last_verified_at: normalizeDate(normalizedRow.last_verified_at),
        active_status: normalizedRow.active_status !== undefined ? normalizeBoolean(normalizedRow.active_status) : true,
      };

      parsedRows.push(serviceCenterRow);
    });

    return {
      success: errors.length === 0,
      data: parsedRows,
      errors,
      warnings,
      rowCount: parsedRows.length,
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      errors: [`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`],
      warnings: [],
      rowCount: 0,
    };
  }
}

export async function parseServiceCenterCSVFile(file: File): Promise<ServiceCenterParseResult> {
  try {
    const text = await fileToText(file);
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      return {
        success: false,
        data: [],
        errors: ['CSV file must have at least a header row and one data row'],
        warnings: [],
        rowCount: 0,
      };
    }

    // Parse headers
    const headers = lines[0].split(',').map(h => h.trim());
    const normalizedHeaders = headers.map(h => h.toLowerCase().replace(/\s+/g, '_'));

    // Validate columns
    const columnValidation = validateColumns(headers);
    if (!columnValidation.valid) {
      return {
        success: false,
        data: [],
        errors: columnValidation.errors,
        warnings: columnValidation.warnings,
        rowCount: 0,
      };
    }

    // Parse rows
    const parsedRows: ServiceCenterRow[] = [];
    const errors: string[] = [];
    const warnings: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const normalizedRow: any = {};
      
      headers.forEach((header, index) => {
        const normalizedKey = normalizedHeaders[index];
        normalizedRow[normalizedKey] = values[index] || '';
      });

      // Validate required fields
      if (!normalizedRow.service_center_id || String(normalizedRow.service_center_id).trim() === '') {
        errors.push(`Row ${i + 1}: service_center_id is required`);
        continue;
      }

      if (!normalizedRow.service_center_name || String(normalizedRow.service_center_name).trim() === '') {
        errors.push(`Row ${i + 1}: service_center_name is required`);
        continue;
      }

      // Transform to ServiceCenterRow
      const serviceCenterRow: ServiceCenterRow = {
        service_center_id: String(normalizedRow.service_center_id || '').trim(),
        service_center_name: String(normalizedRow.service_center_name || '').trim(),
        service_center_type: normalizedRow.service_center_type ? String(normalizedRow.service_center_type).trim() : undefined,
        parent_partner: normalizedRow.parent_partner ? String(normalizedRow.parent_partner).trim() : undefined,
        address: normalizedRow.address ? String(normalizedRow.address).trim() : undefined,
        city: normalizedRow.city ? String(normalizedRow.city).trim() : undefined,
        state: normalizedRow.state ? String(normalizedRow.state).trim() : undefined,
        pincode: normalizedRow.pincode ? String(normalizedRow.pincode).trim() : undefined,
        supported_brands: normalizedRow.supported_brands ? String(normalizedRow.supported_brands).trim() : undefined,
        supported_categories: normalizedRow.supported_categories ? String(normalizedRow.supported_categories).trim() : undefined,
        warranty_supported: normalizeBoolean(normalizedRow.warranty_supported),
        amc_supported: normalizeBoolean(normalizedRow.amc_supported),
        rating: parseNumber(normalizedRow.rating),
        contact_number: normalizedRow.contact_number ? String(normalizedRow.contact_number).trim() : undefined,
        opening_hours: normalizedRow.opening_hours ? String(normalizedRow.opening_hours).trim() : undefined,
        latitude: parseNumber(normalizedRow.latitude),
        longitude: parseNumber(normalizedRow.longitude),
        last_verified_at: normalizeDate(normalizedRow.last_verified_at),
        active_status: normalizedRow.active_status !== undefined ? normalizeBoolean(normalizedRow.active_status) : true,
      };

      parsedRows.push(serviceCenterRow);
    }

    return {
      success: errors.length === 0,
      data: parsedRows,
      errors,
      warnings,
      rowCount: parsedRows.length,
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      errors: [`Failed to parse CSV file: ${error instanceof Error ? error.message : 'Unknown error'}`],
      warnings: [],
      rowCount: 0,
    };
  }
}
