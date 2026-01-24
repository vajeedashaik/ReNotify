'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, User, ArrowRight } from 'lucide-react';
import ActionButton from '@/components/ui/ActionButton';
import Logo from '@/components/ui/Logo';
import LandingBackground from '@/components/landing/LandingBackground';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <LandingBackground />
      <div className="relative z-10 max-w-4xl w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Logo width={200} height={50} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-sm">
            Welcome to <span className="bg-gradient-to-r from-primary-200 to-accent-200 bg-clip-text text-transparent">ReNotify</span>
          </h1>
          <p className="text-xl text-primary-100/90 mb-8">
            Manage warranties, AMCs, and service reminders with ease
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Admin Card */}
          <div className="card card-hover bg-white/95 backdrop-blur-md border-white/20 shadow-xl">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-primary-100 rounded-lg">
                <Shield className="text-primary-600" size={32} />
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
              <ActionButton variant="primary" fullWidth icon={ArrowRight}>
                Admin Login
              </ActionButton>
            </Link>
          </div>

          {/* Customer Card */}
          <div className="card card-hover bg-white/95 backdrop-blur-md border-white/20 shadow-xl">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-accent-100 rounded-lg">
                <User className="text-accent-600" size={32} />
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
              <ActionButton variant="secondary" fullWidth icon={ArrowRight}>
                Customer Login
              </ActionButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
