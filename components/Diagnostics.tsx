'use client';

import React, { useEffect } from 'react';

export function Diagnostics() {
  useEffect(() => {
    console.log('🔍 ===== DIAGNOSTICS START =====');
    console.log('📅 Timestamp:', new Date().toISOString());
    
    // Environment checks
    if (typeof window !== 'undefined') {
      console.log('🌐 Browser Environment:', {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
      });

      // WebGL support
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        console.log('🎨 WebGL Support:', {
          supported: !!gl,
          version: gl ? gl.getParameter(gl.VERSION) : 'N/A',
          vendor: gl ? gl.getParameter(gl.VENDOR) : 'N/A',
        });
      } catch (error) {
        console.error('❌ WebGL check failed:', error);
      }

      // Screen info
      console.log('📱 Screen Info:', {
        width: window.innerWidth,
        height: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio,
        colorDepth: screen.colorDepth,
      });

      // Check for required environment variables (client-side only)
      const envVars = {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
      };
      console.log('🔐 Environment Variables:', envVars);

      // Check for common issues
      const issues: string[] = [];
      
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        issues.push('NEXT_PUBLIC_SUPABASE_URL is not set');
      }
      if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        issues.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set');
      }
      
      if (issues.length > 0) {
        console.warn('⚠️ Potential Issues Found:', issues);
      } else {
        console.log('✅ No obvious configuration issues detected');
      }
    }

    // Check React version
    console.log('⚛️ React Version:', React.version || 'Unknown');

    // Performance timing
    if (typeof window !== 'undefined' && window.performance) {
      const perfData = window.performance.timing;
      const loadTime = perfData.loadEventEnd - perfData.navigationStart;
      console.log('⏱️ Page Load Time:', `${loadTime}ms`);
    }

    console.log('🔍 ===== DIAGNOSTICS END =====');
  }, []);

  return null; // This component doesn't render anything
}
