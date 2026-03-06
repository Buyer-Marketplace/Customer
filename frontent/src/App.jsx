import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Cart from './pages/Cart';
import SignIn from './pages/SignIn';

function App() {
  const location = useLocation();
  const hideNavFooter = location.pathname === '/signin';

  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavFooter && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </main>
      {!hideNavFooter && <Footer />}
    </div>
  );
}

export default App;