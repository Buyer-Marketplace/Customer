import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { IoReceiptOutline, IoLocationOutline, IoTimeOutline } from 'react-icons/io5';

const OrderCard = ({ order }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'paid':
        return 'success';
      case 'delivered':
        return 'primary';
      default:
        return 'default';
    }
  };

  // Ensure order has required properties with fallbacks
  const safeOrder = {
    id: order?.id || 'N/A',
    marketplace_item_id: order?.marketplace_item_id,
    crop_name: order?.crop_name || 'Crop',
    quantity_ordered_kg: order?.quantity_ordered_kg || 0,
    total_price: order?.total_price || 0,
    transaction_date: order?.transaction_date || new Date().toISOString(),
    escrow_status: order?.escrow_status || 'pending',
    mpesa_receipt_no: order?.mpesa_receipt_no,
    motorspeed_tracking_id: order?.motorspeed_tracking_id,
    delivery_address: order?.delivery_address || 'No address provided',
  };

  return (
    <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl overflow-hidden border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
      {/* Order Header */}
      <div className="bg-green-950/50 px-6 py-4 border-b border-green-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-green-300">Order #{safeOrder.id}</p>
            <p className="text-sm text-green-200/70">
              {formatDate(safeOrder.transaction_date)}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant={getStatusColor(safeOrder.escrow_status)}>
              {safeOrder.escrow_status}
            </Badge>
            <p className="font-bold text-green-400">
              {formatCurrency(safeOrder.total_price)}
            </p>
          </div>
        </div>
      </div>

      {/* Order Content */}
      <div className="p-6">
        {/* Crop Info */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">{safeOrder.crop_name}</h3>
            <p className="text-sm text-green-300">
              Quantity: {safeOrder.quantity_ordered_kg} kg
            </p>
          </div>
          {safeOrder.mpesa_receipt_no && (
            <div className="text-right">
              <p className="text-xs text-green-300">M-Pesa Receipt</p>
              <p className="text-sm font-mono text-green-400">{safeOrder.mpesa_receipt_no}</p>
            </div>
          )}
        </div>

        {/* Delivery Address */}
        <div className="flex items-start gap-2 text-sm text-green-300 mb-4">
          <IoLocationOutline className="mt-0.5 flex-shrink-0" size={16} />
          <span>{safeOrder.delivery_address}</span>
        </div>

        {/* Tracking (if available) */}
        {safeOrder.motorspeed_tracking_id && (
          <div className="flex items-center gap-2 text-sm text-green-300 mb-4">
            <IoTimeOutline className="flex-shrink-0" size={16} />
            <span>Tracking: {safeOrder.motorspeed_tracking_id}</span>
          </div>
        )}

        {/* Order Footer */}
        <div className="mt-4 pt-4 border-t border-green-800 flex justify-end">
          <Link to={`/orders/${safeOrder.id}`}>
            <Button variant="outline" size="sm" className="border-2 border-green-400 text-green-300 hover:bg-green-800/30">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;