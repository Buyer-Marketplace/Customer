import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { IoLeaf } from 'react-icons/io5';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-green-950 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {/* 404 Illustration */}
        <div className="relative mb-8">
          <div className="text-9xl font-bold text-green-800">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <IoLeaf className="text-green-400 opacity-20" size={120} />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-white mb-4">
          Page Not Found
        </h1>
        
        <p className="text-xl text-green-200 mb-8 max-w-lg mx-auto">
          Oops! The page you're looking for seems to have wandered off like a lost seed.
          Let's get you back to the farm.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button variant="primary" className="bg-green-600 hover:bg-green-700 text-white">
              Go to Homepage
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="outline" className="border-2 border-green-400 text-green-300 hover:bg-green-800/30">
              Browse Products
            </Button>
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-12">
          <p className="text-green-300/70 mb-4">Or try these popular pages:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/categories" className="text-green-400 hover:text-green-300 transition-colors">
              Categories
            </Link>
            <span className="text-green-700">•</span>
            <Link to="/preorders" className="text-green-400 hover:text-green-300 transition-colors">
              Pre-Orders
            </Link>
            <span className="text-green-700">•</span>
            <Link to="/harvest-calendar" className="text-green-400 hover:text-green-300 transition-colors">
              Harvest Calendar
            </Link>
            <span className="text-green-700">•</span>
            <Link to="/farmers" className="text-green-400 hover:text-green-300 transition-colors">
              Our Farmers
            </Link>
          </div>
        </div>

        {/* Farm Fun Fact */}
        <div className="mt-12 p-6 bg-green-900/30 backdrop-blur-sm rounded-2xl border border-green-400/20 max-w-md mx-auto">
          <p className="text-sm text-green-200">
            🌱 Did you know? A single seed can produce thousands of new seeds. 
            Just like how our marketplace helps farmers grow their business!
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;