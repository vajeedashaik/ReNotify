'use client';
import Navbar from '@/components/landing/Navbar';
import HeroScrollAnimation from '@/components/landing/HeroScrollAnimation';
import FeatureScrollAnimation from '@/components/landing/FeatureScrollAnimation';
import CalendarScrollAnimation from '@/components/landing/CalendarScrollAnimation';
import AutomationScrollAnimation from '@/components/landing/AutomationScrollAnimation';
import SimplicityScrollAnimation from '@/components/landing/SimplicityScrollAnimation';
import CTASection from '@/components/landing/CTASection';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <HeroScrollAnimation />
      <FeatureScrollAnimation />
      <CalendarScrollAnimation />
      <AutomationScrollAnimation />
      <SimplicityScrollAnimation />
      <CTASection />
    </main>
  );


import { ArrowRight, Shield, User } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import SafeDithering from "@/components/landing/SafeDithering"

export default function LandingPage() {
  const [isHovered, setIsHovered] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    console.log('🏠 LandingPage: Component mounted');
    setMounted(true);
    
    // Log environment info for debugging
    if (typeof window !== 'undefined') {
      console.log('🌐 Browser Info:', {
        userAgent: navigator.userAgent,
        webglSupported: !!document.createElement('canvas').getContext('webgl'),
        windowSize: { width: window.innerWidth, height: window.innerHeight },
      });
    }
  }, [])

  return (
    <div className="min-h-screen w-full bg-white">
      <section className="py-12 w-full flex justify-center items-center px-4 md:px-6">
        <div 
          className="w-full max-w-7xl relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative overflow-hidden rounded-[48px] border border-blue-200/50 bg-gradient-to-br from-blue-50 to-white shadow-lg min-h-[600px] md:min-h-[600px] flex flex-col items-center justify-center duration-500">
            <div className="absolute inset-0 z-0 pointer-events-none opacity-30 mix-blend-multiply">
              {mounted ? (
                <SafeDithering
                  colorBack="#00000000" // Transparent
                  colorFront="#3b82f6"  // Blue accent (primary-500)
                  shape="warp"
                  type="4x4"
                  speed={isHovered ? 0.6 : 0.2}
                  className="size-full"
                  minPixelRatio={1}
                />
              ) : (
                <div className="absolute inset-0 bg-blue-50/20" />
              )}
            </div>

            <div className="relative z-10 px-6 max-w-4xl mx-auto text-center flex flex-col items-center">
              
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-4 py-1.5 text-sm font-medium text-blue-700 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
                Warranty & AMC Management
              </div>

              {/* Headline */}
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight text-gray-900 mb-8 leading-[1.05]">
                Manage warranties, <br />
                <span className="text-blue-600">delivered perfectly.</span>
              </h1>
              
              {/* Description */}
              <p className="text-gray-600 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
                Track your products, warranties, AMCs, and service reminders with ease. 
                Clean, precise, and uniquely yours.
              </p>

              {/* Get Started Button */}
              <Link href="#login-options" className="group relative inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded-full bg-blue-600 px-12 text-base font-medium text-white transition-all duration-300 hover:bg-blue-700 hover:scale-105 active:scale-95 hover:ring-4 hover:ring-blue-200">
                <span className="relative z-10">Get Started</span>
                <ArrowRight className="h-5 w-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Login Options Section */}
      <section id="login-options" className="py-12 w-full flex justify-center items-center px-4 md:px-6 -mt-8">
        <div className="w-full max-w-5xl">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Admin Card */}
            <div className="card card-hover bg-white/95 backdrop-blur-md border-blue-200/50 shadow-xl">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Shield className="text-blue-600" size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Admin / Retailer</h2>
                  <p className="text-sm text-gray-600">Manage datasets and customers</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Upload datasets, view all customer data, manage warranties, and track service reminders.
              </p>
              <Link href="/admin/login">
                <button className="group relative inline-flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-blue-600 px-6 text-base font-medium text-white transition-all duration-300 hover:bg-blue-700 hover:scale-105 active:scale-95">
                  <span>Admin Login</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </Link>
            </div>

            {/* Customer Card */}
            <div className="card card-hover bg-white/95 backdrop-blur-md border-blue-200/50 shadow-xl">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <User className="text-blue-600" size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Customer</h2>
                  <p className="text-sm text-gray-600">View your products & warranties</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Access your purchase history, warranty status, AMC details, and service reminders.
              </p>
              <Link href="/app/login">
                <button className="group relative inline-flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-blue-600 px-6 text-base font-medium text-white transition-all duration-300 hover:bg-blue-700 hover:scale-105 active:scale-95">
                  <span>Customer Login</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
