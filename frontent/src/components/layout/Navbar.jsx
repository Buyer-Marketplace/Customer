import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import {
  IoSearch,
  IoCartOutline,
  IoHeartOutline,
  IoPersonOutline,
  IoMenu,
  IoClose,
  IoLeaf,
  IoChevronDown,
  IoLogOutOutline,
  IoReceiptOutline,
  IoPersonCircleOutline
} from 'react-icons/io5';

// Animation styles
const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.2s ease-out;
  }
  
  .animate-slideDown {
    animation: slideDown 0.25s ease-out;
  }
`;

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const { wishlistItems } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu and dropdown when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsDropdownOpen(false);
  };

  const navLinks = [
    { name: 'Products', path: '/products' },
    { name: 'Categories', path: '/categories' },
    { name: 'Pre-Orders', path: '/preorders' },
    { name: 'Harvest Calendar', path: '/harvest-calendar' },
  ];

  return (
    <>
      <style>{animationStyles}</style>
      
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-green-950/95 backdrop-blur-md shadow-lg border-b border-green-800' 
            : 'bg-green-950 border-b border-green-800/50'
        }`}
      >
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo - Home Toggle */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 group"
              aria-label="Go to homepage"
            >
              <div className="relative">
                <IoLeaf className="text-green-400 text-2xl md:text-3xl group-hover:text-green-300 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-bold text-white group-hover:text-green-300 transition-colors leading-tight">
                  Agritrace
                </span>
                <span className="text-[10px] md:text-xs text-green-500/70 group-hover:text-green-400/90 transition-colors -mt-1">
                  Market
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 lg:px-4 py-2 rounded-xl text-sm lg:text-base font-medium transition-all duration-300 whitespace-nowrap relative group ${
                      isActive
                        ? 'text-white'
                        : 'text-green-300/80 hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute inset-0 bg-green-800 rounded-xl -z-10"></span>
                    )}
                    <span className="relative z-10">{link.name}</span>
                    {!isActive && (
                      <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300"></span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-4 lg:mx-8">
              <div className="relative w-full group">
                <input
                  type="text"
                  placeholder="Search fresh crops..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2.5 pl-4 pr-12 bg-green-900 border border-green-700 rounded-xl text-white placeholder-green-500/50 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 group-hover:border-green-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-green-400 hover:text-white hover:bg-green-800 rounded-lg transition-all duration-300"
                  aria-label="Search"
                >
                  <IoSearch size={18} />
                </button>
              </div>
            </form>

            {/* Icons */}
            <div className="flex items-center space-x-2 md:space-x-3">
              {/* Wishlist */}
              <Link 
                to="/wishlist" 
                className="relative p-2 text-green-300 hover:text-white hover:bg-green-800 rounded-xl transition-all duration-300 group"
                aria-label="Wishlist"
              >
                <IoHeartOutline size={22} className="md:text-2xl group-hover:scale-110 transition-transform" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center shadow-lg animate-pulse">
                    {wishlistItems.length > 9 ? '9+' : wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link 
                to="/cart" 
                className="relative p-2 text-green-300 hover:text-white hover:bg-green-800 rounded-xl transition-all duration-300 group"
                aria-label="Cart"
              >
                <IoCartOutline size={22} className="md:text-2xl group-hover:scale-110 transition-transform" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center shadow-lg animate-pulse">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Link>

              {/* User Menu - Improved Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 p-2 text-green-300 hover:text-white hover:bg-green-800 rounded-xl transition-all duration-300 group"
                  aria-label="User menu"
                  aria-expanded={isDropdownOpen}
                >
                  <IoPersonOutline size={22} className="md:text-2xl group-hover:scale-110 transition-transform" />
                  <span className="hidden lg:inline text-sm font-medium">
                    {user?.name?.split(' ')[0] || 'Account'}
                  </span>
                  <IoChevronDown 
                    className={`hidden lg:block w-4 h-4 transition-transform duration-300 ${
                      isDropdownOpen ? 'rotate-180 text-green-400' : ''
                    }`} 
                  />
                </button>
                
                {/* Improved Dropdown Menu - Card Style */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-gradient-to-b from-green-950 to-green-900 border border-green-800 rounded-xl shadow-2xl py-2 z-50 animate-slideDown backdrop-blur-lg">
                    {/* Decorative top arrow */}
                    <div className="absolute -top-2 right-6 w-4 h-4 bg-green-950 border-l border-t border-green-800 transform rotate-45 rounded-tl-sm"></div>
                    
                    {/* User Info Section */}
                    <div className="px-4 py-3 border-b border-green-800 bg-gradient-to-r from-green-900/50 to-transparent">
                      {isAuthenticated ? (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {user?.name?.charAt(0) || <IoPersonOutline className="w-5 h-5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                            <p className="text-xs text-green-400/70 truncate">{user?.email}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-2">
                          <p className="text-sm font-medium text-white">Welcome!</p>
                          <p className="text-xs text-green-400/70">Sign in to access your account</p>
                        </div>
                      )}
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      {isAuthenticated ? (
                        <>
                          <Link
                            to="/orders"
                            className="flex items-center w-full gap-3 px-4 py-2.5 text-sm text-green-200 hover:text-white hover:bg-green-800/70 transition-all duration-200"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <IoReceiptOutline className="text-green-400" size={18} />
                            <span className="flex-1 text-left">My Orders</span>
                          </Link>
                          <Link
                            to="/profile"
                            className="flex items-center w-full gap-3 px-4 py-2.5 text-sm text-green-200 hover:text-white hover:bg-green-800/70 transition-all duration-200"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <IoPersonCircleOutline className="text-green-400" size={18} />
                            <span className="flex-1 text-left">Profile</span>
                          </Link>
                        </>
                      ) : (
                        <Link
                          to="/signin"
                          className="flex items-center w-full gap-3 px-4 py-2.5 text-sm text-green-200 hover:text-white hover:bg-green-800/70 transition-all duration-200"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <IoPersonOutline className="text-green-400" size={18} />
                          <span className="flex-1 text-left">Sign In / Register</span>
                        </Link>
                      )}
                    </div>

                    {/* Logout Button - Only for authenticated users */}
                    {isAuthenticated && (
                      <div className="border-t border-green-800 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
                        >
                          <IoLogOutOutline className="text-red-400" size={18} />
                          <span className="flex-1 text-left">Logout</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-green-300 hover:text-white hover:bg-green-800 rounded-xl transition-all duration-300"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMenuOpen ? <IoClose size={24} /> : <IoMenu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu - Improved styling */}
          <div 
            className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="py-4 space-y-3 border-t border-green-800">
              {/* Mobile Search - Improved */}
              <form onSubmit={handleSearch} className="px-2">
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Search fresh crops..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 pl-4 pr-12 bg-green-900 border border-green-700 rounded-xl text-white placeholder-green-500/50 focus:ring-2 focus:ring-green-500 focus:border-transparent group-hover:border-green-500 transition-all duration-300"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-green-400 hover:text-white hover:bg-green-800 rounded-lg transition-all duration-300"
                    aria-label="Search"
                  >
                    <IoSearch size={18} />
                  </button>
                </div>
              </form>

              {/* Mobile Navigation Links - Improved */}
              <div className="px-2 space-y-1">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                        isActive
                          ? 'bg-green-800 text-white'
                          : 'text-green-300/80 hover:text-white hover:bg-green-800/60'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>

              {/* Mobile Auth Links - Improved */}
              {!isAuthenticated && (
                <div className="px-2 pt-2">
                  <Link
                    to="/signin"
                    className="block px-4 py-3 text-base font-medium text-green-300/80 hover:text-white hover:bg-green-800/60 rounded-xl transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In / Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;