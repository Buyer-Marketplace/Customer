import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../ui/Button';
import { IoShieldCheckmarkOutline } from 'react-icons/io5';

const CartSummary = ({ items = 0, subtotal = 0, shipping = 0, tax = 0, onCheckout }) => {
  const navigate = useNavigate();

  const calculateTotal = () => {
    return subtotal + shipping + tax;
  };

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-900 to-green-800 backdrop-blur-sm rounded-3xl p-6 border border-green-400/20 shadow-xl sticky top-24">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center">
        <span>Order Summary</span>
        <span className="ml-2 text-sm font-normal text-green-300 bg-green-800/50 px-2 py-1 rounded-full">
          {items} {items === 1 ? 'item' : 'items'}
        </span>
      </h2>
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-green-300">Subtotal</span>
          <span className="text-white font-medium">{formatCurrency(subtotal)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-green-300">Shipping</span>
          <span className="text-green-400 font-medium">
            {shipping === 0 ? 'Free' : formatCurrency(shipping)}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-green-300">Tax (16% VAT)</span>
          <span className="text-white">{formatCurrency(tax)}</span>
        </div>
      </div>

      <div className="border-t border-green-700 pt-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-white font-semibold">Total</span>
          <div className="text-right">
            <span className="text-2xl font-bold text-green-400">
              {formatCurrency(calculateTotal())}
            </span>
            <span className="block text-xs text-green-300/70">Incl. taxes</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleCheckout}
          className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg shadow-green-500/25"
        >
          Proceed to Checkout
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          fullWidth
          onClick={() => navigate('/products')}
          className="border-green-600 text-green-400 hover:bg-green-800/50 hover:text-white"
        >
          Continue Shopping
        </Button>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-green-300/70">
        <IoShieldCheckmarkOutline className="text-green-400" size={16} />
        <span>Secure checkout powered by M-Pesa</span>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-green-300/50 mb-2">We accept:</p>
        <div className="flex justify-center space-x-2">
          <span className="px-3 py-1 bg-green-800/50 border border-green-700 rounded-full text-xs text-green-300">
            M-Pesa
          </span>
          <span className="px-3 py-1 bg-green-800/50 border border-green-700 rounded-full text-xs text-green-300">
            Visa
          </span>
          <span className="px-3 py-1 bg-green-800/50 border border-green-700 rounded-full text-xs text-green-300">
            Mastercard
          </span>
        </div>
      </div>

      <p className="text-[10px] text-green-300/30 text-center mt-4">
        By proceeding, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
};

export default CartSummary;