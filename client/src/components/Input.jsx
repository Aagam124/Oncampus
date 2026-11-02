import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      icon: Icon,
      type = 'text',
      className = '',
      wrapperClassName = '',
      required = false,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={`w-full space-y-1.5 ${wrapperClassName}`}>
        {label && (
          <div className="flex items-center justify-between">
            <label
              htmlFor={inputId}
              className="block text-xs font-semibold text-[#1d1d1f] dark:text-[#d2d2d7] tracking-tight"
            >
              {label}
              {required && <span className="text-[#ff3b30] ml-1">*</span>}
            </label>
          </div>
        )}

        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#86868b]">
              <Icon className="w-4 h-4" />
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            type={inputType}
            className={`
              w-full px-4 py-2.5 text-sm rounded-xl
              bg-[#f5f5f7] dark:bg-[#1c1c1e]
              text-[#1d1d1f] dark:text-[#f5f5f7]
              placeholder:text-[#86868b] dark:placeholder:text-[#6e6e73]
              border transition-all duration-200 outline-none
              ${Icon ? 'pl-10' : ''}
              ${isPassword ? 'pr-10' : ''}
              ${
                error
                  ? 'border-[#ff3b30] focus:border-[#ff3b30] focus:ring-4 focus:ring-[#ff3b30]/15'
                  : 'border-black/[0.08] dark:border-white/[0.12] hover:border-black/[0.16] dark:hover:border-white/[0.2] focus:border-[#0071e3] focus:bg-white dark:focus:bg-[#161617] focus:ring-4 focus:ring-[#0071e3]/15'
              }
              ${className}
            `.replace(/\s+/g, ' ').trim()}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
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

Input.displayName = 'Input';
export default Input;
