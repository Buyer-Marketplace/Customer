import React from 'react';

const Badge = ({ children, variant = 'default', className = '', size = 'md' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800 dark:bg-dark-border dark:text-gray-200',
    primary: 'bg-primary/10 text-primary dark:bg-primary/20',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  };
  
  // Responsive sizes
  const sizes = {
    sm: 'px-1.5 py-0.5 text-[10px] sm:text-xs',
    md: 'px-2 sm:px-2.5 py-0.5 sm:py-1 text-xs sm:text-sm',
    lg: 'px-2.5 sm:px-3 py-1 sm:py-1.5 text-sm sm:text-base'
  };
  
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;