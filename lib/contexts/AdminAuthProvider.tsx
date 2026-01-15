'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types';

interface AdminAuthContextType {
  user: AdminUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Mock admin credentials (in production, this would be handled by backend)
const MOCK_ADMIN_EMAIL = 'admin@renotify.com';
const MOCK_ADMIN_PASSWORD = 'admin123';

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);

  // Check for stored session on mount
  useEffect(() => {
    const stored = localStorage.getItem('admin_auth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } catch (e) {
        localStorage.removeItem('admin_auth');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in production, this would call an API
    if (email === MOCK_ADMIN_EMAIL && password === MOCK_ADMIN_PASSWORD) {
      const adminUser: AdminUser = {
        email,
        role: 'ADMIN',
      };
      setUser(adminUser);
      localStorage.setItem('admin_auth', JSON.stringify(adminUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('admin_auth');
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
