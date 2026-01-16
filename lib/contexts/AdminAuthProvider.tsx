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
      // Don't set loading to false here - let the session check handle it
      // This allows the app to show a proper error message
    }
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        if (!supabase) {
          setLoading(false);
          return;
        }

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
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Login failed:', errorData.error || `HTTP ${response.status}`);
        return false;
      }

      const data = await response.json();
      console.log('Login response received:', { 
        success: data.success, 
        successType: typeof data.success,
        hasSession: !!data.session, 
        hasUser: !!data.user,
        userEmail: data.user?.email,
        userRole: data.user?.role,
        responseStatus: response.status,
        fullData: JSON.stringify(data).substring(0, 200) // First 200 chars
      });
      
      // Check if login was successful - be more lenient with the check
      const hasSuccessFlag = data.success === true || data.success === 'true' || data.success === 1;
      const hasUserObject = data.user && typeof data.user === 'object';
      const isSuccess = hasSuccessFlag && hasUserObject;
      
      console.log('Login check:', { hasSuccessFlag, hasUserObject, isSuccess });
      
      if (isSuccess) {
        console.log('Login successful, processing...', { user: data.user });
        
        // Set session in Supabase client
        if (supabase && data.session) {
          try {
            const sessionResult = await supabase.auth.setSession({
              access_token: data.session.access_token,
              refresh_token: data.session.refresh_token,
            });
            console.log('Session set result:', { 
              hasSession: !!sessionResult.data?.session, 
              error: sessionResult.error?.message 
            });
          } catch (sessionError) {
            console.error('Failed to set Supabase session:', sessionError);
            // Continue anyway - session might already be valid
          }
        } else {
          console.warn('No supabase client or session data available');
        }

        // Set user state - this is critical for authentication
        const userData = {
          email: data.user.email || email, // Fallback to email from input
          role: (data.user.role || 'ADMIN') as const,
        };
        
        console.log('Setting user state:', userData);
        setUser(userData);
        
        console.log('Login function returning TRUE');
        return true;
      }

      console.error('Login failed - conditions not met:', {
        hasSuccess: data.success,
        successType: typeof data.success,
        hasUser: !!data.user,
        userData: data.user,
        dataKeys: Object.keys(data || {}),
        fullResponse: data
      });
      return false;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('Login request timed out');
      } else {
        console.error('Login error:', error);
      }
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
