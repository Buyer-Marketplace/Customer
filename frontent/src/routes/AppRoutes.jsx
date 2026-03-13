import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
import Loader from '../components/ui/Loader';

// Lazy load pages
const Home = React.lazy(() => import('../pages/Home'));
const Products = React.lazy(() => import('../pages/Products'));
const ProductDetails = React.lazy(() => import('../pages/ProductDetails'));
const Categories = React.lazy(() => import('../pages/Categories'));
const CategoryProducts = React.lazy(() => import('../pages/CategoryProducts'));
const PreOrders = React.lazy(() => import('../pages/PreOrders'));
const HarvestCalendar = React.lazy(() => import('../pages/HarvestCalendarPage')); // Fixed: added "Page"
const Cart = React.lazy(() => import('../pages/Cart'));
const Checkout = React.lazy(() => import('../pages/Checkout'));
const Orders = React.lazy(() => import('../pages/Orders'));
const OrderDetails = React.lazy(() => import('../pages/OrderDetails'));
const FarmerProfile = React.lazy(() => import('../pages/FarmerProfile'));
const Wishlist = React.lazy(() => import('../pages/Wishlist'));
const SignIn = React.lazy(() => import('../pages/SignIn'));
const SignUp = React.lazy(() => import('../pages/SignUp'));
const NotFound = React.lazy(() => import('../pages/NotFound'));

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <Loader fullScreen />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: window.location.pathname }} replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <React.Suspense fallback={<Loader fullScreen />}>
      <Routes>
        {/* Public Routes (no layout) */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Main Layout Routes */}
        <Route element={<MainLayout />}>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:id" element={<CategoryProducts />} />
          <Route path="/preorders" element={<PreOrders />} />
          <Route path="/harvest-calendar" element={<HarvestCalendar />} />
          <Route path="/farmers/:id" element={<FarmerProfile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          
          {/* Protected Pages */}
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
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
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </React.Suspense>
  );
};

export default AppRoutes;