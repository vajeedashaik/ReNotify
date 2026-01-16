import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { parseExcelFile, parseCSVFile } from '@/lib/utils/datasetParser';
import { DatasetRow } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 401 }
      );
    }

    // Verify Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Supabase is not configured. Please set up your environment variables.' },
        { status: 500 }
      );
    }

    // Verify user is admin in Supabase
    const supabase = await createServiceRoleClient();

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (profileError || profile?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    // Parse file
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    let parseResult;

    if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      parseResult = await parseExcelFile(file);
    } else if (fileExtension === 'csv') {
      parseResult = await parseCSVFile(file);
    } else {
      return NextResponse.json(
        { error: 'Unsupported file format. Please upload Excel (.xlsx, .xls) or CSV (.csv) files.' },
        { status: 400 }
      );
    }

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Failed to parse file',
          errors: parseResult.errors,
          warnings: parseResult.warnings,
        },
        { status: 400 }
      );
    }

    // Upload file to Supabase Storage
    const filePath = `datasets/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('datasets')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: 'Failed to upload file to storage', details: uploadError.message },
        { status: 500 }
      );
    }

    // Create dataset record
    const { data: dataset, error: datasetError } = await supabase
      .from('datasets')
      .insert({
        uploaded_by: userId,
        file_name: file.name,
        row_count: parseResult.rowCount,
      })
      .select()
      .single();

    if (datasetError || !dataset) {
      return NextResponse.json(
        { error: 'Failed to create dataset record', details: datasetError?.message },
        { status: 500 }
      );
    }

    // Transform and insert rows into customer_products
    const rowsToInsert = parseResult.data.map((row: DatasetRow) => ({
      customer_mobile: row.customer_mobile.trim(),
      consent_flag: row.consent_flag,
      retailer_name: row.retailer_name,
      invoice_id: row.invoice_id,
      purchase_date: row.purchase_date || null,
      product_category: row.product_category,
      product_name: row.product_name,
      brand: row.brand,
      model_number: row.model_number,
      serial_number: row.serial_number,
      warranty_start: row.warranty_start || null,
      warranty_end: row.warranty_end,
      warranty_type: row.warranty_type,
      amc_active: row.amc_active,
      amc_end_date: row.amc_end_date || null,
      next_service_due: row.next_service_due || null,
      city: row.city,
      pincode: row.pincode,
      dataset_id: dataset.id,
    }));

    // Insert in batches to avoid payload size limits
    const batchSize = 1000;
    let insertedCount = 0;

    for (let i = 0; i < rowsToInsert.length; i += batchSize) {
      const batch = rowsToInsert.slice(i, i + batchSize);
      const { error: insertError } = await supabase
        .from('customer_products')
        .insert(batch);

      if (insertError) {
        return NextResponse.json(
          { error: 'Failed to insert data', details: insertError.message },
          { status: 500 }
        );
      }
      insertedCount += batch.length;
    }

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${insertedCount} records`,
      datasetId: dataset.id,
      rowCount: insertedCount,
      warnings: parseResult.warnings,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
