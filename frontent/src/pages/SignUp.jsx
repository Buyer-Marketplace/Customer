import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { IoMailOutline, IoLockClosedOutline, IoPersonOutline, IoLeaf, IoArrowBack } from 'react-icons/io5';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Working header images (multiple fallbacks)
const headerImages = [
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=1600", // Fresh harvest
  "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1600", // Farm landscape
  "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1600"  // Vegetables
];
const headerGradient = "bg-gradient-to-b from-transparent via-green-950/40 to-green-950";

const SignUp = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    AOS.init({
      duration: 600,
      once: true,
    });
  }, []);

  const handleImageError = () => {
    if (imageIndex < headerImages.length - 1) {
      setImageIndex(prev => prev + 1);
    } else {
      setImageError(true);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name required';
    if (!formData.email) {
      newErrors.email = 'Email required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Min 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree';
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
    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });
    setLoading(false);
    
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-green-950 relative">
      {/* Header Image with Overlay - reduced height */}
      <div className="absolute top-0 left-0 right-0 h-[30vh] overflow-hidden">
        {!imageError ? (
          <img 
            src={headerImages[imageIndex]}
            alt="Farm market"
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-green-800 to-green-900"></div>
        )}
        <div className={`absolute inset-0 ${headerGradient}`}></div>
      </div>

      {/* Back Button */}
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center text-green-300 hover:text-green-100 bg-green-950/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-green-400/20 transition-colors text-sm"
        >
          <IoArrowBack className="mr-1.5" size={14} />
          Back
        </button>
      </div>

      {/* Content - Centered with reduced top padding */}
      <div className="relative z-10 flex items-center justify-center min-h-screen pt-[8vh]">
        <div className="w-full max-w-sm px-4" data-aos="fade-up">
          {/* Sign Up Card - further reduced padding and spacing */}
          <div className="bg-green-900/40 backdrop-blur-md rounded-2xl p-4 border border-green-400/20 shadow-xl">
            {/* Logo - smaller */}
            <div className="text-center mb-2">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-green-600 rounded-full mb-1 border-2 border-green-400">
                <IoLeaf className="text-white" size={18} />
              </div>
              <h2 className="text-base font-bold text-white">Create Account</h2>
              <p className="text-green-200 text-[9px] mt-0.5">Join as a buyer</p>
            </div>

            {/* Sign Up Form - minimal spacing */}
            <form onSubmit={handleSubmit} className="space-y-2">
              <Input
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                icon={IoPersonOutline}
                placeholder="John Doe"
                className="bg-green-950/60 border-green-700/50 text-white placeholder-green-300/50 text-xs py-1.5"
                labelClassName="text-green-200 text-[9px] mb-0.5"
              />

              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                icon={IoMailOutline}
                placeholder="you@example.com"
                className="bg-green-950/60 border-green-700/50 text-white placeholder-green-300/50 text-xs py-1.5"
                labelClassName="text-green-200 text-[9px] mb-0.5"
              />

              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                icon={IoLockClosedOutline}
                placeholder="••••••••"
                className="bg-green-950/60 border-green-700/50 text-white placeholder-green-300/50 text-xs py-1.5"
                labelClassName="text-green-200 text-[9px] mb-0.5"
              />

              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                icon={IoLockClosedOutline}
                placeholder="••••••••"
                className="bg-green-950/60 border-green-700/50 text-white placeholder-green-300/50 text-xs py-1.5"
                labelClassName="text-green-200 text-[9px] mb-0.5"
              />

              <div>
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="mt-0.5 rounded border-green-700 bg-green-950/60 text-green-400 focus:ring-green-400 w-2.5 h-2.5"
                  />
                  <span className="ml-1 text-[8px] text-green-200 leading-tight">
                    I agree to the{' '}
                    <Link to="/terms" className="text-green-400 hover:text-green-300">
                      Terms
                    </Link>{' '}
                    &{' '}
                    <Link to="/privacy" className="text-green-400 hover:text-green-300">
                      Privacy
                    </Link>
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p className="mt-0.5 text-[8px] text-red-400">{errors.agreeTerms}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="sm"
                fullWidth
                loading={loading}
                className="bg-green-600 hover:bg-green-700 text-white text-xs py-1.5 mt-1"
              >
                Create Account
              </Button>
            </form>

            {/* Divider - minimal */}
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-green-800"></div>
              </div>
              <div className="relative flex justify-center text-[8px]">
                <span className="px-2 bg-green-900/30 text-green-300">Or</span>
              </div>
            </div>

            {/* Google Sign Up - compact */}
            <button className="w-full flex items-center justify-center px-2 py-1.5 border border-green-700 rounded-lg hover:bg-green-800/30 transition-colors mb-1.5">
              <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-white text-xs">Google</span>
            </button>

            {/* Sign In Link */}
            <p className="text-center text-[9px] text-green-200">
              Already have an account?{' '}
              <Link to="/signin" className="font-medium text-green-400 hover:text-green-300">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;