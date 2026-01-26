'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAdminAuth } from '@/lib/contexts/AdminAuthProvider';
import Logo from '@/components/ui/Logo';

export default function AdminTopBar() {
  const router = useRouter();
  const { logout } = useAdminAuth();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <motion.header
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-soft"
    >
      <div className="flex items-center justify-between h-14 px-4 sm:px-6 lg:px-8">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Logo href="/admin" width={130} height={32} />
        </motion.div>

        <div className="flex items-center gap-2">
          <motion.button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-primary-600 rounded-lg transition-colors text-sm font-medium"
            title="Logout"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
