'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useCustomerAuth } from '@/lib/contexts/CustomerAuthProvider';

export default function CustomerRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useCustomerAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated && pathname !== '/app/login') {
      router.push('/app/login');
    }
  }, [isAuthenticated, router, pathname]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
