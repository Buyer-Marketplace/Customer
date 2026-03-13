import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { IoReceipt, IoLocationOutline } from 'react-icons/io5';

const OrderCard = ({ order }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'confirmed':
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'default';
    }
  };

  return (
    <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl overflow-hidden border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
      {/* Order Header */}
      <div className="bg-green-950/50 px-6 py-4 border-b border-green-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-green-300">Order ID: #{order.id}</p>
            <p className="text-sm text-green-200/70">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant={getStatusColor(order.status)}>
              {order.status}
            </Badge>
            <p className="font-bold text-green-400">
              {formatCurrency(order.total || order.grandTotal || 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="p-6">
        <div className="space-y-4">
          {order.items && order.items.slice(0, 2).map((item) => (
            <div key={item.id} className="flex items-center space-x-4">
              <img
                src={item.product?.images?.[0] || item.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=60&h=60'}
                alt={item.product?.name || item.name}
                className="w-16 h-16 object-cover rounded-xl"
              />
              <div className="flex-1">
                <Link to={`/products/${item.product?.id || item.productId}`} className="hover:text-green-300">
                  <h4 className="font-medium text-white">{item.product?.name || item.name}</h4>
                </Link>
                <p className="text-sm text-green-300">
                  Quantity: {item.quantity} × {formatCurrency(item.price)}
                </p>
              </div>
              <p className="font-semibold text-green-400">
                {formatCurrency(item.subtotal || item.price * item.quantity)}
              </p>
            </div>
          ))}
          
          {order.items && order.items.length > 2 && (
            <p className="text-sm text-green-300 text-center">
              +{order.items.length - 2} more items
            </p>
          )}
        </div>

        {/* Order Footer */}
        <div className="mt-6 pt-4 border-t border-green-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center text-sm text-green-300">
            <IoLocationOutline className="mr-1" />
            {order.deliveryAddress?.substring(0, 30)}...
          </div>
          <div className="flex space-x-3">
            <Link to={`/orders/${order.id}`}>
              <Button variant="outline" size="sm" className="border-2 border-green-400 text-green-300 hover:bg-green-800/30">
                View Details
              </Button>
            </Link>
            {order.status === 'pending' && (
              <Button variant="danger" size="sm">
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;