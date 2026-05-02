import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
import Loader from '../components/ui/Loader';
import ProtectedRoute from '../components/ProtectedRoute';

// Lazy load pages
const Home = React.lazy(() => import('../pages/Home'));
const Crops = React.lazy(() => import('../pages/Crops'));
const CropDetails = React.lazy(() => import('../pages/CropDetails'));
const Marketplace = React.lazy(() => import('../pages/Marketplace'));
const MarketplaceItemDetails = React.lazy(() => import('../pages/MarketplaceItemDetails'));
const Categories = React.lazy(() => import('../pages/Categories'));
const CategoryCrops = React.lazy(() => import('../pages/CategoryCrops'));
const Cart = React.lazy(() => import('../pages/Cart'));
const Checkout = React.lazy(() => import('../pages/Checkout'));
const Orders = React.lazy(() => import('../pages/Orders'));
const OrderDetails = React.lazy(() => import('../pages/OrderDetails'));
const Wishlist = React.lazy(() => import('../pages/Wishlist'));
const Profile = React.lazy(() => import('../pages/Profile'));

// Pre-order pages
const PreOrders = React.lazy(() => import('../pages/PreOrders'));
const PreOrderDetails = React.lazy(() => import('../pages/PreOrderDetails'));

// Harvest Calendar
const HarvestCalendarPage = React.lazy(() => import('../pages/HarvestCalendarPage'));

// Location Page
const Location = React.lazy(() => import('../pages/Location'));

// Auth pages
const SignIn = React.lazy(() => import('../pages/SignIn'));
const SignUp = React.lazy(() => import('../pages/SignUp'));

// 404
const NotFound = React.lazy(() => import('../pages/NotFound'));

// Public Route - redirects to home if already authenticated
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <Loader fullScreen showLogo={true} text="Loading..." withSpinner={true} size="lg" />;
  }
  
  // If user is already authenticated and trying to access signin/signup, redirect to home or the page they came from
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }
  
  return children;
};

// Enhanced Suspense fallback with better loader
const PageLoader = () => (
  <div className="min-h-screen bg-green-950 flex items-center justify-center">
    <Loader 
      size="xl" 
      showLogo={true} 
      text="Loading page..." 
      withSpinner={true}
    />
  </div>
);

const AppRoutes = () => {
  return (
    <React.Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ========== PUBLIC AUTH ROUTES ========== */}
        <Route path="/signin" element={
          <PublicRoute>
            <SignIn />
          </PublicRoute>
        } />
        <Route path="/signup" element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        } />
        
        {/* ========== MAIN LAYOUT ROUTES ========== */}
        <Route element={<MainLayout />}>
          
          {/* ========== PUBLIC PAGES ========== */}
          {/* Home */}
          <Route path="/" element={<Home />} />
          
          {/* Crops */}
          <Route path="/crops" element={<Crops />} />
          <Route path="/crops/:id" element={<CropDetails />} />
          
          {/* Marketplace */}
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/marketplace/item/:id" element={<MarketplaceItemDetails />} />
          <Route path="/listing/:id" element={<MarketplaceItemDetails />} />
          
          {/* Categories */}
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:id" element={<CategoryCrops />} />
          
          {/* Cart - Public (local storage based) */}
          <Route path="/cart" element={<Cart />} />
          
          {/* Wishlist - Public (local storage based) */}
          <Route path="/wishlist" element={<Wishlist />} />
          
          {/* Pre-Orders */}
          <Route path="/preorders" element={<PreOrders />} />
          <Route path="/preorders/:id" element={<PreOrderDetails />} />
          
          {/* Harvest Calendar */}
          <Route path="/harvest-calendar" element={<HarvestCalendarPage />} />
          
          {/* Location Page */}
          <Route path="/location" element={<Location />} />
          
          {/* ========== PROTECTED PAGES ========== */}
          
          {/* Profile - requires authentication only */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          <Route path="/checkout" element={
            <ProtectedRoute requirePhone={false}>
              <Checkout />
            </ProtectedRoute>
          } />
          
          {/* Orders - requires authentication */}
          <Route path="/orders" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />
          <Route path="/orders/:id" element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          } />
        </Route>
        
        {/* ========== 404 ROUTE ========== */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </React.Suspense>
  );
};

export default AppRoutes;