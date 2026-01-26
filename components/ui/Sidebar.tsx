'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface SidebarItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
}

interface SidebarProps {
  items: SidebarItem[];
  className?: string;
}

export default function Sidebar({ items, className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn(
      "glass-light dark:glass-dark fixed left-0 top-0 h-full w-64 border-r border-white/20 dark:border-white/10 z-40 transition-all duration-300 shadow-lg",
      className
    )}>
      <nav className="p-4 space-y-2">
        {items.map((item, index) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Link
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 hover:scale-[1.02]",
                  isActive
                    ? "bg-white/50 dark:bg-slate-800/50 text-primary-600 dark:text-primary-400 shadow-md hover:shadow-glow"
                    : "text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-slate-800/30 hover:text-primary-600 dark:hover:text-primary-400 hover:shadow-sm"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/20 dark:border-primary-400/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon
                  size={20}
                  className={cn(
                    "relative z-10 transition-all duration-200",
                    isActive && "text-primary-600 dark:text-primary-400",
                    !isActive && "group-hover:scale-110 group-hover:rotate-3"
                  )}
                />
                <span className="relative z-10 flex-1">{item.title}</span>
                {item.badge && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={cn(
                      "relative z-10 px-2 py-0.5 text-xs font-semibold rounded-full transition-all duration-200",
                      isActive
                        ? "bg-primary-500 text-white shadow-md"
                        : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 group-hover:scale-110"
                    )}
                  >
                    {item.badge}
                  </motion.span>
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </aside>
  );
}
