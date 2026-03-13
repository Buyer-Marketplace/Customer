import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';

const OrderSummary = ({ items, total, subtotal, shipping, tax, onCheckout }) => {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const calculateTotal = () => {
    return subtotal + (shipping || 0) + (tax || 0);
  };

  return (
    <div className={`bg-white dark:bg-dark-card rounded-lg shadow-md p-6 sticky top-24 transition-colors duration-300 ${isDark ? 'dark' : ''}`}>
      <h3 className="text-lg font-semibold dark:text-white mb-4">Order Summary</h3>
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
          <span className="font-medium dark:text-white">{formatCurrency(subtotal)}</span>
        </div>
        
        {shipping !== undefined && (
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Shipping</span>
            <span className="font-medium dark:text-white">
              {shipping === 0 ? 'Free' : formatCurrency(shipping)}
            </span>
          </div>
        )}
        
        {tax !== undefined && (
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Tax</span>
            <span className="font-medium dark:text-white">{formatCurrency(tax)}</span>
          </div>
        )}
        
        <div className="border-t dark:border-dark-border pt-3">
          <div className="flex justify-between font-bold">
            <span className="dark:text-white">Total</span>
            <span className="text-primary text-xl">
              {formatCurrency(calculateTotal())}
            </span>
          </div>
        </div>
      </div>

      {/* Item Count */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {items} {items === 1 ? 'item' : 'items'} in cart
      </p>

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={onCheckout}
        >
          Proceed to Checkout
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          fullWidth
          onClick={() => navigate('/products')}
        >
          Continue Shopping
        </Button>
      </div>

      {/* Payment Methods */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">We accept:</p>
        <div className="flex justify-center space-x-2">
          <span className="px-2 py-1 bg-gray-100 dark:bg-dark-border rounded text-xs dark:text-gray-300">M-Pesa</span>
          <span className="px-2 py-1 bg-gray-100 dark:bg-dark-border rounded text-xs dark:text-gray-300">Visa</span>
          <span className="px-2 py-1 bg-gray-100 dark:bg-dark-border rounded text-xs dark:text-gray-300">Mastercard</span>
        </div>
      </div>

      {/* Secure Checkout Notice */}
      <div className="mt-4 pt-4 border-t dark:border-dark-border text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          🔒 Secure checkout powered by SSL encryption
        </p>
      </div>
    </div>
  );
};

export default OrderSummary;