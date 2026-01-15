'use client';

import React from 'react';
import { Phone, MapPin, Shield } from 'lucide-react';
import { useCustomerAuth } from '@/lib/contexts/CustomerAuthProvider';
import { useDataset } from '@/lib/contexts/DatasetProvider';
import StatusBadge from '@/components/ui/StatusBadge';

export default function CustomerProfilePage() {
  const { user } = useCustomerAuth();
  const { customers } = useDataset();

  const customer = user ? customers.find(c => c.customer_mobile === user.mobile) : null;

  if (!customer) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500">No profile information found.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">Your account information (read-only)</p>
      </div>

      <div className="card">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
            <div className="flex items-center space-x-2">
              <Phone size={20} className="text-gray-400" />
              <span className="text-lg font-semibold text-gray-900">{customer.customer_mobile}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Consent Status</label>
            <StatusBadge status={customer.consent_flag ? 'yes' : 'no'} />
            <p className="text-xs text-gray-500 mt-2">
              {customer.consent_flag 
                ? 'You have consented to receive notifications' 
                : 'You have not consented to receive notifications'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <div className="flex items-center space-x-2">
              <MapPin size={20} className="text-gray-400" />
              <span className="text-gray-900">{customer.city}, {customer.pincode}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Total Products</label>
            <span className="text-lg font-semibold text-gray-900">{customer.products.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
