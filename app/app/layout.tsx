'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import CustomerTopBar from '@/components/layout/CustomerTopBar';
import CustomerRoute from '@/components/auth/CustomerRoute';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/app/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <CustomerRoute>
      <CustomerTopBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </CustomerRoute>
  );
}
