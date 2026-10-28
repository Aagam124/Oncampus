import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ message = 'Loading...', className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
      {message && (
        <p className="mt-3 text-sm text-surface-500">{message}</p>
      )}
    </div>
  );
}
