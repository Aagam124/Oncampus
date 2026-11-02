import React from 'react';
import { Inbox } from 'lucide-react';
import Button from '@/components/Button';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'Nothing here yet',
  description = 'There are no items to display at this time.',
  actionLabel,
  actionTo,
  onAction,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto ${className}`}>
      {/* Icon Capsule */}
      <div className="w-16 h-16 rounded-3xl bg-[#f5f5f7] dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center mb-5 shadow-xs">
        <Icon className="w-7 h-7 text-[#86868b] dark:text-[#a1a1a6]" />
      </div>

      {/* Typography */}
      <h3 className="text-base sm:text-lg font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] mb-1.5">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-[#86868b] dark:text-[#a1a1a6] leading-relaxed mb-6 max-w-xs">
        {description}
      </p>

      {/* Action Button */}
      {actionLabel && (
        <>
          {actionTo ? (
            <Button to={actionTo} variant="primary" size="sm">
              {actionLabel}
            </Button>
          ) : onAction ? (
            <Button onClick={onAction} variant="primary" size="sm">
              {actionLabel}
            </Button>
          ) : null}
        </>
      )}
    </div>
  );
}
