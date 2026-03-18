import React from 'react';
import { formatCurrency } from '../../utils/formatCurrency';
import { IoRemoveOutline, IoAddOutline, IoTrashOutline } from 'react-icons/io5';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (item.availableQuantity || 99)) {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className="flex items-start gap-4 py-4">
      {/* Product Image */}
      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-green-800/30">
        <img
          src={item.images?.[0] || item.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=100'}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-medium truncate">{item.name}</h3>
        {item.farmer?.name && (
          <p className="text-xs text-green-300/70 mt-1">{item.farmer.name}</p>
        )}
        <div className="flex items-center justify-between mt-2">
          <span className="text-green-400 font-bold">{formatCurrency(item.price)}</span>
          <span className="text-xs text-green-300/50">per {item.unit || 'kg'}</span>
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="w-8 h-8 rounded-full bg-green-800/30 border border-green-700/50 flex items-center justify-center text-green-300 hover:bg-green-700/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <IoRemoveOutline size={16} />
        </button>
        
        <span className="text-white font-medium w-8 text-center">{item.quantity}</span>
        
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={item.quantity >= (item.availableQuantity || 99)}
          className="w-8 h-8 rounded-full bg-green-800/30 border border-green-700/50 flex items-center justify-center text-green-300 hover:bg-green-700/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <IoAddOutline size={16} />
        </button>

        <button
          onClick={() => onRemove(item.id)}
          className="w-8 h-8 rounded-full bg-red-900/20 border border-red-700/50 flex items-center justify-center text-red-400 hover:bg-red-800/30 transition-colors ml-2"
        >
          <IoTrashOutline size={16} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;