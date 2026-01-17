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
    if (!supabase) {
      setLoading(false);
      return;
    }

    let mounted = true;

    const checkSession = async () => {
      try {
        console.log('🔍 Checking session on mount...');
        
        // Add timeout to prevent hanging
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session check timeout')), 5000)
        );
        
        let session, sessionError;
        try {
          const result = await Promise.race([sessionPromise, timeoutPromise]) as any;
          session = result?.data?.session;
          sessionError = result?.error;
        } catch (timeoutError) {
          console.warn('⏱️ Session check timed out, continuing...');
          if (mounted) setLoading(false);
          return;
        }
        
        if (sessionError) {
          console.warn('Session error:', sessionError.message);
        }
        
        if (session?.user && mounted) {
          console.log('✅ Session found, verifying admin role...');
          
          // Verify user is admin with timeout
          const profilePromise = supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          
          const profileTimeout = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Profile check timeout')), 5000)
          );
          
          let profile, profileError;
          try {
            const result = await Promise.race([profilePromise, profileTimeout]) as any;
            profile = result?.data;
            profileError = result?.error;
          } catch (timeoutError) {
            console.warn('⏱️ Profile check timed out');
            if (mounted) setLoading(false);
            return;
          }

          if (profileError) {
            console.warn('Error fetching profile:', profileError.message);
            if (mounted) setLoading(false);
            return;
          }

          if (profile?.role === 'ADMIN' && mounted) {
            console.log('✅ Admin user confirmed, setting user state');
            setUser({
              email: session.user.email || '',
              role: 'ADMIN',
            });
          } else if (mounted) {
            console.warn('User is not admin, but session exists');
          }
        } else if (mounted) {
          console.log('ℹ️ No session found on mount');
        }
      } catch (error) {
        console.error('Error checking session:', error);
        // Don't clear user state on error - might be temporary network issue
      } finally {
        if (mounted) {
          console.log('🏁 Session check completed');
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
      console.log('🔔 Auth state changed:', event, session?.user?.email || 'No user');
      
      try {
        if (event === 'SIGNED_OUT' || !session) {
          console.log('👋 User signed out');
          setUser(null);
          return;
        }

        if (event === 'TOKEN_REFRESHED') {
          console.log('🔄 Token refreshed');
          // Don't clear user on token refresh - session is still valid
          return;
        }

        if (session.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (profile?.role === 'ADMIN') {
            console.log('✅ Admin user confirmed via auth state change');
            setUser({
              email: session.user.email || '',
              role: 'ADMIN',
            });
          } else {
            console.warn('❌ User is not admin, signing out');
            setUser(null);
            await supabase.auth.signOut();
          }
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        // Don't clear user on error - might be temporary
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
      if (!supabase) {
        console.error('Supabase client not initialized');
        return false;
      }

      console.log('Attempting to sign in user:', email);
      
      // Use API route for authentication (more reliable, runs on server)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout

      try {
        const response = await fetch('/api/auth/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
          credentials: 'include',
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Login API error:', errorData.error || `HTTP ${response.status}`);
          return false;
        }

        const data = await response.json();
        
        if (!data.success || !data.user) {
          console.error('Login failed:', data.error || 'Invalid response');
          return false;
        }

        console.log('Authentication successful via API, setting user state...');
        
        // Set user state immediately based on API response
        // The session will sync via middleware and auth state listener
        setUser({
          email: data.user.email || email,
          role: 'ADMIN',
        });
        
        console.log('Login successful, user state set');
        return true;
      } catch (error) {
        clearTimeout(timeoutId);
        
        if (error instanceof Error && error.name === 'AbortError') {
          console.error('Login request timed out after 20 seconds');
          console.error('This usually means:');
          console.error('1. Supabase project might be paused - check your Supabase dashboard');
          console.error('2. Network connectivity issues');
          console.error('3. Firewall blocking the connection');
          return false;
        }
        
        console.error('Login error:', error);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      if (supabase) {
        await supabase.auth.signOut();
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
