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
  // Base classes - gradient backgrounds with smooth corners
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-950 shadow-md hover:shadow-lg active:scale-95 border border-yellow-400/20 hover:border-yellow-400/40';
  
  // Gradient variants with yellow accent - all centered
  const variants = {
    primary: 'bg-gradient-to-r from-green-700 to-green-800 hover:from-green-600 hover:to-green-700 text-yellow-300 focus:ring-yellow-400 disabled:from-green-800/50 disabled:to-green-900/50 disabled:text-yellow-300/50 shadow-green-800/30',
    
    secondary: 'bg-gradient-to-r from-green-800 to-green-900 hover:from-green-700 hover:to-green-800 text-yellow-300 focus:ring-yellow-400 disabled:from-green-900/50 disabled:to-green-950/50 disabled:text-yellow-300/50',
    
    outline: 'bg-transparent border-2 border-green-600 text-yellow-300 hover:bg-gradient-to-r hover:from-green-800/80 hover:to-green-900/80 hover:text-yellow-200 focus:ring-yellow-400 disabled:border-green-600/50 disabled:text-yellow-300/50',
    
    danger: 'bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-yellow-300 focus:ring-yellow-400 disabled:from-red-800/50 disabled:to-red-900/50 disabled:text-yellow-300/50',
    
    success: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-yellow-300 focus:ring-yellow-400 disabled:from-green-700/50 disabled:to-green-800/50 disabled:text-yellow-300/50',
    
    ghost: 'bg-transparent border border-yellow-400/20 text-yellow-300/80 hover:bg-gradient-to-r hover:from-green-800/50 hover:to-green-900/50 hover:text-yellow-200 hover:border-yellow-400/40 focus:ring-yellow-400 disabled:text-yellow-300/30',
  };
  
  // Responsive sizes - optimized for all screens
  const sizes = {
    sm: 'px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm gap-1 sm:gap-1.5',
    md: 'px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base gap-1.5 sm:gap-2',
    lg: 'px-5 sm:px-6 py-2.5 sm:py-3 text-base sm:text-lg gap-2 sm:gap-2.5',
    xl: 'px-6 sm:px-8 py-3 sm:py-4 text-lg sm:text-xl gap-2.5 sm:gap-3',
  };
  
  const classes = [
    baseClasses,
    variants[variant],
    sizes[size],
    fullWidth ? 'w-full' : 'w-auto',
    disabled || loading ? 'cursor-not-allowed opacity-60' : '',
    className,
  ].filter(Boolean).join(' ');

  // Responsive icon sizes
  const iconSize = {
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
  };

  const iconElement = Icon && (
    <Icon 
      size={iconSize[size]} 
      className={`${iconPosition === 'left' ? 'order-first mr-1 sm:mr-2' : 'order-last ml-1 sm:ml-2'} transition-transform group-hover:translate-x-1 text-yellow-300`} 
    />
  );

  return (
    <button
      type={type}
      className={`${classes} group relative overflow-hidden`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {/* Shine effect overlay for all buttons */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
      
      {loading ? (
        <div className="flex items-center justify-center gap-2 relative z-10">
          <svg 
            className="animate-spin h-4 w-4 text-yellow-300" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-yellow-300 text-center">Loading...</span>
        </div>
      ) : (
        <div className="flex items-center justify-center relative z-10">
          {iconPosition === 'left' && iconElement}
          <span className="text-yellow-300 text-center whitespace-nowrap">{children}</span>
          {iconPosition === 'right' && iconElement}
        </div>
      )}
    </button>
  );
};

export default Button;