import React from 'react';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { ToastContext, useToastState } from '@/hooks/useToast';

const toastConfig = {
  success: {
    icon: CheckCircle2,
    iconColor: 'text-[#34c759]',
    bgColor: 'bg-[#34c759]/10',
    borderColor: 'border-[#34c759]/20',
  },
  error: {
    icon: XCircle,
    iconColor: 'text-[#ff3b30]',
    bgColor: 'bg-[#ff3b30]/10',
    borderColor: 'border-[#ff3b30]/20',
  },
  info: {
    icon: Info,
    iconColor: 'text-[#0071e3]',
    bgColor: 'bg-[#0071e3]/10',
    borderColor: 'border-[#0071e3]/20',
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-[#ff9f0a]',
    bgColor: 'bg-[#ff9f0a]/10',
    borderColor: 'border-[#ff9f0a]/20',
  },
};

function ToastItem({ toast, onRemove }) {
  const cfg = toastConfig[toast.type] || toastConfig.info;
  const Icon = cfg.icon;

  return (
    <div
      role="alert"
      className="
        pointer-events-auto flex items-center gap-3 px-4 py-3
        bg-white/95 dark:bg-[#1c1c1e]/95 backdrop-blur-2xl
        border border-black/[0.08] dark:border-white/[0.12]
        text-[#1d1d1f] dark:text-[#f5f5f7]
        rounded-2xl shadow-apple-toast max-w-sm w-full
        animate-in fade-in slide-in-from-bottom-3 duration-250
        transition-all
      "
    >
      <div className={`p-1.5 rounded-xl ${cfg.bgColor} ${cfg.iconColor} flex-shrink-0`}>
        <Icon className="w-4 h-4" />
      </div>

      <p className="text-xs font-semibold leading-relaxed flex-1">
        {toast.message}
      </p>

      <button
        onClick={() => onRemove(toast.id)}
        className="p-1 rounded-full text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors flex-shrink-0"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const { toasts, addToast, removeToast, toast } = useToastState();

  return (
    <ToastContext.Provider value={{ addToast, removeToast, toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5 pointer-events-none max-w-sm w-full px-4 sm:px-0">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;
