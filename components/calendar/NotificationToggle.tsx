'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface NotificationToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export default function NotificationToggle({
  label,
  checked,
  onChange,
  disabled = false,
}: NotificationToggleProps) {
  return (
    <label
      className={`
        flex items-center justify-between gap-3 py-2 px-3 rounded-lg
        bg-gray-50 border border-gray-100
        ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'}
      `}
    >
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`
          relative w-11 h-6 rounded-full transition-colors duration-200
          ${checked ? 'bg-primary-500' : 'bg-gray-300'}
        `}
      >
        <motion.span
          animate={{ x: checked ? 24 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-md"
        />
      </button>
    </label>
  );
}
