'use client';

import React, { useEffect } from 'react';
import { DatasetProvider } from '@/lib/contexts/DatasetProvider';
import { AdminAuthProvider } from '@/lib/contexts/AdminAuthProvider';
import { CustomerAuthProvider } from '@/lib/contexts/CustomerAuthProvider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    console.log('🔧 AppProviders: Initializing providers...');
    
    // Global error handlers
    const handleError = (event: ErrorEvent) => {
      console.error('🚨 Global Error:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
        timestamp: new Date().toISOString(),
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('🚨 Unhandled Promise Rejection:', {
        reason: event.reason,
        promise: event.promise,
        timestamp: new Date().toISOString(),
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    console.log('✅ AppProviders: Global error handlers registered');

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  try {
    return (
      <DatasetProvider>
        <AdminAuthProvider>
          <CustomerAuthProvider>
            {children}
          </CustomerAuthProvider>
        </AdminAuthProvider>
      </DatasetProvider>
    );
  } catch (error) {
    console.error('🚨 AppProviders: Error initializing providers:', error);
    // Return children without providers if initialization fails
    return <>{children}</>;
  }
}
