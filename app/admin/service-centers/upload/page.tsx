import React from 'react';
import ServiceCenterUpload from '@/components/admin/ServiceCenterUpload';

export default function AdminServiceCenterUploadPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Service Centers</h1>
        <p className="text-gray-600">Upload Excel or CSV file to populate the system with service center data</p>
      </div>

      <ServiceCenterUpload />
    </div>
  );
}
