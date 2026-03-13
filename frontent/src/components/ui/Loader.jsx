import React from 'react';

const Loader = ({ size = 'md', fullScreen = false }) => {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
    xl: 'h-16 w-16 border-4',
  };

  const spinner = (
    <div className="flex justify-center items-center">
      <div className={`
        ${sizes[size]} 
        animate-spin 
        rounded-full 
        border-green-800 
        border-t-green-400
      `}></div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-green-950/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="bg-green-900/30 rounded-xl border border-green-400/20 p-4 animate-pulse">
            <div className="h-48 bg-green-800/50 rounded-lg mb-4"></div>
            <div className="h-4 bg-green-800/50 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-green-800/50 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-green-800/50 rounded"></div>
          </div>
        );
      case 'text':
        return (
          <div className="space-y-2 animate-pulse">
            <div className="h-4 bg-green-800/50 rounded w-full"></div>
            <div className="h-4 bg-green-800/50 rounded w-5/6"></div>
            <div className="h-4 bg-green-800/50 rounded w-4/6"></div>
          </div>
        );
      case 'image':
        return (
          <div className="h-64 bg-green-800/50 rounded-lg animate-pulse"></div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </>
  );
};

export default Loader;