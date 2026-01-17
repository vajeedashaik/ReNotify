'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, Upload, Bell } from 'lucide-react';
import ActionButton from '../ui/ActionButton';

export default function QuickActions() {
  const router = useRouter();

  return (
    <div className="card mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ActionButton
          variant="primary"
          icon={UserPlus}
          fullWidth
          onClick={() => {
            // TODO: Implement add customer
            console.log('Add Customer');
          }}
        >
          Add Customer
        </ActionButton>
        <ActionButton
          variant="secondary"
          icon={Upload}
          fullWidth
          onClick={() => {
            // TODO: Implement upload invoice
            console.log('Upload Invoice');
          }}
        >
          Upload Invoice
        </ActionButton>
        <ActionButton
          variant="secondary"
          icon={Bell}
          fullWidth
          onClick={() => {
            router.push('/alerts');
          }}
        >
          View Reminders
        </ActionButton>
      </div>
    </div>
  );
}
