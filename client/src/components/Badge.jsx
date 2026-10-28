const variantStyles = {
  active: 'bg-green-100 text-green-700 border-green-200',
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  completed: 'bg-blue-100 text-blue-700 border-blue-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
  'in-progress': 'bg-orange-100 text-orange-700 border-orange-200',
  delivered: 'bg-purple-100 text-purple-700 border-purple-200',
  open: 'bg-green-100 text-green-700 border-green-200',
  closed: 'bg-surface-100 text-surface-600 border-surface-200',
  default: 'bg-surface-100 text-surface-600 border-surface-200',
  brand: 'bg-brand-100 text-brand-700 border-brand-200',
  info: 'bg-blue-100 text-blue-700 border-blue-200',
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
