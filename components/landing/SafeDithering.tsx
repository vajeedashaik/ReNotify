'use client';

import React, { useState, useEffect, Component, ErrorInfo } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import shader component with SSR disabled and error handling
const Dithering = dynamic(
  () => import("@paper-design/shaders-react")
    .then((mod) => {
      console.log('✅ Dithering shader module loaded successfully');
      return mod.Dithering;
    })
    .catch((error) => {
      console.error('❌ Failed to load Dithering shader module:', error);
      // Return a fallback component
      return () => <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-blue-50/20" />;
    }),
  { 
    ssr: false,
    loading: () => {
      console.log('⏳ Loading Dithering shader...');
      return <div className="absolute inset-0 bg-blue-50/20" />;
    }
  }
);

interface SafeDitheringProps {
  colorBack?: string;
  colorFront?: string;
  shape?: string;
  type?: string;
  speed?: number;
  className?: string;
  minPixelRatio?: number;
}

// Error boundary for the Dithering component
class DitheringErrorBoundary extends Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('❌ DitheringErrorBoundary caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('❌ Dithering component error details:', {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      componentStack: errorInfo.componentStack,
    });
  }

  render() {
    if (this.state.hasError) {
      return <>{this.props.fallback}</>;
    }
    return this.props.children;
  }
}

export default function SafeDithering(props: SafeDitheringProps) {
  const [isClient, setIsClient] = useState(false);
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setIsClient(true);
    console.log('🎨 SafeDithering: Component mounted, checking WebGL support...');
    
    // Check if WebGL is supported
    if (typeof window !== 'undefined') {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) {
          console.warn('⚠️ WebGL is not supported in this browser');
          setWebglSupported(false);
          return;
        }
        
        console.log('✅ WebGL is supported');
        setWebglSupported(true);
      } catch (error) {
        console.error('❌ Error checking WebGL support:', error);
        setWebglSupported(false);
      }
    }
  }, []);

  if (!isClient) {
    console.log('⏳ SafeDithering: Waiting for client-side hydration...');
    return <div className="absolute inset-0 bg-blue-50/20" />;
  }

  // If WebGL is not supported, show fallback
  if (webglSupported === false) {
    console.warn('⚠️ SafeDithering: Rendering fallback - WebGL not supported');
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-blue-50/20 animate-pulse" />
    );
  }

  const fallback = (
    <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-blue-50/20 animate-pulse" />
  );

  return (
    <DitheringErrorBoundary fallback={fallback}>
      <div className="absolute inset-0">
        <Dithering {...props} />
      </div>
    </DitheringErrorBoundary>
  );
}
