import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { IoLeaf } from 'react-icons/io5';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center px-4">
      <div className="text-center">
        {/* 404 Illustration */}
        <div className="relative mb-8">
          <div className="text-9xl font-bold text-primary-200">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <IoLeaf className="text-primary-600 opacity-20" size={120} />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto">
          Oops! The page you're looking for seems to have wandered off like a lost seed.
          Let's get you back to the farm.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button variant="primary" size="lg">
              Go to Homepage
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="outline" size="lg">
              Browse Products
            </Button>
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-12">
          <p className="text-gray-500 mb-4">Or try these popular pages:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/categories" className="text-primary-600 hover:text-primary-700">
              Categories
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/preorders" className="text-primary-600 hover:text-primary-700">
              Pre-Orders
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/harvest-calendar" className="text-primary-600 hover:text-primary-700">
              Harvest Calendar
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/farmers" className="text-primary-600 hover:text-primary-700">
              Our Farmers
            </Link>
          </div>
        </div>

        {/* Farm Fun Fact */}
        <div className="mt-12 p-6 bg-earth-50 rounded-lg max-w-md mx-auto">
          <p className="text-sm text-earth-800">
            🌱 Did you know? A single seed can produce thousands of new seeds. 
            Just like how our marketplace helps farmers grow their business!
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;