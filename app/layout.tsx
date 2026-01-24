import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/components/providers/AppProviders';
import Footer from '@/components/layout/Footer';

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} flex min-h-screen flex-col`}>
        <AppProviders>
          <div className="flex flex-1 flex-col">
            {children}
            <Footer />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
