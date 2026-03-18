import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './ui/Loader';
import toast from 'react-hot-toast';

/**
 * ProtectedRoute Component
 * 
 * Protects routes that require authentication.
 * Redirects unauthenticated users to signin page while saving their intended destination.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The protected component to render
 * @param {string} [props.redirectTo='/signin'] - Where to redirect unauthenticated users
 * @param {Array} [props.requiredRoles] - Optional array of roles required to access
 * @param {boolean} [props.requirePhone=false] - Whether user must have phone number
 * @param {string} [props.fallbackPath='/'] - Fallback if user doesn't have required role
 * @param {string} [props.redirectToProfile='/profile'] - Where to redirect for phone verification
 * 
 * @returns {React.ReactElement}
 */
const ProtectedRoute = ({ 
  children, 
  redirectTo = '/signin',
  requiredRoles = [],
  requirePhone = false,
  fallbackPath = '/',
  redirectToProfile = '/profile'
}) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  // Show loader while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-green-950 flex items-center justify-center">
        <Loader 
          size="xl" 
          showLogo={true} 
          text="Verifying authentication..." 
          withSpinner={true}
        />
      </div>
    );
  }

  // Not authenticated - redirect to signin with return location
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ 
          from: location,
          message: 'Please sign in to access this page'
        }} 
        replace 
      />
    );
  }

  // Check role-based access if required
  if (requiredRoles.length > 0) {
    const userRole = user?.role_name?.toLowerCase();
    const hasRequiredRole = requiredRoles.some(role => 
      role.toLowerCase() === userRole
    );

    if (!hasRequiredRole) {
      toast.error('You do not have permission to access this page');
      return (
        <Navigate 
          to={fallbackPath} 
          state={{ 
            message: 'You do not have permission to access this page' 
          }} 
          replace 
        />
      );
    }
  }

  // Check if phone number is required for certain actions (e.g., checkout)
  if (requirePhone && !user?.phone_number) {
    return (
      <Navigate 
        to={redirectToProfile} 
        state={{ 
          from: location,
          requirePhone: true,
          message: 'Please add your phone number to continue with checkout'
        }} 
        replace 
      />
    );
  }

  // Authenticated and authorized - render the protected component
  return children;
};

export default ProtectedRoute;