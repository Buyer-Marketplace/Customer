import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../api/orderApi';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { formatCurrency } from '../utils/formatCurrency';
import toast from 'react-hot-toast';
import { IoArrowBack, IoLocationOutline, IoCardOutline, IoPersonOutline } from 'react-icons/io5';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Shipping Information
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Payment Information
    paymentMethod: 'mpesa',
    mpesaPhone: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        products: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        deliveryAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
        paymentMethod: formData.paymentMethod,
        contactInfo: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
        },
      };

      const response = await orderApi.createOrder(orderData);
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/orders/${response.id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const steps = [
    { number: 1, title: 'Shipping Information', icon: IoLocationOutline },
    { number: 2, title: 'Payment Method', icon: IoCardOutline },
    { number: 3, title: 'Review Order', icon: IoPersonOutline },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <button
          onClick={() => step > 1 ? setStep(step - 1) : navigate('/cart')}
          className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-4"
        >
          <IoArrowBack className="mr-2" />
          {step > 1 ? 'Back' : 'Back to Cart'}
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((s, index) => (
              <React.Fragment key={s.number}>
                <div className="flex items-center">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center border-2
                      ${s.number === step
                        ? 'border-primary-600 bg-primary-600 text-white'
                        : s.number < step
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-gray-300 bg-white text-gray-500'
                      }
                    `}
                  >
                    {s.number < step ? '✓' : s.number}
                  </div>
                  <span className="ml-2 text-sm font-medium hidden sm:inline">
                    {s.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`
                      flex-1 h-0.5 mx-4
                      ${s.number < step ? 'bg-green-500' : 'bg-gray-300'}
                    `}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
              {/* Step 1: Shipping Information */}
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                  
                  <Input
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                  
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  
                  <Input
                    label="Phone Number"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 0712345678"
                  />
                  
                  <Input
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                    
                    <Input
                      label="State/Province"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <Input
                    label="ZIP/Postal Code"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}

              {/* Step 2: Payment Method */}
              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                  
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="mpesa"
                        checked={formData.paymentMethod === 'mpesa'}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      <div>
                        <span className="font-medium">M-Pesa</span>
                        <p className="text-sm text-gray-500">Pay via M-Pesa mobile money</p>
                      </div>
                    </label>

                    {formData.paymentMethod === 'mpesa' && (
                      <div className="ml-8 mt-3">
                        <Input
                          label="M-Pesa Phone Number"
                          name="mpesaPhone"
                          value={formData.mpesaPhone}
                          onChange={handleInputChange}
                          placeholder="e.g., 0712345678"
                          required={formData.paymentMethod === 'mpesa'}
                        />
                      </div>
                    )}

                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      <div>
                        <span className="font-medium">Credit/Debit Card</span>
                        <p className="text-sm text-gray-500">Pay with Visa, Mastercard</p>
                      </div>
                    </label>

                    {formData.paymentMethod === 'card' && (
                      <div className="ml-8 mt-3 space-y-3">
                        <Input
                          label="Card Number"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          placeholder="1234 5678 9012 3456"
                          required={formData.paymentMethod === 'card'}
                        />
                        
                        <Input
                          label="Name on Card"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          required={formData.paymentMethod === 'card'}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            label="Expiry Date"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            placeholder="MM/YY"
                            required={formData.paymentMethod === 'card'}
                          />
                          
                          <Input
                            label="CVV"
                            name="cvv"
                            type="password"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            placeholder="123"
                            maxLength="3"
                            required={formData.paymentMethod === 'card'}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Review Order */}
              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Review Your Order</h2>
                  
                  {/* Shipping Details */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Shipping To:</h3>
                    <p className="text-gray-700">{formData.fullName}</p>
                    <p className="text-gray-700">{formData.address}</p>
                    <p className="text-gray-700">
                      {formData.city}, {formData.state} {formData.zipCode}
                    </p>
                    <p className="text-gray-700">Phone: {formData.phone}</p>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Payment Method:</h3>
                    <p className="text-gray-700">
                      {formData.paymentMethod === 'mpesa' ? 'M-Pesa' : 'Credit/Debit Card'}
                    </p>
                    {formData.paymentMethod === 'mpesa' && (
                      <p className="text-gray-700">Phone: {formData.mpesaPhone}</p>
                    )}
                  </div>

                  {/* Order Items */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Order Items:</h3>
                    <div className="space-y-2">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>
                            {item.name} x {item.quantity}
                          </span>
                          <span className="font-medium">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-6 flex justify-between">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                  >
                    Back
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  className={step === 1 ? 'ml-auto' : ''}
                >
                  {step < 3 ? 'Continue' : 'Place Order'}
                </Button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (16% VAT)</span>
                  <span>{formatCurrency(cartTotal * 0.16)}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-primary-600 text-xl">
                      {formatCurrency(cartTotal * 1.16)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;