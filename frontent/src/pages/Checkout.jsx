import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ordersApi from '../api/ordersApi';
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
  IoCashOutline,
  IoPhonePortraitOutline
} from 'react-icons/io5';
import { FiChevronRight } from 'react-icons/fi';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Header image
const headerImage = "https://images.pexels.com/photos/3302501/pexels-photo-3302501.jpeg";
const headerGradient = "bg-gradient-to-b from-transparent via-green-950/30 to-green-950";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedListing, setSelectedListing] = useState(null);
  const [formData, setFormData] = useState({
    // Shipping Information
    fullName: user?.full_name || user?.name || '',
    email: user?.email || '',
    phone: user?.phone_number || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Payment Information - Only M-Pesa (as per backend)
    paymentMethod: 'mpesa',
    mpesaPhone: user?.phone_number || '',
    
    // Order Details
    marketplaceItemId: null,
    quantity: 1,
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
    // Check for single item checkout from marketplace
    const savedListing = localStorage.getItem('selectedListing');
    if (savedListing) {
      const listing = JSON.parse(savedListing);
      setSelectedListing(listing);
      setFormData(prev => ({
        ...prev,
        marketplaceItemId: listing.id,
        quantity: 1,
      }));
      localStorage.removeItem('selectedListing');
    }
  }, []);

  useEffect(() => {
    if (!selectedListing && cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, selectedListing, navigate]);

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin', { state: { from: '/checkout' } });
    }
  }, [isAuthenticated, navigate]);

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

    // Validate M-Pesa phone number
    const phoneRegex = /^(254|0)[71]\d{8}$/;
    if (!phoneRegex.test(formData.mpesaPhone)) {
      toast.error('Please enter a valid M-Pesa phone number (e.g., 0712345678 or 254712345678)');
      return;
    }

    setLoading(true);
    try {
      // If checking out a single item from marketplace
      if (selectedListing) {
        const orderData = {
          marketplaceItemId: selectedListing.id,
          quantity: formData.quantity,
          phoneNumber: formData.mpesaPhone,
          deliveryAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
          notes: '',
        };

        const response = await ordersApi.placeOrder(orderData);
        toast.success('Order placed! Check your phone for M-Pesa prompt.');
        navigate('/orders');
        return;
      }

      // For multiple items from cart - create separate orders for each
      for (const item of cartItems) {
        const orderData = {
          marketplaceItemId: item.id,
          quantity: item.quantity,
          phoneNumber: formData.mpesaPhone,
          deliveryAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
          notes: 'Order from cart',
        };

        await ordersApi.placeOrder(orderData);
      }
      
      clearCart();
      toast.success('Orders placed successfully! Check your phone for M-Pesa prompts.');
      navigate('/orders');
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

  // Calculate totals
  const subtotal = selectedListing 
    ? selectedListing.price_per_kg * formData.quantity
    : cartTotal;
  
  const tax = subtotal * 0.16; // 16% VAT
  const grandTotal = subtotal + tax;

  if ((!selectedListing && cartItems.length === 0) || !isAuthenticated) {
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
            onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
            className="inline-flex items-center text-green-300 hover:text-green-100 bg-green-950/50 backdrop-blur-sm px-4 py-2 rounded-full border border-green-400/20"
          >
            <IoArrowBack className="mr-2" />
            {step > 1 ? 'Back to Previous Step' : 'Back'}
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

                  {selectedListing && (
                    <div className="bg-green-950/50 rounded-xl p-4 border border-green-700/30">
                      <h3 className="font-medium text-green-300 mb-2">Order Quantity</h3>
                      <Input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        min="1"
                        max={selectedListing.available_quantity_kg}
                        step="0.5"
                        required
                        className="bg-green-950/60"
                      />
                      <p className="text-xs text-green-300/50 mt-2">
                        Available: {selectedListing.available_quantity_kg} kg
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Payment Method - Only M-Pesa (as per backend) */}
              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-white mb-4">Payment Method</h2>
                  
                  <div className="space-y-4">
                    {/* M-Pesa Option (Only option) */}
                    <div className={`flex items-center p-5 border-2 rounded-xl border-green-400 bg-green-800/40 shadow-lg shadow-green-900/30`}>
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 bg-green-600/30 rounded-full flex items-center justify-center border border-green-400/30">
                          <IoPhonePortraitOutline className="text-green-400 text-xl" />
                        </div>
                        <div>
                          <span className="font-semibold text-white text-lg block">M-Pesa</span>
                          <p className="text-sm text-green-300">Pay instantly via mobile money</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-green-950/40 rounded-xl border border-green-700/30">
                      <Input
                        label="M-Pesa Phone Number"
                        name="mpesaPhone"
                        value={formData.mpesaPhone}
                        onChange={handleInputChange}
                        placeholder="0712345678 or 254712345678"
                        required
                        className="bg-green-950/60 border-green-700/50 text-white placeholder-green-300/50"
                        labelClassName="text-green-200 font-medium"
                      />
                      <p className="text-xs text-green-300/50 mt-2">
                        You will receive an STK push prompt on your phone to complete payment
                      </p>
                    </div>

                    {/* Note: Cash on Delivery removed as backend only supports M-Pesa */}
                  </div>
                </div>
              )}

              {/* Step 3: Review Order */}
              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-white mb-4">Review Your Order</h2>
                  
                  {/* Shipping Details */}
                  <div className="bg-green-950/50 rounded-xl p-4 border border-green-700/30">
                    <h3 className="font-medium text-green-300 mb-2 flex items-center gap-2">
                      <IoLocationOutline className="text-green-400" />
                      Shipping To:
                    </h3>
                    <p className="text-white">{formData.fullName}</p>
                    <p className="text-green-200">{formData.address}</p>
                    <p className="text-green-200">
                      {formData.city}, {formData.state} {formData.zipCode}
                    </p>
                    <p className="text-green-200">Phone: {formData.phone}</p>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-green-950/50 rounded-xl p-4 border border-green-700/30">
                    <h3 className="font-medium text-green-300 mb-2 flex items-center gap-2">
                      <IoCardOutline className="text-green-400" />
                      Payment Method:
                    </h3>
                    <p className="text-white">M-Pesa</p>
                    <p className="text-green-200 mt-2">
                      Phone Number: {formData.mpesaPhone}
                    </p>
                  </div>

                  {/* Order Items */}
                  <div className="bg-green-950/50 rounded-xl p-4 border border-green-700/30">
                    <h3 className="font-medium text-green-300 mb-2">Order Items:</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                      {selectedListing ? (
                        <div className="flex justify-between text-sm py-2 border-b border-green-800/50">
                          <span className="text-green-200">
                            {selectedListing.crop_name} x {formData.quantity} kg
                          </span>
                          <span className="font-medium text-white">
                            {formatCurrency(selectedListing.price_per_kg * formData.quantity)}
                          </span>
                        </div>
                      ) : (
                        cartItems.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm py-2 border-b border-green-800/50 last:border-0">
                            <span className="text-green-200">
                              {item.name} x {item.quantity} {item.unit}
                            </span>
                            <span className="font-medium text-white">
                              {formatCurrency(item.price * item.quantity)}
                            </span>
                          </div>
                        ))
                      )}
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
                  {step < 3 ? 'Continue' : 'Place Order & Pay via M-Pesa'}
                </Button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1" data-aos="fade-left">
            <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-6 border border-green-400/20 sticky top-24">
              <h2 className="text-lg font-semibold text-white mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto custom-scrollbar">
                {selectedListing ? (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-200">
                      {selectedListing.crop_name} x {formData.quantity} kg
                    </span>
                    <span className="text-white font-medium">
                      {formatCurrency(selectedListing.price_per_kg * formData.quantity)}
                    </span>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-green-200">
                        {item.name} x {item.quantity}
                      </span>
                      <span className="text-white font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-green-700 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-green-300">Subtotal</span>
                  <span className="font-medium text-white">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-300">Shipping</span>
                  <span className="text-green-400 font-medium">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-300">Tax (16% VAT)</span>
                  <span className="text-white">{formatCurrency(tax)}</span>
                </div>
                <div className="border-t border-green-700 pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-green-400 text-xl">
                      {formatCurrency(grandTotal)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Method Summary */}
              {step === 3 && (
                <div className="mt-4 pt-4 border-t border-green-700">
                  <p className="text-sm text-green-300">
                    You will receive an M-Pesa STK push on {formData.mpesaPhone}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;