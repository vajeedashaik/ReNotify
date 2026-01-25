'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface InfoCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  gradient?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  index?: number;
}

export default function InfoCard({ title, value, icon: Icon, gradient = 'from-primary-500 to-primary-600', trend, index = 0 }: InfoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="glass card-hover min-w-[200px] flex-shrink-0 group"
    >
      <div className="flex items-start justify-between mb-4">
        <motion.div
          className={`p-3 rounded-lg bg-gradient-to-br ${gradient} text-white shadow-md`}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Icon size={24} />
        </motion.div>
        {trend && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`text-sm font-medium ${trend.isPositive ? 'text-status-active' : 'text-status-expired'}`}
          >
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </motion.span>
        )}
      </div>
      <div>
        <motion.p
          className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {value}
        </motion.p>
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
      </div>
    </motion.div>
  );
}
