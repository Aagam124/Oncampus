import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const modalSizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
  showClose = true,
  className = '',
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose?.();
      }
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Frosted Glass Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-xl transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Sheet */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        className={`
          relative w-full ${modalSizes[size] || modalSizes.md}
          bg-white dark:bg-[#161617]
          text-[#1d1d1f] dark:text-[#f5f5f7]
          rounded-3xl border border-black/[0.08] dark:border-white/[0.12]
          shadow-apple-modal overflow-hidden
          animate-in fade-in zoom-in-95 duration-200
          z-10 my-8 ${className}
        `.replace(/\s+/g, ' ').trim()}
      >
        {/* Header */}
        {(title || showClose) && (
          <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-black/[0.06] dark:border-white/[0.08]">
            <div className="space-y-1">
              {title && (
                <h3 className="text-lg font-bold tracking-tight text-[#1d1d1f] dark:text-white">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-[#86868b] dark:text-[#a1a1a6]">
                  {subtitle}
                </p>
              )}
            </div>

            {showClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-5 max-h-[75vh] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 bg-[#faf8f5]/60 dark:bg-[#121214]/60 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
