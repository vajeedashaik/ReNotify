import Link from 'next/link';
import Logo from '@/components/ui/Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo href="/" width={120} height={30} />
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-600">
            <Link
              href="/privacy"
              className="hover:text-primary-600 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-primary-600 transition-colors"
            >
              Terms of Service
            </Link>
          </nav>
        </div>
        <p className="mt-4 text-center sm:text-left text-xs text-gray-500">
          © {currentYear} ReNotify. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
