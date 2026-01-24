'use client';

import React from 'react';
import { DatasetProvider } from '@/lib/contexts/DatasetProvider';
import { AdminAuthProvider } from '@/lib/contexts/AdminAuthProvider';
import { CustomerAuthProvider } from '@/lib/contexts/CustomerAuthProvider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <DatasetProvider>
      <AdminAuthProvider>
        <CustomerAuthProvider>
          {children}
        </CustomerAuthProvider>
      </AdminAuthProvider>
    </DatasetProvider>
  );
}
