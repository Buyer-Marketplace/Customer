import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const PreOrderCard = ({ preorder }) => {
  const product = preorder.product;
  const harvestDate = new Date(product.harvestDate);
  const daysUntilHarvest = Math.ceil((harvestDate - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="md:w-48 h-48">
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/200x200?text=No+Image'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Link to={`/products/${product.id}`} className="hover:text-primary-600">
                <h3 className="text-xl font-semibold mb-1">{product.name}</h3>
              </Link>
              <p className="text-gray-600 mb-2">
                Farmer: {product.farmer?.farmName || product.farmer?.name}
              </p>
              
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="warning">Pre-Order</Badge>
                {product.isOrganic && <Badge variant="success">Organic</Badge>}
              </div>
            </div>

            <div className="text-right">
              <p className="text-2xl font-bold text-primary-600">
                {formatCurrency(product.price)}
              </p>
              <p className="text-sm text-gray-500">per {product.unit}</p>
            </div>
          </div>

          {/* Pre-order Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Your Order</p>
              <p className="font-semibold">{preorder.quantity} {product.unit}s</p>
              <p className="text-sm text-gray-500">
                Total: {formatCurrency(product.price * preorder.quantity)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Expected Harvest</p>
              <p className="font-semibold">{formatDate(product.harvestDate)}</p>
              <p className="text-sm text-gray-500">{daysUntilHarvest} days from now</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Status</p>
              <Badge variant={preorder.status === 'confirmed' ? 'success' : 'warning'}>
                {preorder.status}
              </Badge>
              {preorder.deposit && (
                <p className="text-xs text-gray-500 mt-1">
                  Deposit: {formatCurrency(preorder.deposit)}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-4">
            <Link to={`/products/${product.id}`}>
              <Button variant="outline" size="sm">
                View Product
              </Button>
            </Link>
            <Link to={`/preorders/${preorder.id}`}>
              <Button variant="primary" size="sm">
                Manage Pre-Order
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreOrderCard;