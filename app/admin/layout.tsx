'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import AdminTopBar from '@/components/layout/AdminTopBar';
import AdminRoute from '@/components/auth/AdminRoute';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  const isSignupPage = pathname === '/admin/signup';
  const isPublicPage = isLoginPage || isSignupPage;

  if (isPublicPage) {
    return <>{children}</>;
  }

  return (
    <AdminRoute>
      <AdminTopBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </AdminRoute>
  );
}
