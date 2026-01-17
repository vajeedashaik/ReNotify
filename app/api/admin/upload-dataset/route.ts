import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { parseExcelFile, parseCSVFile } from '@/lib/utils/datasetParser';
import { DatasetRow } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Verify Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Supabase is not configured. Please set up your environment variables.' },
        { status: 500 }
      );
    }

    // Get user from session (using regular client to read cookies)
    const { createClient } = await import('@/lib/supabase/server');
    const supabaseClient = await createClient();
    const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();

    if (sessionError || !session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized: Please log in to upload datasets' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Verify user is admin in Supabase (using service role to bypass RLS)
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

    // IMPORTANT: Delete all existing products from this user's previous datasets
    // This ensures each upload replaces old data instead of adding to it
    const { data: existingDatasets } = await supabase
      .from('datasets')
      .select('id')
      .eq('uploaded_by', userId);

    if (existingDatasets && existingDatasets.length > 0) {
      const existingDatasetIds = existingDatasets.map(d => d.id);
      
      // Delete all customer_products from user's existing datasets
      const { error: deleteError } = await supabase
        .from('customer_products')
        .delete()
        .in('dataset_id', existingDatasetIds);

      if (deleteError) {
        console.warn('Warning: Failed to delete existing products:', deleteError.message);
        // Continue anyway - we'll still insert new data
      } else {
        console.log(`Deleted existing products from ${existingDatasetIds.length} previous dataset(s)`);
      }

      // Delete old dataset records (optional - keeps history if you want it)
      // Uncomment the following if you want to delete old dataset records too:
      // const { error: deleteDatasetsError } = await supabase
      //   .from('datasets')
      //   .delete()
      //   .in('id', existingDatasetIds);
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
    // Helper to ensure date strings are properly converted or null
    const normalizeDateForDB = (dateValue: string | null | undefined): string | null => {
      // Handle null, undefined, or empty values
      if (dateValue === null || dateValue === undefined) {
        return null;
      }
      
      // Convert to string and trim
      const str = String(dateValue).trim();
      
      // Check for empty strings or common null representations
      if (str === '' || 
          str.toLowerCase() === 'null' || 
          str.toLowerCase() === 'n/a' || 
          str.toLowerCase() === 'na' ||
          str === '-' ||
          str === 'NULL' ||
          str === 'N/A') {
        return null;
      }
      
      return str;
    };

    const rowsToInsert = parseResult.data.map((row: DatasetRow) => ({
      customer_mobile: row.customer_mobile.trim(),
      consent_flag: row.consent_flag,
      retailer_name: row.retailer_name,
      invoice_id: row.invoice_id,
      purchase_date: normalizeDateForDB(row.purchase_date),
      product_category: row.product_category,
      product_name: row.product_name,
      brand: row.brand,
      model_number: row.model_number,
      serial_number: row.serial_number,
      warranty_start: normalizeDateForDB(row.warranty_start),
      warranty_end: normalizeDateForDB(row.warranty_end),
      warranty_type: row.warranty_type,
      amc_active: row.amc_active,
      amc_end_date: normalizeDateForDB(row.amc_end_date),
      next_service_due: normalizeDateForDB(row.next_service_due),
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
