import React from 'react';

const Card = ({ children, className = '', padding = true, hover = false }) => {
  const baseStyles = 'bg-white dark:bg-dark-card rounded-xl sm:rounded-2xl border border-light-border dark:border-dark-border transition-all duration-300';
  
  // Responsive padding
  const paddingStyles = padding ? 'p-3 sm:p-4 md:p-5 lg:p-6' : '';
  
  // Responsive hover effect
  const hoverStyles = hover ? 'hover:shadow-md sm:hover:shadow-lg hover:-translate-y-0.5 sm:hover:-translate-y-1 transition-all duration-300' : '';
  
  return (
    <div className={`${baseStyles} ${paddingStyles} ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
};

export default Card;