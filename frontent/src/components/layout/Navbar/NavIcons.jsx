import React from 'react';
import { Link } from 'react-router-dom';
import {
  IoSearch,
  IoCartOutline,
  IoHeartOutline,
  IoPersonOutline,
  IoMenu,
  IoClose
} from 'react-icons/io5';

const NavIcons = ({
  isAuthenticated,
  user,
  wishlistItems,
  itemCount,
  toggleDropdown,
  toggleSearch,
  toggleMenu,
  isMenuOpen,
  dropdownRef,
  isSearchOpen
}) => {
  return (
    <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 flex-shrink-0">
      {/* Search Toggle - visible on lg and below (hides on xl where desktop search appears) */}
      <button
        onClick={toggleSearch}
        className="xl:hidden p-1.5 sm:p-2 text-green-300 hover:text-white hover:bg-green-800 rounded-lg transition-all duration-300"
        aria-label="Toggle search"
      >
        <IoSearch size={18} className="sm:w-5 sm:h-5" />
      </button>

      {/* Wishlist */}
      <Link 
        to="/wishlist" 
        className="relative p-1.5 sm:p-2 text-green-300 hover:text-white hover:bg-green-800 rounded-lg transition-all duration-300 group"
        aria-label="Wishlist"
      >
        <IoHeartOutline size={18} className="sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
        {wishlistItems?.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center shadow-lg">
            {wishlistItems.length > 9 ? '9+' : wishlistItems.length}
          </span>
        )}
      </Link>

      {/* Cart */}
      <Link 
        to="/cart" 
        className="relative p-1.5 sm:p-2 text-green-300 hover:text-white hover:bg-green-800 rounded-lg transition-all duration-300 group"
        aria-label="Cart"
      >
        <IoCartOutline size={18} className="sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center shadow-lg">
            {itemCount > 9 ? '9+' : itemCount}
          </span>
        )}
      </Link>

      {/* User Menu */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="p-1.5 sm:p-2 text-green-300 hover:text-white hover:bg-green-800 rounded-lg transition-all duration-300 group"
          aria-label="User menu"
        >
          <IoPersonOutline size={18} className="sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Mobile Menu Button - visible on lg and below */}
      <button
        onClick={toggleMenu}
        className="lg:hidden p-1.5 sm:p-2 text-green-300 hover:text-white hover:bg-green-800 rounded-lg transition-all duration-300 relative z-50"
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
      >
        {isMenuOpen ? <IoClose size={18} className="sm:w-5 sm:h-5" /> : <IoMenu size={18} className="sm:w-5 sm:h-5" />}
      </button>
    </div>
  );
};

export default NavIcons;