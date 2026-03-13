// /src/layouts/MainLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CartDrawer from '../components/cart/CartDrawer';
import { useTheme } from '../context/ThemeContext';

const MainLayout = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col bg-green-950 ${isDark ? 'dark' : ''}`}>
      <Navbar onCartClick={() => setIsCartOpen(true)} />
      
      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>
      
      <Footer />
      
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </div>
  );
};

export default MainLayout;