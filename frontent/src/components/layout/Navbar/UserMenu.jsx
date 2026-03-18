import React from 'react';
import { Link } from 'react-router-dom';
import {
  IoPersonOutline,
  IoReceiptOutline,
  IoPersonCircleOutline,
  IoHeartOutline,
  IoLogOutOutline,
  IoCheckmarkCircle
} from 'react-icons/io5';

const UserMenu = ({ isOpen, isAuthenticated, user, wishlistItems, onClose, onLogout, dropdownRef }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop blur overlay */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 animate-fadeIn"
        onClick={onClose}
      />
      
      {/* Dropdown Card */}
      <div 
        ref={dropdownRef} 
        className="absolute right-2 sm:right-4 md:right-6 mt-2 w-56 sm:w-64 z-50 animate-slideDown"
      >
        {/* Decorative top arrow */}
        <div className="absolute -top-2 right-6 sm:right-8 w-4 h-4 bg-green-950 border-l border-t border-green-800 transform rotate-45 rounded-tl-sm"></div>
        
        {/* Card Content */}
        <div className="bg-gradient-to-b from-green-950 to-green-900 border border-green-800 rounded-xl shadow-2xl overflow-hidden backdrop-blur-lg">
          
          {/* User Info Section */}
          <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-green-800 bg-gradient-to-r from-green-900/50 to-transparent">
            {isAuthenticated ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg flex-shrink-0">
                  {user?.full_name?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || <IoPersonOutline className="w-4 h-4 sm:w-5 sm:h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-white truncate">{user?.full_name || user?.name}</p>
                  <p className="text-[10px] sm:text-xs text-green-400/70 truncate">{user?.email}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <IoCheckmarkCircle className="text-green-400 text-[10px] sm:text-xs" />
                    <span className="text-[8px] sm:text-[10px] text-green-400">Verified</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-1 sm:py-2">
                <p className="text-xs sm:text-sm font-medium text-white">Welcome!</p>
                <p className="text-[10px] sm:text-xs text-green-400/70">Sign in to continue</p>
              </div>
            )}
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {isAuthenticated ? (
              <>
                <Link
                  to="/orders"
                  className="flex items-center w-full gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-green-200 hover:text-white hover:bg-green-800/70 transition-all duration-200"
                  onClick={onClose}
                >
                  <IoReceiptOutline className="text-green-400" size={16} />
                  <span className="flex-1 text-left">My Orders</span>
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center w-full gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-green-200 hover:text-white hover:bg-green-800/70 transition-all duration-200"
                  onClick={onClose}
                >
                  <IoPersonCircleOutline className="text-green-400" size={16} />
                  <span className="flex-1 text-left">Profile</span>
                </Link>
                <Link
                  to="/wishlist"
                  className="flex items-center w-full gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-green-200 hover:text-white hover:bg-green-800/70 transition-all duration-200"
                  onClick={onClose}
                >
                  <IoHeartOutline className="text-green-400" size={16} />
                  <span className="flex-1 text-left">Wishlist</span>
                  {wishlistItems?.length > 0 && (
                    <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                      {wishlistItems.length}
                    </span>
                  )}
                </Link>
              </>
            ) : (
              <Link
                to="/signin"
                className="flex items-center w-full gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-green-200 hover:text-white hover:bg-green-800/70 transition-all duration-200"
                onClick={onClose}
              >
                <IoPersonOutline className="text-green-400" size={16} />
                <span className="flex-1 text-left">Sign In</span>
              </Link>
            )}
          </div>

          {/* Logout Button */}
          {isAuthenticated && (
            <div className="border-t border-green-800 mt-1 pt-1">
              <button
                onClick={onLogout}
                className="flex items-center w-full gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
              >
                <IoLogOutOutline className="text-red-400" size={16} />
                <span className="flex-1 text-left">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserMenu;