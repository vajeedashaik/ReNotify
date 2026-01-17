'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, User, Menu, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCustomerAuth } from '@/lib/contexts/CustomerAuthProvider';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function CustomerTopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useCustomerAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-700 shadow-soft dark:shadow-dark-soft"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/app" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 rounded-lg shadow-md group-hover:shadow-glow transition-shadow duration-300"
            >
              <Bell className="text-white" size={24} />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent">
              ReNotify
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/app"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname === '/app'
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/app/products"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname?.startsWith('/app/products')
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              My Products
            </Link>
            <Link
              href="/app/alerts"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname === '/app/alerts'
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              Alerts
            </Link>
            <Link
              href="/app/profile"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname === '/app/profile'
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              Profile
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            {user && (
              <span className="hidden md:block text-sm text-gray-600 dark:text-gray-400">
                {user.mobile}
              </span>
            )}
            <ThemeToggle />
            <motion.button
              onClick={handleLogout}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="Logout"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut size={20} />
            </motion.button>
            <motion.button
              className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              <Menu size={20} />
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden py-4 border-t border-gray-200 dark:border-slate-700 overflow-hidden"
            >
            <nav className="flex flex-col space-y-1">
              <Link
                href="/app"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === '/app'
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/app/products"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname?.startsWith('/app/products')
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                My Products
              </Link>
              <Link
                href="/app/alerts"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === '/app/alerts'
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Alerts
              </Link>
              <Link
                href="/app/profile"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === '/app/profile'
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile
              </Link>
            </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
