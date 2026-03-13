import React, { useEffect } from 'react';
import { IoClose } from 'react-icons/io5';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  footer,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-5xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div
          className={`fixed inset-0 transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closeOnOverlayClick ? onClose : undefined}
        >
          <div className="absolute inset-0 bg-gray-900/70 dark:bg-gray-950/80 backdrop-blur-sm"></div>
        </div>

        {/* Center modal */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div
          className={`
            inline-block align-bottom bg-white dark:bg-dark-card 
            rounded-2xl text-left overflow-hidden 
            shadow-2xl transform transition-all duration-300 scale-100 opacity-100
            sm:my-8 sm:align-middle w-full ${sizes[size]}
            ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-dark-border">
              {title && (
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {title}
                </h3>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-border transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label="Close modal"
                >
                  <IoClose size={20} className="text-gray-500 dark:text-gray-400" />
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="px-6 py-5">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="px-6 py-4 bg-gray-50 dark:bg-dark-border/20 border-t border-gray-200 dark:border-dark-border">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;