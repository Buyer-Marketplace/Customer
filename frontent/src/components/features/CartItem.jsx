import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';
import { IoClose, IoAdd, IoRemove } from 'react-icons/io5';
import { useTheme } from '../../context/ThemeContext';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const { isDark } = useTheme();

  const handleIncrement = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    onUpdateQuantity(item.id, item.quantity - 1);
  };

  return (
    <div className={`flex py-4 border-b dark:border-dark-border last:border-b-0 transition-colors duration-300 ${isDark ? 'dark' : ''}`}>
      {/* Product Image */}
      <Link to={`/products/${item.id}`} className="flex-shrink-0 w-24 h-24">
        <img
          src={item.images?.[0] || 'https://via.placeholder.com/100x100?text=No+Image'}
          alt={item.name}
          className="w-full h-full object-cover rounded-lg"
        />
      </Link>

      {/* Product Details */}
      <div className="flex-1 ml-4">
        <div className="flex justify-between">
          <div>
            <Link to={`/products/${item.id}`} className="hover:text-primary">
              <h3 className="font-semibold text-gray-900 dark:text-white">{item.name}</h3>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {item.farmer?.farmName || item.farmer?.name || 'Unknown Farmer'}
            </p>
          </div>
          <button
            onClick={() => onRemove(item.id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <IoClose size={20} />
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center border rounded-lg dark:border-dark-border">
            <button
              onClick={handleDecrement}
              disabled={item.quantity <= 1}
              className="p-1 hover:bg-gray-100 dark:hover:bg-dark-border disabled:opacity-50 disabled:cursor-not-allowed dark:text-white"
            >
              <IoRemove size={16} />
            </button>
            <span className="w-8 text-center dark:text-white">{item.quantity}</span>
            <button
              onClick={handleIncrement}
              disabled={item.quantity >= item.availableQuantity}
              className="p-1 hover:bg-gray-100 dark:hover:bg-dark-border disabled:opacity-50 disabled:cursor-not-allowed dark:text-white"
            >
              <IoAdd size={16} />
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <div className="font-semibold text-primary">
              {formatCurrency(item.price * item.quantity)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {formatCurrency(item.price)} per {item.unit}
            </div>
          </div>
        </div>

        {/* Stock Warning */}
        {item.quantity >= item.availableQuantity && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">
            Max quantity reached
          </p>
        )}
      </div>
    </div>
  );
};

export default CartItem;