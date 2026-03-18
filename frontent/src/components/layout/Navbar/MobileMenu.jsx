import React from 'react';
import { Link } from 'react-router-dom';
import {
  IoPersonOutline,
  IoReceiptOutline,
  IoPersonCircleOutline,
  IoHeartOutline,
  IoLogOutOutline
} from 'react-icons/io5';

const MobileMenu = ({ isOpen, isAuthenticated, user, wishlistItems, navLinks, onClose, onLogout, menuRef }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop blur overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-md z-40 animate-fadeIn"
        onClick={onClose}
      />

      {/* Menu Card */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 w-full max-w-sm h-screen overflow-y-auto z-50 transform transition-all duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Card Content */}
        <div className="bg-gradient-to-b from-green-950 to-green-900 border-l border-green-800 shadow-2xl h-full">
          <div className="p-5">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-green-400 hover:text-white p-2 hover:bg-green-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* User Info Section */}
            {isAuthenticated && (
              <div className="mb-6 pb-4 border-b border-green-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
                    {user?.full_name?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || <IoPersonOutline className="w-6 h-6" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{user?.full_name || user?.name}</p>
                    <p className="text-xs text-green-400/70 truncate">{user?.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Welcome Section */}
            {!isAuthenticated && (
              <div className="mb-6 pb-4 border-b border-green-800 text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white">
                  <IoPersonOutline className="w-8 h-8" />
                </div>
                <p className="text-sm font-medium text-white">Welcome to AgriTrace!</p>
                <p className="text-xs text-green-400/70 mt-1">Sign in with Google</p>
              </div>
            )}

            {/* Navigation Links */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-green-400/70 uppercase tracking-wider mb-2">
                Navigation
              </p>
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="flex items-center px-3 py-3 rounded-xl text-sm font-medium text-green-300/80 hover:text-white hover:bg-green-800/60 transition-all duration-300"
                    onClick={onClose}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Account Section */}
            <div>
              <p className="text-xs font-semibold text-green-400/70 uppercase tracking-wider mb-2">
                Account
              </p>
              <div className="space-y-1">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/orders"
                      className="flex items-center gap-3 px-3 py-3 text-sm text-green-300/80 hover:text-white hover:bg-green-800/60 rounded-xl transition-all duration-300"
                      onClick={onClose}
                    >
                      <IoReceiptOutline className="text-green-400" size={18} />
                      <span>My Orders</span>
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-3 py-3 text-sm text-green-300/80 hover:text-white hover:bg-green-800/60 rounded-xl transition-all duration-300"
                      onClick={onClose}
                    >
                      <IoPersonCircleOutline className="text-green-400" size={18} />
                      <span>Profile</span>
                    </Link>
                    <Link
                      to="/wishlist"
                      className="flex items-center gap-3 px-3 py-3 text-sm text-green-300/80 hover:text-white hover:bg-green-800/60 rounded-xl transition-all duration-300"
                      onClick={onClose}
                    >
                      <IoHeartOutline className="text-green-400" size={18} />
                      <span>Wishlist</span>
                      {wishlistItems?.length > 0 && (
                        <span className="ml-auto text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                          {wishlistItems.length}
                        </span>
                      )}
                    </Link>
                    
                    {/* Logout Button */}
                    <button
                      onClick={() => {
                        onLogout();
                        onClose();
                      }}
                      className="flex items-center w-full gap-3 px-3 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-300 mt-2"
                    >
                      <IoLogOutOutline className="text-red-400" size={18} />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <Link
                    to="/signin"
                    className="flex items-center gap-3 px-3 py-3 text-sm text-green-300/80 hover:text-white hover:bg-green-800/60 rounded-xl transition-all duration-300"
                    onClick={onClose}
                  >
                    <IoPersonOutline className="text-green-400" size={18} />
                    <span>Sign In with Google</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;