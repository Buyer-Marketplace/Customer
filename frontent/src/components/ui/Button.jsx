import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  fullWidth = false,
  ...props 
}) => {
  // Responsive base styles
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark active:scale-95',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    ghost: 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-card'
  };
  
  // Responsive sizes
  const sizes = {
    sm: 'px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm',
    md: 'px-3 sm:px-4 md:px-5 lg:px-6 py-1.5 sm:py-2 md:py-2.5 text-sm sm:text-base',
    lg: 'px-4 sm:px-5 md:px-6 lg:px-8 py-2 sm:py-2.5 md:py-3 text-base sm:text-lg'
  };
  
  const widthStyles = fullWidth ? 'w-full' : '';
  
  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyles} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;