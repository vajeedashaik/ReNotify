'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AdminUser } from '../types';
import { useRouter } from 'next/navigation';

interface AdminAuthContextType {
  user: AdminUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
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
          // Verify user is admin
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (profile?.role === 'ADMIN') {
            setUser({
              email: session.user.email || '',
              role: 'ADMIN',
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
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (profile?.role === 'ADMIN') {
            setUser({
              email: session.user.email || '',
              role: 'ADMIN',
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

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Login failed:', errorData.error);
        return false;
      }

      const data = await response.json();
      
      if (data.success) {
        // Set session in Supabase client if available and not mock
        if (supabase && data.session && data.session.access_token !== 'mock-token') {
          try {
            await supabase.auth.setSession({
              access_token: data.session.access_token,
              refresh_token: data.session.refresh_token,
            });
          } catch (sessionError) {
            console.warn('Failed to set Supabase session (may be using mock auth):', sessionError);
          }
        }

        setUser({
          email: data.user.email,
          role: 'ADMIN',
        });

        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    router.push('/');
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading,
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
