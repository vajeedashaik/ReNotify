import React from 'react';
import DatasetUpload from '@/components/admin/DatasetUpload';

export default function AdminUploadPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Dataset</h1>
        <p className="text-gray-600">Upload Excel or CSV file to populate the system with customer and product data</p>
      </div>

      <DatasetUpload />
    </div>
  );
}
