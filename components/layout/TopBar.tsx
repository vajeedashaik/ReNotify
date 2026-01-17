'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Settings, Menu } from 'lucide-react';
import ActionButton from '../ui/ActionButton';

export default function TopBar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg">
              <Bell className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              ReNotify
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/'
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/customers"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname?.startsWith('/customers')
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Customers
            </Link>
            <Link
              href="/invoices"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/invoices'
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Invoices
            </Link>
            <Link
              href="/alerts"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/alerts'
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Alerts
            </Link>
            <Link
              href="/settings"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/settings'
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Settings
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            <Link href="/settings">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings size={20} />
              </button>
            </Link>
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
                href="/"
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  pathname === '/'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/customers"
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  pathname?.startsWith('/customers')
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Customers
              </Link>
              <Link
                href="/invoices"
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  pathname === '/invoices'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Invoices
              </Link>
              <Link
                href="/alerts"
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  pathname === '/alerts'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Alerts
              </Link>
              <Link
                href="/settings"
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  pathname === '/settings'
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
