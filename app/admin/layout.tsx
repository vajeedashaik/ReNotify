'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import AdminTopBar from '@/components/layout/AdminTopBar';
import AdminSidebar from '@/components/layout/AdminSidebar';
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
      <AdminSidebar />
      <div className="lg:ml-64 min-h-screen flex flex-col">
        <AdminTopBar />
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 lg:pb-8 lg:pt-8">
          {children}
        </main>
      </div>
    </AdminRoute>
  );
}
