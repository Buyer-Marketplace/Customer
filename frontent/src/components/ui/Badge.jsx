import React from 'react';
import { 
  IoCheckmarkCircle, 
  IoTimeOutline, 
  IoWarningOutline,
  IoLeafOutline,
  IoStarOutline
} from 'react-icons/io5';

const variantClasses = {
  default: 'bg-green-600/20 text-green-300 border-green-500/30',
  success: 'bg-emerald-600/20 text-emerald-300 border-emerald-500/30',
  warning: 'bg-amber-600/20 text-amber-300 border-amber-500/30',
  danger: 'bg-rose-600/20 text-rose-300 border-rose-500/30',
  info: 'bg-sky-600/20 text-sky-300 border-sky-500/30',
  organic: 'bg-green-600/30 text-green-300 border-green-400/50',
  preorder: 'bg-purple-600/20 text-purple-300 border-purple-500/30',
  featured: 'bg-yellow-600/20 text-yellow-300 border-yellow-500/30',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base'
};

const iconMap = {
  success: IoCheckmarkCircle,
  warning: IoWarningOutline,
  danger: IoWarningOutline,
  organic: IoLeafOutline,
  preorder: IoTimeOutline,
  featured: IoStarOutline
};

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'sm',
  icon: CustomIcon,
  className = '',
  showIcon = true,
  ...props 
}) => {
  const Icon = CustomIcon || iconMap[variant];
  
  return (
    <span
      className={`
        inline-flex items-center gap-1 font-medium
        border backdrop-blur-sm rounded-full
        ${variantClasses[variant] || variantClasses.default}
        ${sizeClasses[size]}
        ${className}
      `}
      {...props}
    >
      {showIcon && Icon && <Icon size={size === 'lg' ? 16 : size === 'md' ? 14 : 12} />}
      {children}
    </span>
  );
};

// Default export - this is what ProductCard uses
export default Badge;