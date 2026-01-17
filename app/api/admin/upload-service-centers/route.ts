import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { parseServiceCenterExcelFile, parseServiceCenterCSVFile } from '@/lib/utils/serviceCenterParser';
import { ServiceCenterRow } from '@/lib/types';

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

    // Get user from session
    const { createClient } = await import('@/lib/supabase/server');
    const supabaseClient = await createClient();
    const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();

    if (sessionError || !session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized: Please log in to upload service center datasets' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Verify user is admin
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
      parseResult = await parseServiceCenterExcelFile(file);
    } else if (fileExtension === 'csv') {
      parseResult = await parseServiceCenterCSVFile(file);
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
    const filePath = `service-centers/${Date.now()}-${file.name}`;
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

    // Helper to parse array fields (can be string or undefined)
    const parseArrayField = (value: string | undefined): string[] | undefined => {
      if (!value) return undefined;
      const str = String(value).trim();
      if (str === '' || str.toLowerCase() === 'null' || str.toLowerCase() === 'n/a') return undefined;
      return str.split(',').map(item => item.trim()).filter(item => item.length > 0);
    };

    // Transform and insert rows into service_centers
    const rowsToInsert = parseResult.data.map((row: ServiceCenterRow) => ({
      service_center_id: row.service_center_id.trim(),
      service_center_name: row.service_center_name.trim(),
      service_center_type: row.service_center_type || null,
      parent_partner: row.parent_partner || null,
      address: row.address || null,
      city: row.city || null,
      state: row.state || null,
      pincode: row.pincode || null,
      supported_brands: parseArrayField(row.supported_brands),
      supported_categories: parseArrayField(row.supported_categories),
      warranty_supported: row.warranty_supported ?? false,
      amc_supported: row.amc_supported ?? false,
      rating: row.rating ?? null,
      contact_number: row.contact_number || null,
      opening_hours: row.opening_hours || null,
      latitude: row.latitude ?? null,
      longitude: row.longitude ?? null,
      last_verified_at: row.last_verified_at || null,
      active_status: row.active_status ?? true,
    }));

    // Delete all existing service centers first (optional - comment out if you want to append)
    const { error: deleteError } = await supabase
      .from('service_centers')
      .delete()
      .neq('service_center_id', ''); // Delete all (this will work even with no records)

    if (deleteError) {
      console.warn('Warning: Failed to delete existing service centers:', deleteError.message);
      // Continue anyway
    }

    // Insert in batches to avoid payload size limits
    const batchSize = 1000;
    let insertedCount = 0;

    for (let i = 0; i < rowsToInsert.length; i += batchSize) {
      const batch = rowsToInsert.slice(i, i + batchSize);
      const { error: insertError } = await supabase
        .from('service_centers')
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
      message: `Successfully uploaded ${insertedCount} service centers`,
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
