import React from 'react';
import { AspirationStatus } from '@/lib/types';
import { STATUS_CONFIG } from '@/lib/constants';

interface StatusBadgeProps {
  status: AspirationStatus;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

export default function StatusBadge({ status, size = 'md', showTooltip = true }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.diterima;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs sm:text-sm px-2.5 py-1',
    lg: 'text-sm sm:text-base px-3.5 py-1.5 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${config.badgeBg} ${config.badgeText} ${sizeClasses[size]}`}
      title={showTooltip ? config.description : undefined}
      aria-label={`Status: ${config.label}`}
    >
      <span className={`w-2 h-2 rounded-full shrink-0 ${config.color}`} />
      <span>{config.label}</span>
    </span>
  );
}
