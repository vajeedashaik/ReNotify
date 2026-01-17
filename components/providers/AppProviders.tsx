'use client';

import React from 'react';
import { DatasetProvider } from '@/lib/contexts/DatasetProvider';
import { AdminAuthProvider } from '@/lib/contexts/AdminAuthProvider';
import { CustomerAuthProvider } from '@/lib/contexts/CustomerAuthProvider';
import { ThemeProvider } from './ThemeProvider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <DatasetProvider>
        <AdminAuthProvider>
          <CustomerAuthProvider>
            {children}
          </CustomerAuthProvider>
        </AdminAuthProvider>
      </DatasetProvider>
    </ThemeProvider>
  );
}
