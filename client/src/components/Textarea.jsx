import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

const Textarea = forwardRef(
  (
    {
      label,
      error,
      helperText,
      rows = 4,
      className = '',
      wrapperClassName = '',
      required = false,
      id,
      ...props
    },
    ref
  ) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={`w-full space-y-1.5 ${wrapperClassName}`}>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-semibold text-[#1d1d1f] dark:text-[#d2d2d7] tracking-tight"
          >
            {label}
            {required && <span className="text-[#ff3b30] ml-1">*</span>}
          </label>
        )}

        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          className={`
            w-full px-4 py-2.5 text-sm rounded-xl
            bg-[#f5f5f7] dark:bg-[#1c1c1e]
            text-[#1d1d1f] dark:text-[#f5f5f7]
            placeholder:text-[#86868b] dark:placeholder:text-[#6e6e73]
            border transition-all duration-200 outline-none resize-y
            ${
              error
                ? 'border-[#ff3b30] focus:border-[#ff3b30] focus:ring-4 focus:ring-[#ff3b30]/15'
                : 'border-black/[0.08] dark:border-white/[0.12] hover:border-black/[0.16] dark:hover:border-white/[0.2] focus:border-[#0071e3] focus:bg-white dark:focus:bg-[#161617] focus:ring-4 focus:ring-[#0071e3]/15'
            }
            ${className}
          `.replace(/\s+/g, ' ').trim()}
          {...props}
        />

        {error && (
          <p className="flex items-center gap-1 text-xs text-[#ff3b30] pt-0.5 animate-in fade-in">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{error}</span>
          </p>
        )}

        {!error && helperText && (
          <p className="text-xs text-[#86868b] pt-0.5">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
export default Textarea;
