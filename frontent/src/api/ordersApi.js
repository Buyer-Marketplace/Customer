import axiosInstance from './axios';
import API_ENDPOINTS from '../config/apiEndpoints';

/**
 * Orders API Service
 * Handles all order-related API calls
 * Base URL: http://localhost:3000/api
 * All endpoints are Protected - Require Authorization header
 */
const ordersApi = {
  /**
   * Get My Orders
   * GET /api/buyer/orders
   * Protected - Requires Authentication
   * 
   * Response: {
   *   "data": [
   *     {
   *       "id": 105,
   *       "marketplace_item_id": 10,
   *       "crop_name": "Maize",
   *       "quantity_ordered_kg": 50.00,
   *       "total_price": 2400.00,
   *       "transaction_date": "2026-03-17T14:30:00Z",
   *       "escrow_status": "Paid",
   *       "mpesa_receipt_no": "RFT12345XYZ",
   *       "motorspeed_tracking_id": "MS-987654",
   *       "delivery_address": "123 Moi Avenue, Nairobi"
   *     }
   *   ]
   * }
   */
  getMyOrders: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.ORDERS.MY_ORDERS);
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  /**
   * Place an Order (M-Pesa STK Push)
   * POST /api/buyer/orders/place
   * Protected - Requires Authentication
   * 
   * Body: {
   *   "marketplace_item_id": 10,
   *   "quantity_ordered_kg": 50.00,
   *   "payment_phone_number": "254712345678",
   *   "delivery_address": "123 Moi Avenue, Nairobi",
   *   "notes": "Please deliver in the morning."
   * }
   * 
   * Response: {
   *   "message": "Order placed successfully",
   *   "data": {
   *     "id": 105,
   *     "checkout_request_id": "ws_CO_123456789"
   *   }
   * }
   */
  placeOrder: async (orderData) => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.ORDERS.PLACE,
        {
          marketplace_item_id: orderData.marketplaceItemId,
          quantity_ordered_kg: orderData.quantity,
          payment_phone_number: orderData.phoneNumber,
          delivery_address: orderData.deliveryAddress,
          notes: orderData.notes || '',
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  },

  /**
   * Get Order Status Helper
   * Returns color based on escrow_status
   */
  getOrderStatusColor: (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'paid':
        return 'success';
      case 'delivered':
        return 'info';
      default:
        return 'default';
    }
  },

  /**
   * Get Listing Status Helper
   * Returns color based on listing_status
   */
  getListingStatusColor: (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'hidden':
        return 'warning';
      case 'sold out':
        return 'danger';
      default:
        return 'default';
    }
  },
};

export default ordersApi;