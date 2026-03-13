import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  type = 'text',
  error,
  icon: Icon,
  className = '',
  required = false,
  helperText,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`
            w-full px-4 py-2.5 
            border-2 rounded-xl
            focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
            outline-none transition-all duration-200
            bg-white dark:bg-dark-card
            placeholder:text-gray-400 dark:placeholder:text-gray-600
            ${Icon ? 'pl-11' : ''}
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200 dark:border-red-700' 
              : 'border-gray-200 dark:border-dark-border hover:border-gray-300 dark:hover:border-gray-600'
            }
            ${className}
          `}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
          <span>⚠️</span>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;