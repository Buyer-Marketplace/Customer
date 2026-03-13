import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const OrderCard = ({ order }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'info';
      case 'processing':
        return 'primary';
      case 'shipped':
        return 'secondary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'default';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Order Header */}
      <div className="bg-gray-50 px-6 py-4 border-b">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-600">Order ID: #{order.id}</p>
            <p className="text-sm text-gray-600">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant={getStatusColor(order.status)}>
              {order.status}
            </Badge>
            <p className="font-bold text-primary-600">
              {formatCurrency(order.total)}
            </p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="p-6">
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center space-x-4">
              <img
                src={item.product.images?.[0] || 'https://via.placeholder.com/60x60'}
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <Link to={`/products/${item.product.id}`} className="hover:text-primary-600">
                  <h4 className="font-medium">{item.product.name}</h4>
                </Link>
                <p className="text-sm text-gray-600">
                  Quantity: {item.quantity} × {formatCurrency(item.price)}
                </p>
              </div>
              <p className="font-semibold">
                {formatCurrency(item.subtotal)}
              </p>
            </div>
          ))}
        </div>

        {/* Order Footer */}
        <div className="mt-6 pt-4 border-t flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-600">
              Delivery to: {order.deliveryAddress}
            </p>
            <p className="text-sm text-gray-600">
              Payment: {order.paymentMethod}
            </p>
          </div>
          <div className="flex space-x-3">
            <Link to={`/orders/${order.id}`}>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </Link>
            {order.status === 'pending' && (
              <Button variant="danger" size="sm">
                Cancel Order
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;