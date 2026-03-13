import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../api/orderApi';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { formatCurrency } from '../utils/formatCurrency';
import toast from 'react-hot-toast';
import { 
  IoArrowBack, 
  IoLocationOutline, 
  IoCardOutline, 
  IoPersonOutline,
  IoCheckmarkCircle,
  IoLeaf
} from 'react-icons/io5';
import { FiChevronRight } from 'react-icons/fi';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Header image
const headerImage = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1600";
const headerGradient = "bg-gradient-to-b from-transparent via-green-950/30 to-green-950";

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

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      offset: 50,
    });
  }, []);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step < 3) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        products: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
        })),
        deliveryAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
        paymentMethod: formData.paymentMethod,
        contactInfo: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
        },
        total: cartTotal,
        grandTotal: cartTotal * 1.16, // Including tax
      };

      const response = await orderApi.createOrder(orderData);
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/orders/${response.data?.id || response.id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Shipping Information', icon: IoLocationOutline },
    { number: 2, title: 'Payment Method', icon: IoCardOutline },
    { number: 3, title: 'Review Order', icon: IoPersonOutline },
  ];

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-green-950">
      {/* Header Image Section */}
      <div className="relative w-full h-80 overflow-hidden">
        <img 
          src={headerImage}
          alt="Checkout"
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 ${headerGradient}`}></div>
        
        {/* Header Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white" data-aos="fade-down">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">CHECKOUT</h1>
            <p className="text-xl text-green-200 max-w-2xl px-4">
              Complete your order in a few simple steps
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom py-8 max-w-4xl">
        {/* Back Button */}
        <div className="mb-6" data-aos="fade-right">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : navigate('/cart')}
            className="inline-flex items-center text-green-300 hover:text-green-100 bg-green-950/50 backdrop-blur-sm px-4 py-2 rounded-full border border-green-400/20"
          >
            <IoArrowBack className="mr-2" />
            {step > 1 ? 'Back to Previous Step' : 'Back to Cart'}
          </button>
        </div>

        {/* Progress Steps */}
        <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-6 border border-green-400/20 mb-8" data-aos="fade-up">
          <div className="flex items-center justify-between">
            {steps.map((s, index) => (
              <React.Fragment key={s.number}>
                <div className="flex items-center">
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300
                      ${s.number === step
                        ? 'border-green-400 bg-green-600 text-white'
                        : s.number < step
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-green-700 bg-green-950/50 text-green-300'
                      }
                    `}
                  >
                    {s.number < step ? (
                      <IoCheckmarkCircle className="text-white" size={20} />
                    ) : (
                      s.number
                    )}
                  </div>
                  <span className={`ml-3 text-sm font-medium hidden sm:inline ${
                    s.number <= step ? 'text-white' : 'text-green-300/50'
                  }`}>
                    {s.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <FiChevronRight className={`text-2xl ${
                    s.number < step ? 'text-green-400' : 'text-green-700'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2" data-aos="fade-right">
            <form onSubmit={handleSubmit} className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-6 border border-green-400/20">
              {/* Step 1: Shipping Information */}
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-white mb-4">Shipping Information</h2>
                  
                  <Input
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="bg-green-950/50 border-green-700/50 text-white placeholder-green-300/50"
                    labelClassName="text-green-200"
                  />
                  
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="bg-green-950/50 border-green-700/50 text-white placeholder-green-300/50"
                    labelClassName="text-green-200"
                  />
                  
                  <Input
                    label="Phone Number"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 0712345678"
                    className="bg-green-950/50 border-green-700/50 text-white placeholder-green-300/50"
                    labelClassName="text-green-200"
                  />
                  
                  <Input
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="bg-green-950/50 border-green-700/50 text-white placeholder-green-300/50"
                    labelClassName="text-green-200"
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="bg-green-950/50 border-green-700/50 text-white placeholder-green-300/50"
                      labelClassName="text-green-200"
                    />
                    
                    <Input
                      label="State/Province"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="bg-green-950/50 border-green-700/50 text-white placeholder-green-300/50"
                      labelClassName="text-green-200"
                    />
                  </div>
                  
                  <Input
                    label="ZIP/Postal Code"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                    className="bg-green-950/50 border-green-700/50 text-white placeholder-green-300/50"
                    labelClassName="text-green-200"
                  />
                </div>
              )}

              {/* Step 2: Payment Method */}
              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-white mb-4">Payment Method</h2>
                  
                  <div className="space-y-3">
                    <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-300 ${
                      formData.paymentMethod === 'mpesa'
                        ? 'border-green-400 bg-green-800/30'
                        : 'border-green-700/50 bg-green-950/30 hover:bg-green-800/20'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="mpesa"
                        checked={formData.paymentMethod === 'mpesa'}
                        onChange={handleInputChange}
                        className="mr-3 accent-green-400"
                      />
                      <div>
                        <span className="font-medium text-white">M-Pesa</span>
                        <p className="text-sm text-green-300">Pay via M-Pesa mobile money</p>
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
                          className="bg-green-950/50 border-green-700/50 text-white placeholder-green-300/50"
                          labelClassName="text-green-200"
                        />
                      </div>
                    )}

                    <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-300 ${
                      formData.paymentMethod === 'card'
                        ? 'border-green-400 bg-green-800/30'
                        : 'border-green-700/50 bg-green-950/30 hover:bg-green-800/20'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={handleInputChange}
                        className="mr-3 accent-green-400"
                      />
                      <div>
                        <span className="font-medium text-white">Credit/Debit Card</span>
                        <p className="text-sm text-green-300">Pay with Visa, Mastercard</p>
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
                          className="bg-green-950/50 border-green-700/50 text-white placeholder-green-300/50"
                          labelClassName="text-green-200"
                        />
                        
                        <Input
                          label="Name on Card"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          required={formData.paymentMethod === 'card'}
                          className="bg-green-950/50 border-green-700/50 text-white placeholder-green-300/50"
                          labelClassName="text-green-200"
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            label="Expiry Date"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            placeholder="MM/YY"
                            required={formData.paymentMethod === 'card'}
                            className="bg-green-950/50 border-green-700/50 text-white placeholder-green-300/50"
                            labelClassName="text-green-200"
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
                            className="bg-green-950/50 border-green-700/50 text-white placeholder-green-300/50"
                            labelClassName="text-green-200"
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
                  <h2 className="text-xl font-semibold text-white mb-4">Review Your Order</h2>
                  
                  {/* Shipping Details */}
                  <div className="bg-green-950/50 rounded-xl p-4 border border-green-700/30">
                    <h3 className="font-medium text-green-300 mb-2">Shipping To:</h3>
                    <p className="text-white">{formData.fullName}</p>
                    <p className="text-green-200">{formData.address}</p>
                    <p className="text-green-200">
                      {formData.city}, {formData.state} {formData.zipCode}
                    </p>
                    <p className="text-green-200">Phone: {formData.phone}</p>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-green-950/50 rounded-xl p-4 border border-green-700/30">
                    <h3 className="font-medium text-green-300 mb-2">Payment Method:</h3>
                    <p className="text-white">
                      {formData.paymentMethod === 'mpesa' ? 'M-Pesa' : 'Credit/Debit Card'}
                    </p>
                    {formData.paymentMethod === 'mpesa' && (
                      <p className="text-green-200">Phone: {formData.mpesaPhone}</p>
                    )}
                  </div>

                  {/* Order Items */}
                  <div className="bg-green-950/50 rounded-xl p-4 border border-green-700/30">
                    <h3 className="font-medium text-green-300 mb-2">Order Items:</h3>
                    <div className="space-y-2">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-green-200">
                            {item.name} x {item.quantity}
                          </span>
                          <span className="font-medium text-white">
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
                    className="border-2 border-green-400 text-green-300 hover:bg-green-800/30"
                  >
                    Back
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  className={`bg-green-600 hover:bg-green-700 text-white ${step === 1 ? 'ml-auto' : ''}`}
                >
                  {step < 3 ? 'Continue' : 'Place Order'}
                </Button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1" data-aos="fade-left">
            <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-6 border border-green-400/20 sticky top-24">
              <h2 className="text-lg font-semibold text-white mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-green-200">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="text-white font-medium">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-green-700 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-green-300">Subtotal</span>
                  <span className="font-medium text-white">{formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-300">Shipping</span>
                  <span className="text-green-400 font-medium">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-300">Tax (16% VAT)</span>
                  <span className="text-white">{formatCurrency(cartTotal * 0.16)}</span>
                </div>
                <div className="border-t border-green-700 pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-green-400 text-xl">
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