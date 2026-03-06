import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const OrderSummary = ({ items }) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <Card className="sticky top-20 sm:top-24">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
        Order Summary
      </h3>
      
      <div className="space-y-3 sm:space-y-4">
        {/* Line items */}
        <div className="flex justify-between text-xs sm:text-sm text-gray-600 dark:text-dark-muted">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-xs sm:text-sm text-gray-600 dark:text-dark-muted">
          <span>Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-xs sm:text-sm text-gray-600 dark:text-dark-muted">
          <span>Estimated Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        
        <div className="border-t border-light-border dark:border-dark-border pt-3 sm:pt-4">
          <div className="flex justify-between text-base sm:text-lg font-semibold">
            <span className="text-gray-900 dark:text-white">Total</span>
            <span className="text-primary">${total.toFixed(2)}</span>
          </div>
        </div>
        
        <Button variant="primary" size="lg" className="w-full mt-4 sm:mt-6 text-sm sm:text-base">
          Proceed to Checkout
        </Button>
        
        {/* Farmer's Guarantee */}
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
          <div className="flex items-start space-x-2 sm:space-x-3">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Farmer's Guarantee</p>
              <p className="text-[10px] sm:text-xs text-gray-600 dark:text-dark-muted mt-0.5 sm:mt-1">
                Fresh from local farms. Satisfaction guaranteed or your money back.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default OrderSummary;