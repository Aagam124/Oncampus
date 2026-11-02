import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import Button from '@/components/Button';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
}) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-xl transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Dialog container */}
      <div className="relative bg-white dark:bg-[#161617] rounded-3xl shadow-apple-modal max-w-md w-full p-6 border border-black/[0.08] dark:border-white/[0.12] animate-in fade-in zoom-in-95 duration-200 z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
              variant === 'danger'
                ? 'bg-[#ff3b30]/10 text-[#ff3b30]'
                : 'bg-[#0071e3]/10 text-[#0071e3]'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
              {title}
            </h3>
            <p className="mt-1.5 text-xs text-[#86868b] dark:text-[#a1a1a6] leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <Button variant="secondary" size="sm" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            size="sm"
            onClick={() => {
              onConfirm?.();
              onClose?.();
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
