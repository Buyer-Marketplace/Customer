import React from 'react';

const Input = ({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  className = '',
  icon,
  size = 'md',
  error = false,
  ...props 
}) => {
  // Responsive sizes
  const sizes = {
    sm: 'px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm',
    md: 'px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base',
    lg: 'px-4 sm:px-5 py-2 sm:py-2.5 text-base sm:text-lg'
  };
  
  // Icon padding adjustment
  const iconPadding = {
    sm: icon ? 'pl-7 sm:pl-8' : '',
    md: icon ? 'pl-8 sm:pl-9' : '',
    lg: icon ? 'pl-9 sm:pl-10' : ''
  };
  
  // State styles
  const stateStyles = error 
    ? 'border-red-500 focus:ring-red-500' 
    : 'border-light-border dark:border-dark-border focus:ring-primary';
  
  return (
    <div className="relative w-full">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
          <span className="text-gray-400 dark:text-dark-muted text-sm sm:text-base">
            {icon}
          </span>
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full rounded-full border bg-white dark:bg-dark-card text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-dark-muted focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${sizes[size]} ${iconPadding[size]} ${stateStyles} ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;