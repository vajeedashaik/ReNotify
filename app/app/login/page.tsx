'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Phone } from 'lucide-react';
import { useCustomerAuth } from '@/lib/contexts/CustomerAuthProvider';
import ActionButton from '@/components/ui/ActionButton';

export default function CustomerLoginPage() {
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useCustomerAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/app');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(mobile);
      if (result.success) {
        router.push('/app');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <div className="max-w-md w-full px-4">
        <div className="card">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg">
                <User className="text-white" size={32} />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Customer Login</h1>
            <p className="text-gray-600">Enter your mobile number to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            <ActionButton
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </ActionButton>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              Your mobile number must be registered in our system with consent enabled
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
