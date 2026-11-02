import React from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const variants = {
  primary:
    'bg-[#0071e3] hover:bg-[#0077ed] text-white shadow-sm hover:shadow-[0_4px_14px_rgba(0,113,227,0.3)] active:bg-[#005bb5]',
  secondary:
    'bg-[#f5f5f7] dark:bg-[#1d1d1f] text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-[#e8e8ed] dark:hover:bg-[#2c2c2e] active:bg-[#dcdce2]',
  outline:
    'bg-transparent border border-black/[0.12] dark:border-white/[0.16] text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] active:bg-black/[0.08]',
  ghost:
    'bg-transparent text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] active:bg-black/[0.08]',
  natural:
    'bg-[#34c759] hover:bg-[#28a745] text-white shadow-sm hover:shadow-[0_4px_14px_rgba(52,199,89,0.3)] active:bg-[#1f8337]',
  danger:
    'bg-[#ff3b30] hover:bg-[#e03126] text-white shadow-sm hover:shadow-[0_4px_14px_rgba(255,59,48,0.3)] active:bg-[#c9251b]',
  ivory:
    'bg-[#fdfcf9] dark:bg-[#161617] text-[#1d1d1f] dark:text-[#faf8f2] border border-[#ede4d1] dark:border-white/[0.1] hover:bg-[#faf8f2] dark:hover:bg-[#1d1d1f]',
};

const sizes = {
  xs: 'px-2.5 py-1 text-xs rounded-full gap-1.5',
  sm: 'px-3.5 py-1.5 text-xs font-semibold rounded-full gap-1.5',
  md: 'px-5 py-2.5 text-sm font-semibold rounded-full gap-2',
  lg: 'px-7 py-3.5 text-base font-bold rounded-full gap-2.5',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled = false,
  to,
  href,
  className = '',
  ...props
}) {
  const baseClasses = `
    inline-flex items-center justify-center font-medium
    transition-all duration-150 ease-out select-none
    active:scale-[0.98] focus:outline-none focus-visible:ring-2
    focus-visible:ring-[#0071e3]/40 focus-visible:ring-offset-2
    disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100
    ${variants[variant] || variants.primary}
    ${sizes[size] || sizes.md}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  const content = (
    <>
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
      ) : (
        Icon && iconPosition === 'left' && <Icon className="w-4 h-4 flex-shrink-0" />
      )}
      {children && <span>{children}</span>}
      {!isLoading && Icon && iconPosition === 'right' && (
        <Icon className="w-4 h-4 flex-shrink-0" />
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={baseClasses} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={baseClasses} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={props.type || 'button'}
      disabled={disabled || isLoading}
      className={baseClasses}
      {...props}
    >
      {content}
    </button>
  );
}
