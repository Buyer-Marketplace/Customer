import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  className = '',
  type = 'button',
  icon: Icon,
  iconPosition = 'left',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm hover:shadow-md active:scale-95';
  
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 disabled:bg-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700',
    secondary: 'bg-earth-600 text-white hover:bg-earth-700 focus:ring-earth-500 disabled:bg-earth-300 dark:bg-earth-600 dark:hover:bg-earth-700',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 hover:border-primary-700 hover:text-primary-700 focus:ring-primary-500 disabled:border-primary-300 disabled:text-primary-300 dark:border-primary-500 dark:text-primary-400 dark:hover:bg-primary-900/20',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300 dark:bg-red-600 dark:hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 disabled:bg-green-300 dark:bg-green-600 dark:hover:bg-green-700',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500 disabled:text-gray-300 dark:text-gray-300 dark:hover:bg-gray-800',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-base gap-2',
    lg: 'px-7 py-3.5 text-lg gap-2.5',
  };
  
  const classes = [
    baseClasses,
    variants[variant],
    sizes[size],
    fullWidth ? 'w-full' : '',
    disabled || loading ? 'cursor-not-allowed opacity-60' : '',
    className,
  ].filter(Boolean).join(' ');

  const iconSize = {
    sm: 16,
    md: 18,
    lg: 20,
  };

  const iconElement = Icon && (
    <Icon size={iconSize[size]} className={iconPosition === 'left' ? 'order-first' : 'order-last'} />
  );

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <>
          <svg 
            className="animate-spin h-4 w-4 text-current" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {iconPosition === 'left' && iconElement}
          <span>{children}</span>
          {iconPosition === 'right' && iconElement}
        </>
      )}
    </button>
  );
};

export default Button;