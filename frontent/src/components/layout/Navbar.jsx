import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-dark-bg border-b border-gray-200 dark:border-dark-border transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section - Logo and Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link to="/" className="text-xl font-bold">
              <span className="text-gray-900 dark:text-white">Harvest</span>
              <span className="text-primary">Home</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/shop" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm font-medium">
                Shop All
              </Link>
              <Link to="/calendar" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm font-medium">
                Harvest Calendar
              </Link>
              <Link to="/our-story" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm font-medium">
                Our Story
              </Link>
              <Link to="/wholesale" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm font-medium">
                Wholesale
              </Link>
            </div>
          </div>

          {/* Right section - Search, Sign In, Cart, Notification, Theme */}
          <div className="flex items-center space-x-4">
            {/* Search Input */}
            <div className="hidden lg:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-64 px-4 py-1.5 pl-9 text-sm border border-gray-300 dark:border-dark-border rounded-full bg-gray-50 dark:bg-dark-card text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <svg className="absolute left-3 top-2 h-4 w-4 text-gray-400 dark:text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Mobile search icon (visible on mobile) */}
            <button className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-primary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Sign In */}
            <Link to="/signin" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm font-medium hidden sm:block">
              Sign In
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2">
              <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-xs rounded-full flex items-center justify-center">3</span>
            </Link>

            {/* Notification Icon */}
            <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;