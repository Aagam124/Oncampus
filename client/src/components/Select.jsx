import React, { forwardRef } from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';

const Select = forwardRef(
  (
    {
      label,
      error,
      helperText,
      options = [],
      placeholder = 'Select an option',
      className = '',
      wrapperClassName = '',
      required = false,
      children,
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={`w-full space-y-1.5 ${wrapperClassName}`}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold text-[#1d1d1f] dark:text-[#d2d2d7] tracking-tight"
          >
            {label}
            {required && <span className="text-[#ff3b30] ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={`
              w-full px-4 py-2.5 pr-10 text-sm rounded-xl appearance-none
              bg-[#f5f5f7] dark:bg-[#1c1c1e]
              text-[#1d1d1f] dark:text-[#f5f5f7]
              border transition-all duration-200 outline-none cursor-pointer
              ${
                error
                  ? 'border-[#ff3b30] focus:border-[#ff3b30] focus:ring-4 focus:ring-[#ff3b30]/15'
                  : 'border-black/[0.08] dark:border-white/[0.12] hover:border-black/[0.16] dark:hover:border-white/[0.2] focus:border-[#0071e3] focus:bg-white dark:focus:bg-[#161617] focus:ring-4 focus:ring-[#0071e3]/15'
              }
              ${className}
            `.replace(/\s+/g, ' ').trim()}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="text-[#86868b]">
                {placeholder}
              </option>
            )}
            {children ||
              options.map((opt) => {
                const value = typeof opt === 'object' ? opt.value : opt;
                const labelText = typeof opt === 'object' ? opt.label : opt;
                return (
                  <option key={value} value={value} className="bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-[#f5f5f7]">
                    {labelText}
                  </option>
                );
              })}
          </select>

          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[#86868b]">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

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

Select.displayName = 'Select';
export default Select;
