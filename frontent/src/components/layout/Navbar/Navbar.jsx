import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import NavLogo from './NavLogo';
import NavLinks from './NavLinks';
import SearchBar from './SearchBar';
import NavIcons from './NavIcons';
import UserMenu from './UserMenu';
import MobileMenu from './MobileMenu';
import { animationStyles } from './NavbarStyles';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const { wishlistItems } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  // Mock search suggestions - replace with actual API call
  const mockSuggestions = [
    'Fresh Maize',
    'Organic Tomatoes',
    'Irish Potatoes',
    'Fresh Beans',
    'Cabbage',
    'Kale (Sukuma Wiki)',
    'Onions',
    'Carrots',
    'Avocados',
    'Mangoes',
    'Oranges',
    'Bananas',
    'Coffee Beans',
    'Tea Leaves',
    'Rice',
    'Wheat Grain'
  ];

  // Handle search suggestions
  useEffect(() => {
    if (searchTerm.length > 1) {
      const filtered = mockSuggestions.filter(item =>
        item.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 6);
      setSearchSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Close mobile menu and dropdown when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
    setIsSearchOpen(false);
    setShowSuggestions(false);
  }, [location]);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
      setIsMenuOpen(false);
      setIsSearchOpen(false);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    navigate(`/marketplace?search=${encodeURIComponent(suggestion)}`);
    setShowSuggestions(false);
    setIsSearchOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  };

  // NavLinks data
  const navLinks = [
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Categories', path: '/categories' },
    { name: 'Crops', path: '/crops' },
    { name: 'Pre-Orders', path: '/preorders' },
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
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <NavLogo />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-center flex-1 max-w-2xl xl:max-w-3xl mx-4">
              <NavLinks links={navLinks} location={location} />
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 flex-shrink-0">
              {/* Desktop Search */}
              <div className="hidden xl:block w-56 2xl:w-64">
                <SearchBar 
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  handleSearch={handleSearch}
                  suggestions={searchSuggestions}
                  showSuggestions={showSuggestions}
                  onSuggestionClick={handleSuggestionClick}
                  suggestionsRef={suggestionsRef}
                  size="desktop"
                />
              </div>

              {/* Icons */}
              <NavIcons
                isAuthenticated={isAuthenticated}
                user={user}
                wishlistItems={wishlistItems}
                itemCount={itemCount}
                isDropdownOpen={isDropdownOpen}
                toggleDropdown={toggleDropdown}
                toggleSearch={toggleSearch}
                toggleMenu={toggleMenu}
                isMenuOpen={isMenuOpen}
                dropdownRef={dropdownRef}
                isSearchOpen={isSearchOpen}
              />
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="lg:hidden">
            <SearchBar 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleSearch={handleSearch}
              isOpen={isSearchOpen}
              inputRef={searchInputRef}
              suggestions={searchSuggestions}
              showSuggestions={showSuggestions}
              onSuggestionClick={handleSuggestionClick}
              suggestionsRef={suggestionsRef}
              size="mobile"
            />
          </div>
        </div>

        {/* Desktop Dropdown Menu - hidden on mobile where mobile menu takes over */}
        <UserMenu
          isOpen={isDropdownOpen}
          isAuthenticated={isAuthenticated}
          user={user}
          wishlistItems={wishlistItems}
          onClose={() => setIsDropdownOpen(false)}
          onLogout={handleLogout}
          dropdownRef={dropdownRef}
        />

        {/* Mobile Menu - only visible on md and below */}
        <MobileMenu
          isOpen={isMenuOpen}
          isAuthenticated={isAuthenticated}
          user={user}
          wishlistItems={wishlistItems}
          navLinks={navLinks}
          onClose={() => setIsMenuOpen(false)}
          onLogout={handleLogout}
          menuRef={mobileMenuRef}
        />
      </nav>
      
      {/* Spacer */}
      <div className="h-14 sm:h-16 lg:h-20" />
    </>
  );
};

export default Navbar;