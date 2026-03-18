import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../hooks/useOrders';
import { usePreOrders } from '../hooks/usePreOrders';
import { useWishlist } from '../context/WishlistContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Loader from '../components/ui/Loader';
import PhoneVerificationModal from '../components/PhoneVerificationModal';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import toast from 'react-hot-toast';
import { 
  IoArrowBack, 
  IoPersonOutline, 
  IoMailOutline, 
  IoCallOutline,
  IoLocationOutline,
  IoLeaf,
  IoSaveOutline,
  IoLogOutOutline,
  IoReceiptOutline,
  IoTimeOutline,
  IoHeartOutline,
  IoShieldCheckmarkOutline,
  IoCardOutline,
  IoPhonePortraitOutline,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoPencilOutline
} from 'react-icons/io5';
import { FiEdit2, FiCheck } from 'react-icons/fi';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { headerImages } from '../constants/homeConstants';
import axiosInstance from '../api/axios';

const headerGradient = "bg-gradient-to-b from-transparent via-green-950/30 to-green-950";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, updateUser } = useAuth();
  const { orders, fetchMyOrders, loading: ordersLoading } = useOrders();
  const { myPreorders, fetchMyPreorders, loading: preordersLoading } = usePreOrders();
  const { wishlistItems, loading: wishlistLoading } = useWishlist();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [requirePhone, setRequirePhone] = useState(location.state?.requirePhone || false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: user?.full_name || user?.name || '',
    email: user?.email || '',
    phoneNumber: user?.phone_number || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zip_code || '',
    notifications: user?.notifications ?? true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      offset: 50,
    });
  }, []);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchMyOrders();
    } else if (activeTab === 'preorders') {
      fetchMyPreorders();
    }
  }, [activeTab, fetchMyOrders, fetchMyPreorders]);

  // Show phone modal if required from checkout
  useEffect(() => {
    if (requirePhone && !user?.phone_number) {
      setShowPhoneModal(true);
    }
  }, [requirePhone, user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Phone validation for M-Pesa (Safaricom format)
    if (formData.phoneNumber) {
      const phoneRegex = /^(254|0)[71]\d{8}$/;
      if (!phoneRegex.test(formData.phoneNumber)) {
        newErrors.phoneNumber = 'Format: 254712345678 or 0712345678';
      }
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.put('/api/user/profile', {
        full_name: formData.fullName,
        phone_number: formData.phoneNumber,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        notifications: formData.notifications,
      });
      
      // Update user in context
      updateUser({
        ...user,
        full_name: formData.fullName,
        phone_number: formData.phoneNumber,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
      });
      
      toast.success(response.data?.message || 'Profile updated successfully');
      setEditing(false);
      setRequirePhone(false);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const handlePhoneVerified = (verifiedPhone) => {
    updateUser({ 
      phone_number: verifiedPhone,
      phone_verified: true 
    });
    setFormData(prev => ({ ...prev, phoneNumber: verifiedPhone }));
    setRequirePhone(false);
    toast.success('Phone number verified successfully!');
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: IoPersonOutline },
    { id: 'orders', name: 'Orders', icon: IoReceiptOutline },
    { id: 'preorders', name: 'Pre-Orders', icon: IoTimeOutline },
    { id: 'wishlist', name: 'Wishlist', icon: IoHeartOutline },
  ];

  // Calculate stats from actual data
  const stats = [
    { 
      label: 'Total Orders', 
      value: orders?.length || 0, 
      icon: IoReceiptOutline,
      color: 'green',
      loading: ordersLoading
    },
    { 
      label: 'Pre-Orders', 
      value: myPreorders?.length || 0, 
      icon: IoTimeOutline,
      color: 'yellow',
      loading: preordersLoading
    },
    { 
      label: 'Wishlist Items', 
      value: wishlistItems?.length || 0,
      icon: IoHeartOutline,
      color: 'red',
      loading: wishlistLoading
    },
    { 
      label: 'Member Since', 
      value: user?.created_at ? formatDate(user.created_at, 'short') : '2024',
      icon: IoLeaf,
      color: 'green'
    },
  ];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'paid':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'delivered':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'cancelled':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'open':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'confirmed':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'fulfilled':
        return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  // Loading state for tabs
  const isLoading = () => {
    if (activeTab === 'orders' && ordersLoading) return true;
    if (activeTab === 'preorders' && preordersLoading) return true;
    if (activeTab === 'wishlist' && wishlistLoading) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-green-950">
      {/* Header Image Section */}
      <div className="relative w-full h-48 sm:h-64 md:h-80 overflow-hidden">
        <img 
          src={headerImages.hero}
          alt="Profile"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className={`absolute inset-0 ${headerGradient}`}></div>
        
        {/* Header Content - Responsive */}
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="text-center text-white" data-aos="fade-down">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-1 sm:mb-2 md:mb-3 lg:mb-4">
              MY PROFILE
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-green-200 max-w-2xl px-4">
              Manage your account and preferences
            </p>
          </div>
        </div>
      </div>

      {/* Phone Verification Modal */}
      <PhoneVerificationModal 
        isOpen={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        onVerified={handlePhoneVerified}
      />

      <div className="container-custom px-3 sm:px-4 md:px-6 py-6 sm:py-7 md:py-8">
        {/* Breadcrumb and Logout - Responsive */}
        <div className="mb-4 sm:mb-5 md:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" data-aos="fade-right">
          <Link to="/" className="inline-flex items-center text-xs sm:text-sm text-green-300 hover:text-green-100">
            <IoArrowBack className="mr-1 sm:mr-2" size={14} />
            Back to Home
          </Link>
          
          <button
            onClick={handleLogout}
            className="inline-flex items-center text-xs sm:text-sm text-red-400 hover:text-red-300 bg-red-950/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-red-400/20"
          >
            <IoLogOutOutline className="mr-1 sm:mr-2" size={14} />
            Logout
          </button>
        </div>

        {/* Phone Number Required Warning */}
        {requirePhone && !user?.phone_number && (
          <div className="mb-4 sm:mb-5 md:mb-6 bg-yellow-600/20 border border-yellow-600/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center justify-between" data-aos="fade-up">
            <div className="flex items-center gap-2 sm:gap-3">
              <IoPhonePortraitOutline className="text-yellow-400 text-lg sm:text-xl" />
              <p className="text-yellow-300 text-xs sm:text-sm">
                Please verify your phone number for M-Pesa payments
              </p>
            </div>
            <button
              onClick={() => setShowPhoneModal(true)}
              className="text-yellow-400 hover:text-yellow-300 text-xs sm:text-sm font-medium underline"
            >
              Verify Now
            </button>
          </div>
        )}

        {/* Stats Cards - Responsive */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-7 md:mb-8" data-aos="fade-up">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colors = {
              green: 'text-green-400 bg-green-400/10 border-green-400/20',
              yellow: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
              red: 'text-red-400 bg-red-400/10 border-red-400/20',
            };
            
            return (
              <div 
                key={index}
                className={`bg-green-900/30 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border ${colors[stat.color]}`}
              >
                <Icon className={`mx-auto text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2`} />
                {stat.loading ? (
                  <div className="w-8 h-8 mx-auto border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">{stat.value}</div>
                )}
                <div className="text-[10px] sm:text-xs text-green-200/70">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Profile Navigation Tabs - Responsive */}
        <div className="bg-green-900/30 backdrop-blur-sm rounded-xl sm:rounded-2xl md:rounded-3xl p-1 sm:p-1.5 border border-green-400/20 mb-6 sm:mb-7 md:mb-8 inline-flex flex-wrap" data-aos="fade-up">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base font-medium transition-all duration-300 flex items-center gap-1 sm:gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-green-600 text-white'
                    : 'text-green-300 hover:text-white hover:bg-green-800/30'
                }`}
              >
                <Icon size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="min-h-[300px] sm:min-h-[350px] md:min-h-[400px]">
          {isLoading() ? (
            <div className="flex items-center justify-center h-40 sm:h-48 md:h-56">
              <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="bg-green-900/30 backdrop-blur-sm rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 border border-green-400/20" data-aos="fade-up">
                  {/* Profile Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-5 md:mb-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-lg sm:text-xl md:text-2xl font-bold border-2 md:border-4 border-green-400">
                        {formData.fullName?.charAt(0)?.toUpperCase() || <IoPersonOutline size={20} className="sm:w-6 sm:h-6" />}
                      </div>
                      <div>
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">{formData.fullName || 'User'}</h2>
                        <p className="text-green-300 text-xs sm:text-sm">{formData.email}</p>
                        {formData.phoneNumber && (
                          <p className="text-green-400 text-[10px] sm:text-xs mt-0.5 sm:mt-1">{formData.phoneNumber}</p>
                        )}
                      </div>
                    </div>
                    {!editing && (
                      <button
                        onClick={() => setEditing(true)}
                        className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-800/30 text-green-300 rounded-lg sm:rounded-xl hover:bg-green-800/50 transition-colors border border-green-400/20 text-xs sm:text-sm"
                      >
                        <FiEdit2 size={12} className="sm:w-4 sm:h-4" />
                        Edit Profile
                      </button>
                    )}
                  </div>

                  {/* Profile Form */}
                  <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      <Input
                        label="Full Name"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        error={errors.fullName}
                        disabled={!editing}
                        icon={IoPersonOutline}
                        required
                        className="bg-green-950/60 text-xs sm:text-sm"
                        labelClassName="text-green-200 text-xs sm:text-sm"
                      />
                      
                      <Input
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        error={errors.email}
                        disabled={true} // Email from Google OAuth can't be changed
                        icon={IoMailOutline}
                        required
                        className="bg-green-950/60 text-xs sm:text-sm opacity-75"
                        labelClassName="text-green-200 text-xs sm:text-sm"
                      />
                    </div>

                    {/* M-Pesa Phone Number */}
                    <div className="space-y-1 sm:space-y-2">
                      <label className="text-xs sm:text-sm font-medium text-green-200 flex items-center gap-1 sm:gap-2">
                        <IoPhonePortraitOutline className="text-green-400 text-sm sm:text-base" />
                        M-Pesa Phone Number
                      </label>
                      <Input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        error={errors.phoneNumber}
                        disabled={!editing}
                        placeholder="254712345678"
                        className="bg-green-950/60 text-xs sm:text-sm"
                      />
                      <p className="text-[10px] sm:text-xs text-green-300/50">
                        Format: 254712345678 (include country code)
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                      <Input
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={!editing}
                        icon={IoLocationOutline}
                        className="bg-green-950/60 text-xs sm:text-sm"
                        labelClassName="text-green-200 text-xs sm:text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
                      <Input
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        disabled={!editing}
                        className="bg-green-950/60 text-xs sm:text-sm"
                        labelClassName="text-green-200 text-xs sm:text-sm"
                      />
                      
                      <Input
                        label="State"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        disabled={!editing}
                        className="bg-green-950/60 text-xs sm:text-sm"
                        labelClassName="text-green-200 text-xs sm:text-sm"
                      />
                      
                      <Input
                        label="ZIP Code"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        disabled={!editing}
                        className="bg-green-950/60 text-xs sm:text-sm"
                        labelClassName="text-green-200 text-xs sm:text-sm"
                      />
                    </div>

                    {/* Notification Preferences */}
                    <div className="pt-2 sm:pt-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="notifications"
                          checked={formData.notifications}
                          onChange={handleInputChange}
                          disabled={!editing}
                          className="rounded bg-green-950/50 border-green-700 text-green-400 focus:ring-green-400 w-3 h-3 sm:w-4 sm:h-4"
                        />
                        <span className="text-[10px] sm:text-xs text-green-200">
                          Receive email notifications about orders and promotions
                        </span>
                      </label>
                    </div>

                    {/* Form Actions */}
                    {editing && (
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-4">
                        <Button
                          type="submit"
                          variant="primary"
                          loading={loading}
                          className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm px-4 py-2"
                        >
                          <IoSaveOutline className="mr-1 sm:mr-2" size={12} />
                          Save Changes
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditing(false);
                            setFormData({
                              fullName: user?.full_name || user?.name || '',
                              email: user?.email || '',
                              phoneNumber: user?.phone_number || '',
                              address: user?.address || '',
                              city: user?.city || '',
                              state: user?.state || '',
                              zipCode: user?.zip_code || '',
                              notifications: user?.notifications ?? true,
                            });
                            setErrors({});
                          }}
                          className="border-2 border-green-400 text-green-300 hover:bg-green-800/30 text-xs sm:text-sm px-4 py-2"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </form>

                  {/* Account Security */}
                  <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-green-800">
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                      <IoShieldCheckmarkOutline className="text-green-400" />
                      Account Security
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center justify-between p-2 sm:p-3 bg-green-950/30 rounded-lg sm:rounded-xl">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <IoCheckmarkCircle className="text-green-400 text-sm sm:text-base" />
                          <span className="text-xs sm:text-sm text-green-200">Email Verified</span>
                        </div>
                        <span className="text-[10px] sm:text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">Verified</span>
                      </div>
                      <div className="flex items-center justify-between p-2 sm:p-3 bg-green-950/30 rounded-lg sm:rounded-xl">
                        <div className="flex items-center gap-2 sm:gap-3">
                          {formData.phoneNumber ? (
                            <IoCheckmarkCircle className="text-green-400 text-sm sm:text-base" />
                          ) : (
                            <IoCloseCircle className="text-yellow-400 text-sm sm:text-base" />
                          )}
                          <span className="text-xs sm:text-sm text-green-200">Phone Number</span>
                        </div>
                        <button
                          onClick={() => setShowPhoneModal(true)}
                          className={`text-[10px] sm:text-xs px-2 py-1 rounded-full ${
                            formData.phoneNumber 
                              ? 'text-green-400 bg-green-400/10 hover:bg-green-400/20' 
                              : 'text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20'
                          }`}
                        >
                          {formData.phoneNumber ? 'Update' : 'Add'}
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-2 sm:p-3 bg-green-950/30 rounded-lg sm:rounded-xl">
                        <div className="flex items-center gap-2 sm:gap-3">
                          {formData.phoneNumber ? (
                            <IoCardOutline className="text-green-400 text-sm sm:text-base" />
                          ) : (
                            <IoCardOutline className="text-red-400 text-sm sm:text-base" />
                          )}
                          <span className="text-xs sm:text-sm text-green-200">M-Pesa Ready</span>
                        </div>
                        <span className={`text-[10px] sm:text-xs px-2 py-1 rounded-full ${
                          formData.phoneNumber 
                            ? 'text-green-400 bg-green-400/10' 
                            : 'text-red-400 bg-red-400/10'
                        }`}>
                          {formData.phoneNumber ? 'Ready' : 'Setup Required'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="bg-green-900/30 backdrop-blur-sm rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 border border-green-400/20" data-aos="fade-up">
                  <h2 className="text-base sm:text-lg md:text-xl font-bold text-white mb-3 sm:mb-4">Recent Orders</h2>
                  
                  {!orders || orders.length === 0 ? (
                    <div className="text-center py-6 sm:py-8 md:py-12">
                      <IoReceiptOutline className="text-green-400 text-3xl sm:text-4xl md:text-5xl mx-auto mb-2 sm:mb-3" />
                      <p className="text-xs sm:text-sm text-green-200">No orders yet</p>
                      <Link to="/marketplace" className="text-green-400 hover:text-green-300 text-[10px] sm:text-xs mt-2 inline-block">
                        Start Shopping →
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-2 sm:space-y-3">
                      {orders.slice(0, 5).map((order) => (
                        <Link
                          key={order.id}
                          to={`/orders/${order.id}`}
                          className="block p-3 sm:p-4 bg-green-950/30 rounded-lg sm:rounded-xl hover:bg-green-950/50 transition-colors border border-green-800/50"
                        >
                          <div className="flex items-center justify-between mb-1 sm:mb-2">
                            <span className="text-xs sm:text-sm text-green-300">Order #{order.id}</span>
                            <span className={`text-[10px] sm:text-xs px-2 py-0.5 sm:py-1 rounded-full border ${getStatusColor(order.escrow_status)}`}>
                              {order.escrow_status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs sm:text-sm text-white font-medium">{order.crop_name}</span>
                            <span className="text-xs sm:text-sm text-green-400 font-bold">{formatCurrency(order.total_price)}</span>
                          </div>
                          <p className="text-[10px] sm:text-xs text-green-300/70 mt-1 sm:mt-2">
                            {formatDate(order.transaction_date)}
                          </p>
                        </Link>
                      ))}
                      
                      {orders.length > 5 && (
                        <Link
                          to="/orders"
                          className="block text-center text-green-400 hover:text-green-300 text-[10px] sm:text-xs mt-3 sm:mt-4"
                        >
                          View All Orders →
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Pre-Orders Tab */}
              {activeTab === 'preorders' && (
                <div className="bg-green-900/30 backdrop-blur-sm rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 border border-green-400/20" data-aos="fade-up">
                  <h2 className="text-base sm:text-lg md:text-xl font-bold text-white mb-3 sm:mb-4">My Pre-Orders</h2>
                  
                  {!myPreorders || myPreorders.length === 0 ? (
                    <div className="text-center py-6 sm:py-8 md:py-12">
                      <IoTimeOutline className="text-green-400 text-3xl sm:text-4xl md:text-5xl mx-auto mb-2 sm:mb-3" />
                      <p className="text-xs sm:text-sm text-green-200">No pre-orders yet</p>
                      <Link to="/preorders" className="text-green-400 hover:text-green-300 text-[10px] sm:text-xs mt-2 inline-block">
                        Browse Pre-Orders →
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-2 sm:space-y-3">
                      {myPreorders.slice(0, 5).map((preorder) => (
                        <Link
                          key={preorder.id}
                          to={`/preorders/${preorder.id}`}
                          className="block p-3 sm:p-4 bg-green-950/30 rounded-lg sm:rounded-xl hover:bg-green-950/50 transition-colors border border-green-800/50"
                        >
                          <div className="flex items-center justify-between mb-1 sm:mb-2">
                            <span className="text-xs sm:text-sm text-green-300">Pre-Order #{preorder.id}</span>
                            <span className={`text-[10px] sm:text-xs px-2 py-0.5 sm:py-1 rounded-full border ${getStatusColor(preorder.status)}`}>
                              {preorder.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs sm:text-sm text-white font-medium">{preorder.cropName}</span>
                            <span className="text-xs sm:text-sm text-green-400 font-bold">
                              {formatCurrency(preorder.price * preorder.quantity)}
                            </span>
                          </div>
                          <p className="text-[10px] sm:text-xs text-green-300/70 mt-1 sm:mt-2">
                            Harvest: {formatDate(preorder.expectedHarvestDate)}
                          </p>
                        </Link>
                      ))}
                      
                      {myPreorders.length > 5 && (
                        <Link
                          to="/preorders?tab=my"
                          className="block text-center text-green-400 hover:text-green-300 text-[10px] sm:text-xs mt-3 sm:mt-4"
                        >
                          View All Pre-Orders →
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div className="bg-green-900/30 backdrop-blur-sm rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 border border-green-400/20" data-aos="fade-up">
                  <h2 className="text-base sm:text-lg md:text-xl font-bold text-white mb-3 sm:mb-4">My Wishlist</h2>
                  
                  {!wishlistItems || wishlistItems.length === 0 ? (
                    <div className="text-center py-6 sm:py-8 md:py-12">
                      <IoHeartOutline className="text-green-400 text-3xl sm:text-4xl md:text-5xl mx-auto mb-2 sm:mb-3" />
                      <p className="text-xs sm:text-sm text-green-200">Your wishlist is empty</p>
                      <Link to="/marketplace" className="text-green-400 hover:text-green-300 text-[10px] sm:text-xs mt-2 inline-block">
                        Browse Products →
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                      {wishlistItems.map((item) => (
                        <Link
                          key={item.id}
                          to={`/crops/${item.id}`}
                          className="bg-green-950/30 rounded-lg p-2 sm:p-3 text-center hover:bg-green-950/50 transition-colors border border-green-800/50"
                        >
                          <img 
                            src={item.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400'}
                            alt={item.name}
                            className="w-full h-16 sm:h-20 md:h-24 object-cover rounded-md mb-1 sm:mb-2"
                          />
                          <p className="text-[10px] sm:text-xs font-medium text-white truncate">{item.name}</p>
                          <p className="text-[8px] sm:text-[10px] text-green-400">{formatCurrency(item.price)}/{item.unit}</p>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;