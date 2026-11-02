import React from 'react';

export function Skeleton({ className = '', rounded = 'rounded-xl', ...props }) {
  return (
    <div
      className={`animate-apple-shimmer bg-[#e8e8ed] dark:bg-[#2c2c2e] ${rounded} ${className}`}
      {...props}
    />
  );
}

export function SkeletonAvatar({ size = 'md', className = '' }) {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <Skeleton
      rounded="rounded-full"
      className={`${sizeClasses[size] || sizeClasses.md} flex-shrink-0 ${className}`}
    />
  );
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2.5 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-3.5 ${
            i === lines - 1 && lines > 1 ? 'w-3/5' : 'w-full'
          }`}
          rounded="rounded-md"
        />
      ))}
    </div>
  );
}

export function SkeletonButton({ size = 'md', className = '' }) {
  const heightClasses = {
    sm: 'h-8 w-20',
    md: 'h-10 w-28',
    lg: 'h-12 w-36',
  };

  return (
    <Skeleton
      rounded="rounded-full"
      className={`${heightClasses[size] || heightClasses.md} ${className}`}
    />
  );
}

export function SkeletonCard({ className = '' }) {
  return (
    <div
      className={`
        bg-white dark:bg-[#161617] p-6 rounded-3xl
        border border-black/[0.06] dark:border-white/[0.08]
        shadow-apple-card space-y-4 ${className}
      `}
    >
      <div className="flex items-center gap-3">
        <SkeletonAvatar size="md" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-3.5 w-1/3 rounded-md" />
          <Skeleton className="h-3 w-1/4 rounded-md" />
        </div>
      </div>
      <Skeleton className="h-4 w-3/4 rounded-md mt-2" />
      <SkeletonText lines={2} />
      <div className="pt-3 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between">
        <Skeleton className="h-3.5 w-16 rounded-md" />
        <Skeleton className="h-4 w-20 rounded-md" />
      </div>
    </div>
  );
}

export default Skeleton;
