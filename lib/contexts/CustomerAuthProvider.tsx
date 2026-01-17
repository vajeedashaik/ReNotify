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
      // Don't set loading to false here - let the session check handle it
    }
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let mounted = true;
    
    const checkSession = async () => {
      try {
        // Add timeout to prevent hanging
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Session check timeout')), 5000);
        });

        let session, sessionError;
        try {
          const result = await Promise.race([sessionPromise, timeoutPromise]) as any;
          session = result?.data?.session;
          sessionError = result?.error;
        } catch (timeoutError) {
          if (mounted) {
            console.warn('Session check timed out, continuing...');
            setLoading(false);
          }
          return;
        }
        
        if (sessionError) {
          console.warn('Session error:', sessionError.message);
        }
        
        if (session?.user && mounted) {
          // Get customer mobile from profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('customer_mobile, role')
            .eq('id', session.user.id)
            .single();

          if (profile?.role === 'CUSTOMER' && profile.customer_mobile && mounted) {
            setUser({
              mobile: profile.customer_mobile,
              role: 'CUSTOMER',
            });
          } else if (mounted) {
            await supabase.auth.signOut();
          }
        }
      } catch (error) {
        // Ignore abort errors (usually from React strict mode or navigation)
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Error checking session:', error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkSession();
    
    return () => {
      mounted = false;
    };

    // Listen for auth changes
    if (!supabase) return;
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (event === 'SIGNED_OUT' || !session) {
          if (mounted) {
            setUser(null);
          }
          return;
        }

        if (session.user && mounted) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('customer_mobile, role')
            .eq('id', session.user.id)
            .single();

          if (profile?.role === 'CUSTOMER' && profile.customer_mobile && mounted) {
            setUser({
              mobile: profile.customer_mobile,
              role: 'CUSTOMER',
            });
          } else if (mounted) {
            setUser(null);
            await supabase.auth.signOut();
          }
        }
      } catch (error) {
        // Ignore abort errors (usually from React strict mode or navigation)
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Error in auth state change:', error);
        }
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
      if (!supabase) {
        return { success: false, error: 'Supabase client not initialized' };
      }

      console.log('Customer login: Fetching credentials from API...');
      
      const response = await fetch('/api/auth/customer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return { success: false, error: data.error || 'Login failed' };
      }

      if (data.user && data.user.email && data.user.password) {
        console.log('Customer login: Signing in with Supabase...');
        
        // Sign in with Supabase using the credentials with timeout handling
        const signInPromise = supabase.auth.signInWithPassword({
          email: data.user.email,
          password: data.user.password,
        });

        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Sign in timeout')), 15000); // 15 second timeout
        });

        let authData, signInError;
        try {
          const result = await Promise.race([signInPromise, timeoutPromise]) as any;
          authData = result?.data;
          signInError = result?.error;
        } catch (raceError) {
          if (raceError instanceof Error && raceError.message === 'Sign in timeout') {
            console.error('Sign in timed out');
            return { success: false, error: 'Sign in timed out. Please try again.' };
          }
          // Re-throw other errors
          throw raceError;
        }

        if (signInError || !authData?.user) {
          console.error('Sign in error:', signInError);
          return { success: false, error: signInError?.message || 'Failed to sign in' };
        }

        console.log('Customer login: Signed in successfully, fetching profile...');

        // Verify profile exists and get customer mobile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('customer_mobile, role')
          .eq('id', authData.user.id)
          .single();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          // Still set user if we have the mobile from the API response
          if (data.user.mobile) {
            setUser({
              mobile: data.user.mobile,
              role: 'CUSTOMER',
            });
            return { success: true };
          }
          return { success: false, error: 'Failed to fetch profile' };
        }

        if (profile?.role === 'CUSTOMER' && (profile.customer_mobile || data.user.mobile)) {
          setUser({
            mobile: profile.customer_mobile || data.user.mobile,
            role: 'CUSTOMER',
          });
          console.log('Customer login: Successfully logged in');
          return { success: true };
        } else {
          await supabase.auth.signOut();
          return { success: false, error: 'Invalid customer profile' };
        }
      }

      return { success: false, error: 'Login failed - invalid response' };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn('Login was aborted (likely React strict mode or navigation)');
        // Don't show error to user if it's just an abort (component unmounted)
        return { success: false, error: 'Login was interrupted. Please try again.' };
      }
      console.error('Login error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Login failed. Please try again.' };
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
