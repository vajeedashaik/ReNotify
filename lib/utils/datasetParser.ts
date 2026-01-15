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

export async function parseExcelFile(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
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
          resolve({
            success: false,
            data: [],
            errors: columnValidation.errors,
            warnings: columnValidation.warnings,
            rowCount: 0,
          });
          return;
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
            purchase_date: String(normalizedRow.purchase_date || '').trim(),
            product_category: String(normalizedRow.product_category || '').trim(),
            product_name: String(normalizedRow.product_name || '').trim(),
            brand: String(normalizedRow.brand || '').trim(),
            model_number: String(normalizedRow.model_number || '').trim(),
            serial_number: String(normalizedRow.serial_number || '').trim(),
            warranty_start: String(normalizedRow.warranty_start || '').trim(),
            warranty_end: String(normalizedRow.warranty_end || '').trim(),
            warranty_type: String(normalizedRow.warranty_type || '').trim(),
            amc_active: normalizeAMCActive(normalizedRow.amc_active),
            amc_end_date: normalizedRow.amc_end_date ? String(normalizedRow.amc_end_date).trim() : null,
            next_service_due: String(normalizedRow.next_service_due || '').trim(),
            city: String(normalizedRow.city || '').trim(),
            pincode: String(normalizedRow.pincode || '').trim(),
          };

          parsedRows.push(datasetRow);
        });

        resolve({
          success: errors.length === 0,
          data: parsedRows,
          errors,
          warnings,
          rowCount: parsedRows.length,
        });
      } catch (error) {
        resolve({
          success: false,
          data: [],
          errors: [`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`],
          warnings: [],
          rowCount: 0,
        });
      }
    };

    reader.onerror = () => {
      resolve({
        success: false,
        data: [],
        errors: ['Failed to read file'],
        warnings: [],
        rowCount: 0,
      });
    };

    reader.readAsArrayBuffer(file);
  });
}

export async function parseCSVFile(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          resolve({
            success: false,
            data: [],
            errors: ['CSV file must have at least a header row and one data row'],
            warnings: [],
            rowCount: 0,
          });
          return;
        }

        // Parse headers
        const headers = lines[0].split(',').map(h => h.trim());
        const normalizedHeaders = headers.map(h => h.toLowerCase().replace(/\s+/g, '_'));

        // Validate columns
        const columnValidation = validateDatasetColumns(headers);
        if (!columnValidation.valid) {
          resolve({
            success: false,
            data: [],
            errors: columnValidation.errors,
            warnings: columnValidation.warnings,
            rowCount: 0,
          });
          return;
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
            purchase_date: String(normalizedRow.purchase_date || '').trim(),
            product_category: String(normalizedRow.product_category || '').trim(),
            product_name: String(normalizedRow.product_name || '').trim(),
            brand: String(normalizedRow.brand || '').trim(),
            model_number: String(normalizedRow.model_number || '').trim(),
            serial_number: String(normalizedRow.serial_number || '').trim(),
            warranty_start: String(normalizedRow.warranty_start || '').trim(),
            warranty_end: String(normalizedRow.warranty_end || '').trim(),
            warranty_type: String(normalizedRow.warranty_type || '').trim(),
            amc_active: normalizeAMCActive(normalizedRow.amc_active),
            amc_end_date: normalizedRow.amc_end_date ? String(normalizedRow.amc_end_date).trim() : null,
            next_service_due: String(normalizedRow.next_service_due || '').trim(),
            city: String(normalizedRow.city || '').trim(),
            pincode: String(normalizedRow.pincode || '').trim(),
          };

          parsedRows.push(datasetRow);
        }

        resolve({
          success: errors.length === 0,
          data: parsedRows,
          errors,
          warnings,
          rowCount: parsedRows.length,
        });
      } catch (error) {
        resolve({
          success: false,
          data: [],
          errors: [`Failed to parse CSV file: ${error instanceof Error ? error.message : 'Unknown error'}`],
          warnings: [],
          rowCount: 0,
        });
      }
    };

    reader.onerror = () => {
      resolve({
        success: false,
        data: [],
        errors: ['Failed to read file'],
        warnings: [],
        rowCount: 0,
      });
    };

    reader.readAsText(file);
  });
}
