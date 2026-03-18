import React, { useState, useEffect } from 'react';
import { IoLeaf } from 'react-icons/io5';

const Loader = ({ 
  size = 'md', 
  fullScreen = false, 
  text = 'Loading', 
  showLogo = true,
  withSpinner = true,
  fadeOut = false,
  onComplete = null
}) => {
  const [visible, setVisible] = useState(true);
  const [dotCount, setDotCount] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  // Animated dots effect
  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  // Handle fade out animation when fadeOut is true
  useEffect(() => {
    if (fadeOut) {
      setIsExiting(true);
      const timer = setTimeout(() => {
        setVisible(false);
        if (onComplete) onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [fadeOut, onComplete]);

  // REDUCED SIZES - Made everything smaller
  const sizes = {
    xs: {
      container: 'h-8 w-8',
      logo: 'h-4 w-4',
      spinner: 'h-8 w-8 border-2',
      text: 'text-[10px]'
    },
    sm: {
      container: 'h-10 w-10',
      logo: 'h-5 w-5',
      spinner: 'h-10 w-10 border-2',
      text: 'text-xs'
    },
    md: {
      container: 'h-12 w-12',
      logo: 'h-6 w-6',
      spinner: 'h-12 w-12 border-2',
      text: 'text-xs'
    },
    lg: {
      container: 'h-16 w-16',
      logo: 'h-8 w-8',
      spinner: 'h-16 w-16 border-3',
      text: 'text-sm'
    },
    xl: {
      container: 'h-20 w-20',
      logo: 'h-10 w-10',
      spinner: 'h-20 w-20 border-3',
      text: 'text-base'
    },
  };

  const getDots = () => {
    return '.'.repeat(dotCount) + ' '.repeat(3 - dotCount);
  };

  const spinner = (
    <div className="flex flex-col justify-center items-center gap-3">
      <div className="relative flex items-center justify-center">
        {/* Rotating Spinner Ring - Thinner border */}
        {withSpinner && (
          <div className={`
            absolute inset-0 
            ${sizes[size]?.spinner || sizes.md.spinner} 
            rounded-full 
            border 
            border-green-800/30 
            border-t-green-400 
            border-l-green-400
            animate-spin
            shadow-md shadow-green-500/20
          `} />
        )}
        
        {/* Logo Container with Pulse Effect */}
        <div className={`
          relative 
          ${sizes[size]?.container || sizes.md.container} 
          flex items-center justify-center
          ${showLogo ? 'animate-pulse' : ''}
        `}>
          {showLogo ? (
            <div className="relative group">
              <IoLeaf 
                className={`
                  ${sizes[size]?.logo || sizes.md.logo} 
                  text-green-400 
                  transition-all 
                  duration-300
                  hover:scale-110
                  hover:text-green-300
                  drop-shadow-md
                `}
              />
              {/* Glow Effect - Subtle */}
              <div className="absolute inset-0 bg-green-400/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ) : (
            <div className={`
              ${sizes[size]?.spinner || sizes.md.spinner} 
              rounded-full 
              border 
              border-green-800 
              border-t-green-400
              border-l-green-400
              animate-spin
              shadow-md shadow-green-500/20
            `} />
          )}
        </div>
      </div>

      {/* Animated Text with Dots - More compact */}
      {text && (
        <div className="flex items-center gap-1">
          <span className={`
            text-green-300 
            font-medium 
            ${sizes[size]?.text || sizes.md.text}
            animate-pulse
          `}>
            {text}
          </span>
          <span className={`
            text-green-400 
            font-bold 
            ${sizes[size]?.text || sizes.md.text}
            w-5 text-left
          `}>
            {getDots()}
          </span>
        </div>
      )}
    </div>
  );

  if (!visible) return null;

  if (fullScreen) {
    return (
      <div className={`
        fixed inset-0 
        bg-gradient-to-b from-green-950/95 to-green-900/95 
        backdrop-blur-md 
        flex items-center justify-center 
        z-50
        transition-all duration-500
        ${isExiting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
      `}>
        <div className={`
          bg-green-900/40 
          p-6 
          rounded-2xl 
          border border-green-400/20 
          shadow-2xl 
          backdrop-blur-sm
          transform transition-all duration-500
          ${isExiting ? 'scale-90 opacity-0' : 'scale-100 opacity-100'}
        `}>
          {spinner}
          
          {/* Decorative Elements - Smaller */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-green-400/30 rounded-tl-2xl"></div>
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-green-400/30 rounded-br-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`
      inline-block
      transition-all duration-500
      ${isExiting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
    `}>
      {spinner}
    </div>
  );
};

// Skeleton Loader Component - With smaller logos
export const SkeletonLoader = ({ 
  type = 'card', 
  count = 1, 
  className = '', 
  showLogo = false,
  animated = true,
  delay = 0 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const renderSkeleton = () => {
    const baseClasses = `
      bg-gradient-to-br from-green-900/30 to-green-950/30 
      backdrop-blur-sm 
      rounded-xl 
      border border-green-400/20 
      overflow-hidden
      transition-all duration-500
      ${animated && isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
    `;

    switch (type) {
      case 'card':
        return (
          <div className={`${baseClasses} p-3 ${className}`}>
            {showLogo && (
              <div className="flex justify-center mb-3">
                <IoLeaf className="h-8 w-8 text-green-400/50 animate-pulse" />
              </div>
            )}
            <div className="h-40 bg-green-800/50 rounded-lg mb-3 animate-pulse"></div>
            <div className="h-3 bg-green-800/50 rounded w-3/4 mb-1 animate-pulse"></div>
            <div className="h-3 bg-green-800/50 rounded w-1/2 mb-3 animate-pulse"></div>
            <div className="h-7 bg-green-800/50 rounded animate-pulse"></div>
          </div>
        );
      
      case 'product-card':
        return (
          <div className={`${baseClasses} ${className}`}>
            {showLogo && (
              <div className="absolute top-2 left-2 z-10">
                <IoLeaf className="h-6 w-6 text-green-400/50 animate-pulse" />
              </div>
            )}
            <div className="h-40 bg-green-800/50 animate-pulse"></div>
            <div className="p-3 space-y-2">
              <div className="h-3 bg-green-800/50 rounded w-3/4 animate-pulse"></div>
              <div className="h-3 bg-green-800/50 rounded w-1/2 animate-pulse"></div>
              <div className="h-5 bg-green-800/50 rounded w-1/3 animate-pulse"></div>
              <div className="h-8 bg-green-800/50 rounded animate-pulse"></div>
            </div>
          </div>
        );
      
      case 'category-card':
        return (
          <div className={`${baseClasses} ${className}`}>
            {showLogo && (
              <div className="absolute top-2 left-2 z-10">
                <IoLeaf className="h-5 w-5 text-green-400/50 animate-pulse" />
              </div>
            )}
            <div className="h-32 bg-green-800/50 animate-pulse"></div>
            <div className="p-3 space-y-2">
              <div className="h-4 bg-green-800/50 rounded w-2/3 animate-pulse"></div>
              <div className="h-3 bg-green-800/50 rounded w-1/2 animate-pulse"></div>
            </div>
          </div>
        );
      
      case 'text':
        return (
          <div className={`space-y-1.5 ${className}`}>
            {showLogo && (
              <div className="flex justify-center mb-1">
                <IoLeaf className="h-5 w-5 text-green-400/50 animate-pulse" />
              </div>
            )}
            <div className="h-3 bg-green-800/50 rounded w-full animate-pulse"></div>
            <div className="h-3 bg-green-800/50 rounded w-5/6 animate-pulse"></div>
            <div className="h-3 bg-green-800/50 rounded w-4/6 animate-pulse"></div>
          </div>
        );
      
      case 'image':
        return (
          <div className={`relative h-48 bg-green-800/50 rounded-lg overflow-hidden ${className}`}>
            {showLogo && (
              <div className="absolute inset-0 flex items-center justify-center">
                <IoLeaf className="h-10 w-10 text-green-400/30 animate-pulse" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-700/20 to-transparent animate-shimmer"></div>
          </div>
        );
      
      case 'avatar':
        return (
          <div className={`relative w-10 h-10 bg-green-800/50 rounded-full overflow-hidden ${className}`}>
            {showLogo && (
              <div className="absolute inset-0 flex items-center justify-center">
                <IoLeaf className="h-4 w-4 text-green-400/50 animate-pulse" />
              </div>
            )}
          </div>
        );
      
      case 'button':
        return (
          <div className={`relative h-8 bg-green-800/50 rounded-lg overflow-hidden ${className}`}>
            {showLogo && (
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                <IoLeaf className="h-4 w-4 text-green-400/50 animate-pulse" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-700/20 to-transparent animate-shimmer"></div>
          </div>
        );
      
      case 'logo':
        return (
          <div className={`flex justify-center items-center ${className}`}>
            <div className="relative">
              <IoLeaf className="h-10 w-10 text-green-400 animate-bounce" />
              <div className="absolute inset-0 bg-green-400/20 blur-md rounded-full animate-pulse"></div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={`skeleton-${type}-${index}`} 
          className="relative"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {renderSkeleton()}
        </div>
      ))}
    </>
  );
};

// Convenience exports
export const CardSkeleton = (props) => <SkeletonLoader type="card" {...props} />;
export const ProductCardSkeleton = (props) => <SkeletonLoader type="product-card" {...props} />;
export const CategoryCardSkeleton = (props) => <SkeletonLoader type="category-card" {...props} />;
export const TextSkeleton = (props) => <SkeletonLoader type="text" {...props} />;
export const ImageSkeleton = (props) => <SkeletonLoader type="image" {...props} />;
export const AvatarSkeleton = (props) => <SkeletonLoader type="avatar" {...props} />;
export const ButtonSkeleton = (props) => <SkeletonLoader type="button" {...props} />;
export const LogoSkeleton = (props) => <SkeletonLoader type="logo" {...props} />;

export default Loader;