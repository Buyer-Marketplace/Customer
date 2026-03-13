import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import Button from '../components/ui/Button';
import { IoCartOutline, IoArrowBack, IoLeaf } from 'react-icons/io5';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Header image
const headerImage = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1600";
const headerGradient = "bg-gradient-to-b from-transparent via-green-950/30 to-green-950";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, itemCount, removeFromCart, updateQuantity, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      offset: 50,
    });
  }, []);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/signin', { state: { from: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-green-950">
        {/* Header Image Section */}
        <div className="relative w-full h-80 overflow-hidden">
          <img 
            src={headerImage}
            alt="Shopping Cart"
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 ${headerGradient}`}></div>
          
          {/* Header Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white" data-aos="fade-down">
              <h1 className="text-5xl md:text-6xl font-bold mb-4">YOUR CART</h1>
              <p className="text-xl text-green-200 max-w-2xl px-4">
                Review your items before checkout
              </p>
            </div>
          </div>
        </div>

        <div className="container-custom py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-12 border border-green-400/20" data-aos="fade-up">
              <div className="w-24 h-24 bg-green-800/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-400/30">
                <IoCartOutline className="text-green-400" size={48} />
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">Your Cart is Empty</h1>
              <p className="text-green-200 mb-8">
                Looks like you haven't added any fresh produce to your cart yet.
              </p>
              <Link to="/products">
                <Button variant="primary" size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                  Start Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-950">
      {/* Header Image Section */}
      <div className="relative w-full h-80 overflow-hidden">
        <img 
          src={headerImage}
          alt="Shopping Cart"
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 ${headerGradient}`}></div>
        
        {/* Header Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white" data-aos="fade-down">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">YOUR CART</h1>
            <p className="text-xl text-green-200 max-w-2xl px-4">
              You have {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <div className="mb-6" data-aos="fade-right">
          <Link to="/products" className="inline-flex items-center text-green-300 hover:text-green-100 bg-green-950/50 backdrop-blur-sm px-4 py-2 rounded-full border border-green-400/20">
            <IoArrowBack className="mr-2" />
            Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2" data-aos="fade-right">
            <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-6 border border-green-400/20">
              {cartItems.map((item, index) => (
                <div key={item.id} data-aos="fade-up" data-aos-delay={index * 100}>
                  <CartItem
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                  {index < cartItems.length - 1 && (
                    <div className="border-b border-green-800 my-4"></div>
                  )}
                </div>
              ))}

              {/* Cart Actions */}
              <div className="mt-6 pt-6 border-t border-green-800 flex justify-between items-center">
                <button
                  onClick={clearCart}
                  className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                >
                  Clear Cart
                </button>
                <Link to="/products" className="text-green-300 hover:text-green-100 text-sm font-medium transition-colors">
                  Add More Items
                </Link>
              </div>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1" data-aos="fade-left">
            <CartSummary
              items={itemCount}
              subtotal={cartTotal}
              shipping={0} // Free shipping
              tax={cartTotal * 0.16} // 16% VAT
              onCheckout={handleCheckout}
            />
          </div>
        </div>

        {/* Recently Viewed */}
        <div className="mt-12" data-aos="fade-up">
          <h2 className="text-2xl font-bold text-white mb-6">Recently Viewed</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-green-900/30 backdrop-blur-sm rounded-xl p-4 text-center border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
                <div className="w-16 h-16 bg-green-800/50 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <IoLeaf className="text-green-400 text-2xl" />
                </div>
                <p className="text-sm font-medium text-white">Fresh Product</p>
                <p className="text-xs text-green-300 mt-1">KES 150</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;