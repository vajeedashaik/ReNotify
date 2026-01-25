'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ChartData {
  name: string;
  value: number;
  color?: string;
}

interface ChartProps {
  data: ChartData[];
  type?: 'bar' | 'line' | 'area';
  height?: number;
  showLabels?: boolean;
  className?: string;
}

export default function Chart({ data, type = 'bar', height = 200, showLabels = true, className }: ChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className={cn("w-full", className)}>
      <div className="relative" style={{ height: `${height}px` }}>
        {type === 'bar' && (
          <div className="flex items-end justify-between h-full gap-2">
            {data.map((item, index) => (
              <motion.div
                key={item.name}
                className="flex-1 flex flex-col items-center group"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <motion.div
                  className={cn(
                    "w-full rounded-t-lg relative overflow-hidden",
                    item.color || "bg-gradient-to-t from-primary-500 to-primary-600"
                  )}
                  style={{ height: `${(item.value / maxValue) * 100}%` }}
                  whileHover={{ scaleY: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-colors" />
                </motion.div>
                {showLabels && (
                  <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 text-center">
                    <div className="font-semibold">{item.value}</div>
                    <div className="text-[10px] mt-1">{item.name}</div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
        {type === 'line' && (
          <svg width="100%" height={height} className="overflow-visible">
            <motion.polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-primary-500"
              points={data.map((item, i) => {
                const x = (i / (data.length - 1)) * 100;
                const y = 100 - (item.value / maxValue) * 100;
                return `${x}%,${y}%`;
              }).join(' ')}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
            {data.map((item, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = 100 - (item.value / maxValue) * 100;
              return (
                <motion.circle
                  key={item.name}
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="4"
                  fill="currentColor"
                  className="text-primary-600"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.5, duration: 0.3 }}
                  whileHover={{ scale: 1.5 }}
                />
              );
            })}
          </svg>
        )}
      </div>
    </div>
  );
}
