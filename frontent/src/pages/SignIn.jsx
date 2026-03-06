import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GoogleButton from '../components/ui/GoogleButton';

const SignIn = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = () => {
    console.log('Google sign in clicked');
  };

  const handleBackToHome = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&auto=format"
          alt="Farm field"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Sign In Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white dark:bg-dark-card rounded-3xl shadow-xl overflow-hidden border border-primary/20 dark:border-primary/10">
          
          {/* Banner Header Image - Cropped and rounded all around */}
          <div className="relative">
            <div className="h-36 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format"
                alt="Fresh organic vegetables at farmers market"
                className="w-full h-full object-cover object-center scale-110"
              />
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
            
            {/* Decorative element - farm icon */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-dark-card">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Content with top padding to account for overlapping icon */}
          <div className="pt-10 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Sign in for Harvest Updates
              </h1>
              <p className="text-gray-600 dark:text-dark-muted">
                Stay updated on harvest cycles and delivery notifications via email.
              </p>
            </div>

            {/* Google Sign In Button */}
            <GoogleButton onClick={handleGoogleSignIn} />

            {/* Note */}
            <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-4 my-6 border border-primary/20">
              <p className="text-sm text-gray-700 dark:text-gray-200 text-center">
                Required to receive automated updates and secure your pre-order.
              </p>
            </div>

            {/* Footer Text */}
            <p className="text-xs text-gray-500 dark:text-dark-muted text-center">
              By continuing, you agree to our{' '}
              <Link to="/terms" className="text-primary hover:text-primary-dark font-medium">
                Terms of Service
              </Link>
              .
            </p>

            {/* Back to Home Link - Working with useNavigate */}
            <div className="mt-6 text-center">
              <button
                onClick={handleBackToHome}
                className="inline-flex items-center text-sm text-gray-500 dark:text-dark-muted hover:text-primary transition-colors group cursor-pointer"
              >
                <svg className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;