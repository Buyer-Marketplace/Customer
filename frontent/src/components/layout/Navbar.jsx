import React, { useState, useEffect } from 'react';
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
  IoLeaf
} from 'react-icons/io5';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
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
  };

  const navLinks = [
    { name: 'Products', path: '/products' },
    { name: 'Categories', path: '/categories' },
    { name: 'Pre-Orders', path: '/preorders' },
    { name: 'Harvest Calendar', path: '/harvest-calendar' },
  ];

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-green-950/95 backdrop-blur-md shadow-lg border-b border-green-800' 
          : 'bg-green-950 border-b border-green-800/50'
      }`}
    >
      <div className="container-custom">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo - Home Toggle */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
            aria-label="Go to homepage"
          >
            <IoLeaf className="text-green-400 text-2xl md:text-3xl group-hover:text-green-300 transition-colors" />
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-bold text-white group-hover:text-green-300 transition-colors leading-tight">
                Agritrace
              </span>
              <span className="text-xs text-green-500/70 -mt-1">Market</span>
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
                  className={`px-3 lg:px-4 py-2 rounded-xl text-sm lg:text-base font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-green-800 text-white'
                      : 'text-green-300/80 hover:text-white hover:bg-green-800/60'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-4 lg:mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search fresh crops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2.5 pl-4 pr-12 bg-green-900 border border-green-700 rounded-xl text-white placeholder-green-500/50 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
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
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center shadow-lg">
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
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center shadow-lg">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button 
                  className="flex items-center space-x-2 p-2 text-green-300 hover:text-white hover:bg-green-800 rounded-xl transition-all duration-300"
                  aria-label="User menu"
                >
                  <IoPersonOutline size={22} className="md:text-2xl" />
                  <span className="hidden lg:inline text-sm font-medium">
                    {user?.name?.split(' ')[0] || 'User'}
                  </span>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-green-950 border border-green-800 rounded-xl shadow-2xl py-2 hidden group-hover:block hover:block transition-all duration-300">
                  <div className="px-4 py-2 border-b border-green-800">
                    <p className="text-sm font-medium text-white">{user?.name}</p>
                    <p className="text-xs text-green-400/70">{user?.email}</p>
                  </div>
                  <Link 
                    to="/orders" 
                    className="block px-4 py-2.5 text-sm text-green-300 hover:text-white hover:bg-green-800/70 transition-colors"
                  >
                    My Orders
                  </Link>
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2.5 text-sm text-green-300 hover:text-white hover:bg-green-800/70 transition-colors"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-green-800/70 transition-colors border-t border-green-800 mt-2"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link 
                to="/signin" 
                className="flex items-center space-x-2 p-2 text-green-300 hover:text-white hover:bg-green-800 rounded-xl transition-all duration-300"
              >
                <IoPersonOutline size={22} className="md:text-2xl" />
                <span className="hidden lg:inline text-sm font-medium">Sign In</span>
              </Link>
            )}

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

        {/* Mobile Menu */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 space-y-3 border-t border-green-800">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="px-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search fresh crops..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-4 pr-12 bg-green-900 border border-green-700 rounded-xl text-white placeholder-green-500/50 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-green-400 hover:text-white"
                  aria-label="Search"
                >
                  <IoSearch size={18} />
                </button>
              </div>
            </form>

            {/* Mobile Navigation Links */}
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

            {/* Mobile Auth Links */}
            {!isAuthenticated && (
              <Link
                to="/signin"
                className="block px-4 py-3 text-base font-medium text-green-300/80 hover:text-white hover:bg-green-800/60 rounded-xl transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;