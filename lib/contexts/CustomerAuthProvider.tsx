'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CustomerUser } from '../types';
import { datasetStore } from '../data/datasetStore';

interface CustomerAuthContextType {
  user: CustomerUser | null;
  login: (mobile: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CustomerUser | null>(null);

  // Check for stored session on mount
  useEffect(() => {
    const stored = localStorage.getItem('customer_auth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } catch (e) {
        localStorage.removeItem('customer_auth');
      }
    }
  }, []);

  const login = async (mobile: string): Promise<{ success: boolean; error?: string }> => {
    const normalizedMobile = mobile.trim();
    
    // Check if dataset is initialized
    if (!datasetStore.isInitialized()) {
      return { success: false, error: 'No dataset loaded. Please contact administrator.' };
    }

    // Find customer by mobile
    const customer = datasetStore.getCustomerByMobile(normalizedMobile);
    
    if (!customer) {
      return { success: false, error: 'Mobile number not found in our records.' };
    }

    // Check consent flag
    if (!customer.consent_flag) {
      return { success: false, error: 'You have not provided consent for notifications. Please contact administrator.' };
    }

    const customerUser: CustomerUser = {
      mobile: normalizedMobile,
      role: 'CUSTOMER',
    };
    
    setUser(customerUser);
    localStorage.setItem('customer_auth', JSON.stringify(customerUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('customer_auth');
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (context === undefined) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
}
