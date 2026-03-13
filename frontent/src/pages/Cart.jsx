import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import Button from '../components/ui/Button';
import { IoCartOutline, IoArrowBack } from 'react-icons/io5';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, itemCount, removeFromCart, updateQuantity, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/signin', { state: { from: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-md p-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <IoCartOutline className="text-gray-400" size={48} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
              <p className="text-gray-600 mb-8">
                Looks like you haven't added any products to your cart yet.
              </p>
              <Link to="/products">
                <Button variant="primary" size="lg">
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <Link to="/products" className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-4">
            <IoArrowBack className="mr-2" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            You have {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}

              {/* Cart Actions */}
              <div className="mt-6 pt-6 border-t flex justify-between items-center">
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Clear Cart
                </button>
                <Link to="/products" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Add More Items
                </Link>
              </div>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <CartSummary
              items={itemCount}
              subtotal={cartTotal}
              shipping={0} // Free shipping
              tax={cartTotal * 0.16} // 16% VAT
            />
          </div>
        </div>

        {/* Recently Viewed */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Recently Viewed</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* This would be populated with recently viewed products */}
            <div className="bg-white rounded-lg shadow p-3 text-center">
              <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-2"></div>
              <p className="text-sm font-medium">Sample Product</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;