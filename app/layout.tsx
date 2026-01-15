import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { DatasetProvider } from '@/lib/contexts/DatasetProvider';
import { AdminAuthProvider } from '@/lib/contexts/AdminAuthProvider';
import { CustomerAuthProvider } from '@/lib/contexts/CustomerAuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ReNotify V2 - Customer Purchase & Warranty Management',
  description: 'Manage customer purchases, warranties, and AMCs with automated reminders',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DatasetProvider>
          <AdminAuthProvider>
            <CustomerAuthProvider>
              {children}
            </CustomerAuthProvider>
          </AdminAuthProvider>
        </DatasetProvider>
      </body>
    </html>
  );
}
