import React from 'react';
import { FcGoogle } from 'react-icons/fc';

const GoogleButton = ({ 
  onClick, 
  className = '', 
  fullWidth = true, 
  text = "Continue with Google", 
  loading = false 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`
        group relative overflow-hidden
        flex items-center justify-center gap-3
        bg-white hover:bg-gray-50
        text-gray-700 font-medium
        border border-gray-300
        ${fullWidth ? 'w-full' : 'px-6'}
        rounded-md px-4 py-2.5 text-sm
        transition-all duration-200
        shadow-sm hover:shadow-md
        active:bg-gray-100
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      <FcGoogle className="w-5 h-5" />
      <span>{loading ? 'Please wait...' : text}</span>
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </button>
  );
};

export default GoogleButton;