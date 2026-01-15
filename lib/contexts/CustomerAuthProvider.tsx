'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CustomerUser } from '../types';
import { useRouter } from 'next/navigation';

interface CustomerAuthContextType {
  user: CustomerUser | null;
  login: (mobile: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  // Create supabase client inside useEffect to avoid SSR issues
  const [supabase, setSupabase] = useState<any>(null);
  
  useEffect(() => {
    try {
      setSupabase(createClient());
    } catch (error) {
      console.error('Failed to create Supabase client:', error);
      setLoading(false);
    }
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    if (!supabase) return;
    
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Get customer mobile from profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('customer_mobile, role')
            .eq('id', session.user.id)
            .single();

          if (profile?.role === 'CUSTOMER' && profile.customer_mobile) {
            setUser({
              mobile: profile.customer_mobile,
              role: 'CUSTOMER',
            });
          } else {
            await supabase.auth.signOut();
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    if (!supabase) return;
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (event === 'SIGNED_OUT' || !session) {
          setUser(null);
          return;
        }

        if (session.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('customer_mobile, role')
            .eq('id', session.user.id)
            .single();

          if (profile?.role === 'CUSTOMER' && profile.customer_mobile) {
            setUser({
              mobile: profile.customer_mobile,
              role: 'CUSTOMER',
            });
          } else {
            setUser(null);
            await supabase.auth.signOut();
          }
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
      }
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [supabase]);

  const login = async (mobile: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/customer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return { success: false, error: data.error || 'Login failed' };
      }

      // For customer login, we need to create/get a session
      // Since we're using mobile-based auth, we'll store the user ID in localStorage
      // and use it for API calls (RLS will handle security)
      if (data.user) {
        setUser({
          mobile: data.user.mobile,
          role: 'CUSTOMER',
        });

        // Store user ID for API calls
        localStorage.setItem('customer_user_id', data.user.id);
        localStorage.setItem('customer_mobile', data.user.mobile);

        return { success: true };
      }

      return { success: false, error: 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('customer_user_id');
    localStorage.removeItem('customer_mobile');
    setUser(null);
    router.push('/');
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading,
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
