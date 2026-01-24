'use client';

import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  href?: string;
  className?: string;
  width?: number;
  height?: number;
  /** Show "Admin" suffix (e.g. in sidebar) */
  showAdminLabel?: boolean;
}

export default function Logo({
  href,
  className = '',
  width = 160,
  height = 40,
  showAdminLabel = false,
}: LogoProps) {
  const img = (
    <Image
      src="/logo.png"
      alt="ReNotify"
      width={width}
      height={height}
      className={`object-contain ${className}`}
      priority
    />
  );

  const content = showAdminLabel ? (
    <span className="flex items-center gap-2">
      {img}
      <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent whitespace-nowrap">
        Admin
      </span>
    </span>
  ) : (
    img
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center">
        {content}
      </Link>
    );
  }
  return <span className="inline-flex items-center">{content}</span>;
}
