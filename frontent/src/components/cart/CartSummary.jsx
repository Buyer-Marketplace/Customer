import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../ui/Button';

const CartSummary = ({ items, total, subtotal, shipping, tax }) => {
  const navigate = useNavigate();

  const calculateTotal = () => {
    return subtotal + (shipping || 0) + (tax || 0);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>
        
        {shipping !== undefined && (
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium">
              {shipping === 0 ? 'Free' : formatCurrency(shipping)}
            </span>
          </div>
        )}
        
        {tax !== undefined && (
          <div className="flex justify-between">
            <span className="text-gray-600">Tax</span>
            <span className="font-medium">{formatCurrency(tax)}</span>
          </div>
        )}
        
        <div className="border-t pt-3">
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span className="text-primary-600 text-xl">
              {formatCurrency(calculateTotal())}
            </span>
          </div>
        </div>
      </div>

      {/* Item Count */}
      <p className="text-sm text-gray-600 mb-4">
        {items} {items === 1 ? 'item' : 'items'} in cart
      </p>

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => navigate('/checkout')}
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
        <p className="text-xs text-gray-500 mb-2">We accept:</p>
        <div className="flex justify-center space-x-2">
          <span className="px-2 py-1 bg-gray-100 rounded text-xs">M-Pesa</span>
          <span className="px-2 py-1 bg-gray-100 rounded text-xs">Visa</span>
          <span className="px-2 py-1 bg-gray-100 rounded text-xs">Mastercard</span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;