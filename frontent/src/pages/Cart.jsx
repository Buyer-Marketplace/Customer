import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import { IoCartOutline, IoArrowBack, IoLeaf, IoHeartOutline, IoTrashOutline } from 'react-icons/io5';
import AOS from 'aos';
import 'aos/dist/aos.css';
import toast from 'react-hot-toast';
import { headerImages } from '../constants/homeConstants';

const headerGradient = "bg-gradient-to-b from-transparent via-green-950/30 to-green-950";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, itemCount, removeFromCart, updateQuantity, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { addToWishlist } = useWishlist();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
      // Validate phone number exists for M-Pesa
      if (!user?.phone_number) {
        toast.error('Please add a phone number to your profile for M-Pesa payments');
        navigate('/profile', { state: { from: '/checkout', requirePhone: true } });
        return;
      }
      navigate('/checkout');
    }
  };

  const handleMoveToWishlist = (item) => {
    addToWishlist(item);
    removeFromCart(item.id);
    toast.success('Moved to wishlist');
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
      toast.success('Cart cleared');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-green-950 flex items-center justify-center">
        <Loader size="lg" showLogo={true} text="Loading cart..." withSpinner={true} />
      </div>
    );
  }

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-green-950">
        {/* Header Image Section */}
        <div className="relative w-full h-48 sm:h-64 md:h-80 overflow-hidden">
          <img 
            src={headerImages.cart}
            alt="Shopping Cart"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className={`absolute inset-0 ${headerGradient}`}></div>
          
          {/* Header Content - Responsive */}
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="text-center text-white" data-aos="fade-down">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-1 sm:mb-2 md:mb-3 lg:mb-4">
                YOUR CART
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-green-200 max-w-2xl px-4">
                Review your items before checkout
              </p>
            </div>
          </div>
        </div>

        <div className="container-custom px-3 sm:px-4 md:px-6 py-8 sm:py-10 md:py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-green-900/30 backdrop-blur-sm rounded-xl sm:rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-12 border border-green-400/20" data-aos="fade-up">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-green-800/50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6 border border-green-400/30">
                <IoCartOutline className="text-green-400 text-3xl sm:text-4xl md:text-5xl" />
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3 md:mb-4">Your Cart is Empty</h1>
              <p className="text-xs sm:text-sm md:text-base text-green-200 mb-6 sm:mb-7 md:mb-8">
                Looks like you haven't added any fresh produce to your cart yet.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link to="/marketplace">
                  <Button variant="primary" className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm md:text-base px-4 sm:px-5 md:px-6 py-2 sm:py-2.5">
                    Browse Marketplace
                  </Button>
                </Link>
                <Link to="/preorders">
                  <Button variant="outline" className="border-2 border-green-400 text-green-300 hover:bg-green-800/30 text-xs sm:text-sm md:text-base px-4 sm:px-5 md:px-6 py-2 sm:py-2.5">
                    View Pre-Orders
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Cart with items
  return (
    <div className="min-h-screen bg-green-950">
      {/* Header Image Section */}
      <div className="relative w-full h-48 sm:h-64 md:h-80 overflow-hidden">
        <img 
          src={headerImages.cart}
          alt="Shopping Cart"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className={`absolute inset-0 ${headerGradient}`}></div>
        
        {/* Header Content - Responsive */}
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="text-center text-white" data-aos="fade-down">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-1 sm:mb-2 md:mb-3 lg:mb-4">
              YOUR CART
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-green-200 max-w-2xl px-4">
              You have {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom px-3 sm:px-4 md:px-6 py-6 sm:py-7 md:py-8">
        {/* Breadcrumb and Actions - Responsive */}
        <div className="mb-4 sm:mb-5 md:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" data-aos="fade-right">
          <Link to="/marketplace" className="inline-flex items-center text-xs sm:text-sm md:text-base text-green-300 hover:text-green-100 bg-green-950/50 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-green-400/20">
            <IoArrowBack className="mr-1 sm:mr-2" size={14} />
            Continue Shopping
          </Link>
          
          {/* Cart Actions */}
          <button
            onClick={handleClearCart}
            className="inline-flex items-center text-xs sm:text-sm text-red-400 hover:text-red-300 bg-red-950/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-red-400/20 transition-colors"
          >
            <IoTrashOutline className="mr-1 sm:mr-2" size={14} />
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2" data-aos="fade-right">
            <div className="bg-green-900/30 backdrop-blur-sm rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 border border-green-400/20">
              {cartItems.map((item, index) => (
                <div key={item.id} data-aos="fade-up" data-aos-delay={index * 100}>
                  <CartItem
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                  
                  {/* Item Actions */}
                  <div className="flex justify-end gap-3 mt-1 sm:mt-2 mb-3 sm:mb-4">
                    <button
                      onClick={() => handleMoveToWishlist(item)}
                      className="text-xs sm:text-sm text-green-400 hover:text-green-300 flex items-center gap-1 transition-colors"
                    >
                      <IoHeartOutline size={14} className="sm:w-4 sm:h-4" />
                      Move to Wishlist
                    </button>
                  </div>
                  
                  {index < cartItems.length - 1 && (
                    <div className="border-b border-green-800 my-3 sm:my-4"></div>
                  )}
                </div>
              ))}
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
            
            {/* M-Pesa Info */}
            <div className="mt-3 sm:mt-4 bg-green-900/30 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-green-400/20">
              <p className="text-xs text-green-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full"></span>
                M-Pesa payments only
              </p>
              <p className="text-[10px] sm:text-xs text-green-300/70 mt-1 sm:mt-2">
                You'll receive an STK push on {user?.phone_number || 'your registered phone'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;