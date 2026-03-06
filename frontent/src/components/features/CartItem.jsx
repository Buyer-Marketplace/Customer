import React from 'react';
import Badge from '../ui/Badge';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const { id, name, price, quantity, image, harvestCycle } = item;

  return (
    <div className="flex flex-col xs:flex-row items-start xs:items-center py-4 sm:py-5 md:py-6 gap-3 sm:gap-4 animate-slide-up border-b border-light-border dark:border-dark-border last:border-0">
      {/* Image */}
      <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>

      {/* Info */}
      <div className="flex-1 w-full">
        <div className="flex flex-col xs:flex-row justify-between gap-2">
          <div>
            <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white line-clamp-1">
              {name}
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-dark-muted mt-0.5">
              ${price} each
            </p>
          </div>
          <span className="text-primary font-semibold text-sm sm:text-base">
            ${(price * quantity).toFixed(2)}
          </span>
        </div>

        <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 mt-3">
          <Badge variant="default" size="sm">{harvestCycle}</Badge>

          <div className="flex items-center justify-between w-full xs:w-auto gap-4">
            {/* Quantity controls */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                onClick={() => onUpdateQuantity(id, Math.max(0, quantity - 1))}
                className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full border border-light-border dark:border-dark-border flex items-center justify-center hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
                aria-label="Decrease quantity"
              >
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              
              <span className="w-6 sm:w-7 md:w-8 text-center text-sm sm:text-base text-gray-900 dark:text-white">
                {quantity}
              </span>
              
              <button
                onClick={() => onUpdateQuantity(id, quantity + 1)}
                className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full border border-light-border dark:border-dark-border flex items-center justify-center hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
                aria-label="Increase quantity"
              >
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            {/* Remove button */}
            <button
              onClick={() => onRemove(id)}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
              aria-label="Remove item"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;