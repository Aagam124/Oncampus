const variantStyles = {
  active: 'bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800/50',
  pending: 'bg-yellow-100 dark:bg-amber-950/40 text-yellow-700 dark:text-amber-300 border-yellow-200 dark:border-amber-800/50',
  completed: 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/50',
  cancelled: 'bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800/50',
  rejected: 'bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800/50',
  'in-progress': 'bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800/50',
  delivered: 'bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/50',
  open: 'bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800/50',
  closed: 'bg-surface-100 dark:bg-white/[0.06] text-surface-600 dark:text-surface-400 border-surface-200 dark:border-white/[0.1]',
  default: 'bg-surface-100 dark:bg-white/[0.06] text-surface-600 dark:text-surface-400 border-surface-200 dark:border-white/[0.1]',
  brand: 'bg-brand-100 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 border-brand-200 dark:border-brand-800/50',
  info: 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/50',
};

export default function Badge({ children, variant = 'default', className = '' }) {
  const style = variantStyles[variant] || variantStyles.default;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style} ${className}`}
    >
      {children}
    </span>
  );
}
