import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  padding = true, 
  hover = false,
  bordered = false,
  elevated = false,
  ...props 
}) => {
  const classes = [
    'bg-white dark:bg-dark-card rounded-xl overflow-hidden transition-all duration-300',
    padding ? 'p-6' : '',
    bordered ? 'border border-gray-200 dark:border-dark-border' : '',
    elevated ? 'shadow-lg dark:shadow-dark-lg' : 'shadow-md dark:shadow-dark-md',
    hover ? 'hover:shadow-xl dark:hover:shadow-dark-xl hover:-translate-y-1' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', divider = true }) => (
  <div className={`${divider ? 'border-b border-gray-200 dark:border-dark-border pb-4 mb-4' : ''} ${className}`}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', divider = true }) => (
  <div className={`${divider ? 'border-t border-gray-200 dark:border-dark-border pt-4 mt-4' : ''} ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '', as: Component = 'h3' }) => (
  <Component className={`text-lg font-semibold text-gray-900 dark:text-white ${className}`}>
    {children}
  </Component>
);

export default Card;