'use client';

import React, { useState, useEffect } from 'react';
import { Upload, File, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '@/lib/contexts/AdminAuthProvider';
import ActionButton from '../ui/ActionButton';
import { createClient } from '@/lib/supabase/client';

export default function DatasetUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    errors?: string[];
    warnings?: string[];
    rowCount?: number;
  } | null>(null);
  const { user } = useAdminAuth();
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    try {
      setSupabase(createClient());
    } catch (error) {
      console.error('Failed to create Supabase client:', error);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file || !user) {
      setResult({
        success: false,
        message: 'You must be logged in to upload datasets.',
      });
      return;
    }

    setUploading(true);
    setResult(null);

    try {
      // Check if Supabase is configured
      const hasSupabaseConfig = process.env.NEXT_PUBLIC_SUPABASE_URL && 
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      let userId: string;

      if (hasSupabaseConfig && supabase) {
        // Get current session to get user ID
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          setResult({
            success: false,
            message: 'You must be logged in to upload datasets.',
          });
          setUploading(false);
          return;
        }

        userId = session.user.id;
      } else {
        // Use mock user ID when Supabase not configured
        userId = 'mock-admin-user';
      }

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);

      // Upload to API
      const response = await fetch('/api/admin/upload-dataset', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // If Supabase is not configured, store data in datasetStore
        if (data.data && typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
          // Import and use datasetStore to store data
          const { datasetStore } = await import('@/lib/data/datasetStore');
          datasetStore.setDataset(data.data);
        }

        setResult({
          success: true,
          message: data.message || `Successfully uploaded ${data.rowCount} records!`,
          rowCount: data.rowCount,
          warnings: data.warnings?.length > 0 ? data.warnings : undefined,
        });
        setFile(null);
        // Reset file input
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        // Refresh data by reloading the page
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setResult({
          success: false,
          message: data.error || 'Failed to upload dataset',
          errors: data.errors,
          warnings: data.warnings,
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Dataset</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Excel or CSV File
          </label>
          <div className="flex items-center space-x-4">
            <label
              htmlFor="file-input"
              className="flex-1 cursor-pointer"
            >
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                {file ? (
                  <div className="flex items-center justify-center space-x-2">
                    <File className="text-primary-600" size={24} />
                    <span className="text-sm font-medium text-gray-900">{file.name}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-2">
                    <Upload className="text-gray-400" size={32} />
                    <span className="text-sm text-gray-600">
                      Click to select or drag and drop
                    </span>
                    <span className="text-xs text-gray-500">
                      Excel (.xlsx, .xls) or CSV (.csv)
                    </span>
                  </div>
                )}
              </div>
              <input
                id="file-input"
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {file && (
          <ActionButton
            variant="primary"
            icon={Upload}
            fullWidth
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload Dataset'}
          </ActionButton>
        )}

        {result && (
          <div
            className={`p-4 rounded-lg ${
              result.success
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            <div className="flex items-start space-x-3">
              {result.success ? (
                <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
              ) : (
                <XCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              )}
              <div className="flex-1">
                <p
                  className={`font-medium ${
                    result.success ? 'text-green-900' : 'text-red-900'
                  }`}
                >
                  {result.message}
                </p>
                {result.rowCount !== undefined && (
                  <p className="text-sm text-gray-600 mt-1">
                    {result.rowCount} records processed
                  </p>
                )}
                {result.errors && result.errors.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-red-900 mb-2">Errors:</p>
                    <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                      {result.errors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.warnings && result.warnings.length > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="text-yellow-600" size={16} />
                      <p className="text-sm font-medium text-yellow-900">Warnings:</p>
                    </div>
                    <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                      {result.warnings.map((warning, idx) => (
                        <li key={idx}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
