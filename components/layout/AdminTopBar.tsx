'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, Settings, Menu, LogOut, Upload } from 'lucide-react';
import { useAdminAuth } from '@/lib/contexts/AdminAuthProvider';

export default function AdminTopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAdminAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/admin" className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg">
              <Bell className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              ReNotify Admin
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/admin"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/admin'
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/upload"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/admin/upload'
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Upload Dataset
            </Link>
            <Link
              href="/admin/customers"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname?.startsWith('/admin/customers')
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Customers
            </Link>
            <Link
              href="/admin/products"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/admin/products'
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Products
            </Link>
            <Link
              href="/admin/invoices"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/admin/invoices'
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Invoices
            </Link>
            <Link
              href="/admin/alerts"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/admin/alerts'
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Alerts
            </Link>
            <Link
              href="/admin/settings"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/admin/settings'
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Settings
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
            <button
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-1">
              <Link
                href="/admin"
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  pathname === '/admin'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/admin/upload"
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  pathname === '/admin/upload'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Upload Dataset
              </Link>
              <Link
                href="/admin/customers"
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  pathname?.startsWith('/admin/customers')
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Customers
              </Link>
              <Link
                href="/admin/products"
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  pathname === '/admin/products'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/admin/invoices"
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  pathname === '/admin/invoices'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Invoices
              </Link>
              <Link
                href="/admin/alerts"
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  pathname === '/admin/alerts'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Alerts
              </Link>
              <Link
                href="/admin/settings"
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  pathname === '/admin/settings'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Settings
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
