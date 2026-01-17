import * as XLSX from 'xlsx';
import { DatasetRow } from '../types';
import { validateDatasetColumns, validateDatasetRow, normalizeConsentFlag, normalizeAMCActive } from './datasetValidator';

export interface ParseResult {
  success: boolean;
  data: DatasetRow[];
  errors: string[];
  warnings: string[];
  rowCount: number;
}

// Helper function to normalize date values - converts empty/null/"Null" strings to null
function normalizeDate(value: any): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  
  const str = String(value).trim();
  
  // Check for empty strings or common null representations
  if (str === '' || str.toLowerCase() === 'null' || str.toLowerCase() === 'n/a' || str.toLowerCase() === 'na') {
    return null;
  }
  
  // Return the trimmed string if it's not empty/null
  return str;
}

// Helper function to convert File to ArrayBuffer (works in both browser and Node.js)
async function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  if (typeof FileReader !== 'undefined') {
    // Browser environment
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  } else {
    // Node.js environment (server-side)
    return file.arrayBuffer();
  }
}

// Helper function to convert File to text (works in both browser and Node.js)
async function fileToText(file: File): Promise<string> {
  if (typeof FileReader !== 'undefined') {
    // Browser environment
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  } else {
    // Node.js environment (server-side)
    return file.text();
  }
}

export async function parseExcelFile(file: File): Promise<ParseResult> {
  try {
    // Convert file to ArrayBuffer (works in both browser and server)
    const arrayBuffer = await fileToArrayBuffer(file);
    const data = new Uint8Array(arrayBuffer);
    
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });

    // Normalize headers
    const headers = Object.keys(jsonData[0] || {});
    const normalizedHeaders = headers.map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));

    // Validate columns
    const columnValidation = validateDatasetColumns(headers);
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
    const parsedRows: DatasetRow[] = [];
    const errors: string[] = [];
    const warnings: string[] = [];

    jsonData.forEach((row: any, index: number) => {
      // Create normalized row object
      const normalizedRow: any = {};
      headers.forEach((header, i) => {
        const normalizedKey = normalizedHeaders[i];
        normalizedRow[normalizedKey] = row[header];
      });

      // Validate row
      const rowValidation = validateDatasetRow(normalizedRow, index);
      if (!rowValidation.valid) {
        errors.push(...rowValidation.errors);
      }
      warnings.push(...rowValidation.warnings);

      // Transform to DatasetRow
      const datasetRow: DatasetRow = {
        customer_mobile: String(normalizedRow.customer_mobile || '').trim(),
        consent_flag: normalizeConsentFlag(normalizedRow.consent_flag),
        retailer_name: String(normalizedRow.retailer_name || '').trim(),
        invoice_id: String(normalizedRow.invoice_id || '').trim(),
        purchase_date: normalizeDate(normalizedRow.purchase_date),
        product_category: String(normalizedRow.product_category || '').trim(),
        product_name: String(normalizedRow.product_name || '').trim(),
        brand: String(normalizedRow.brand || '').trim(),
        model_number: String(normalizedRow.model_number || '').trim(),
        serial_number: String(normalizedRow.serial_number || '').trim(),
        warranty_start: normalizeDate(normalizedRow.warranty_start),
        warranty_end: normalizeDate(normalizedRow.warranty_end),
        warranty_type: String(normalizedRow.warranty_type || '').trim(),
        amc_active: normalizeAMCActive(normalizedRow.amc_active),
        amc_end_date: normalizeDate(normalizedRow.amc_end_date),
        next_service_due: normalizeDate(normalizedRow.next_service_due),
        city: String(normalizedRow.city || '').trim(),
        pincode: String(normalizedRow.pincode || '').trim(),
      };

      parsedRows.push(datasetRow);
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

export async function parseCSVFile(file: File): Promise<ParseResult> {
  try {
    // Convert file to text (works in both browser and server)
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
    const columnValidation = validateDatasetColumns(headers);
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
    const parsedRows: DatasetRow[] = [];
    const errors: string[] = [];
    const warnings: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const normalizedRow: any = {};
      
      headers.forEach((header, index) => {
        const normalizedKey = normalizedHeaders[index];
        normalizedRow[normalizedKey] = values[index] || '';
      });

      // Validate row
      const rowValidation = validateDatasetRow(normalizedRow, i - 1);
      if (!rowValidation.valid) {
        errors.push(...rowValidation.errors);
      }
      warnings.push(...rowValidation.warnings);

      // Transform to DatasetRow
      const datasetRow: DatasetRow = {
        customer_mobile: String(normalizedRow.customer_mobile || '').trim(),
        consent_flag: normalizeConsentFlag(normalizedRow.consent_flag),
        retailer_name: String(normalizedRow.retailer_name || '').trim(),
        invoice_id: String(normalizedRow.invoice_id || '').trim(),
        purchase_date: normalizeDate(normalizedRow.purchase_date),
        product_category: String(normalizedRow.product_category || '').trim(),
        product_name: String(normalizedRow.product_name || '').trim(),
        brand: String(normalizedRow.brand || '').trim(),
        model_number: String(normalizedRow.model_number || '').trim(),
        serial_number: String(normalizedRow.serial_number || '').trim(),
        warranty_start: normalizeDate(normalizedRow.warranty_start),
        warranty_end: normalizeDate(normalizedRow.warranty_end),
        warranty_type: String(normalizedRow.warranty_type || '').trim(),
        amc_active: normalizeAMCActive(normalizedRow.amc_active),
        amc_end_date: normalizeDate(normalizedRow.amc_end_date),
        next_service_due: normalizeDate(normalizedRow.next_service_due),
        city: String(normalizedRow.city || '').trim(),
        pincode: String(normalizedRow.pincode || '').trim(),
      };

      parsedRows.push(datasetRow);
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
