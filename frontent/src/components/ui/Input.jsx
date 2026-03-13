import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  type = 'text',
  error,
  icon: Icon,
  className = '',
  required = false,
  helperText,
  labelClassName = '',
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className={`block text-xs font-medium text-green-200 mb-1 ${labelClassName}`}>
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-4 w-4 text-green-400" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`
            w-full px-3 py-2.5 text-sm
            border rounded-xl
            focus:ring-2 focus:ring-green-500 focus:border-green-500 
            outline-none transition-all duration-200
            bg-green-950/50
            border-green-700/50
            text-white
            placeholder-green-300/50
            ${Icon ? 'pl-9' : ''}
            ${error 
              ? 'border-red-500 focus:ring-red-500' 
              : 'hover:border-green-600'
            }
            ${className}
          `}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
          <span>⚠️</span>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-xs text-green-300/70">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;