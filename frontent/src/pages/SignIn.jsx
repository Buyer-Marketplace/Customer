import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { IoMailOutline, IoLockClosedOutline, IoLeaf, IoArrowBack } from 'react-icons/io5';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Header image
const headerImage = "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1600";
const headerGradient = "bg-gradient-to-b from-transparent via-green-950/30 to-green-950";

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});

  const from = location.state?.from || '/';

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  const handleChange = (e) => {
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
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
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
    const result = await login(formData.email, formData.password);
    setLoading(false);
    
    if (result.success) {
      navigate(from);
    }
  };

  return (
    <div className="min-h-screen bg-green-950 relative">
      {/* Header Image with Overlay */}
      <div className="absolute inset-0 h-[40vh] overflow-hidden">
        <img 
          src={headerImage}
          alt="Farm landscape"
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 ${headerGradient}`}></div>
      </div>

      {/* Back Button - Positioned absolutely at top-left */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center text-green-300 hover:text-green-100 bg-green-950/50 backdrop-blur-sm px-4 py-2 rounded-full border border-green-400/20 transition-colors"
        >
          <IoArrowBack className="mr-2" />
          Back to Home
        </button>
      </div>

      {/* Content - Positioned to overlap header */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 pt-[20vh]">
        <div className="max-w-md w-full" data-aos="fade-up">
          {/* Sign In Card */}
          <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-6 border border-green-400/20 shadow-2xl">
            {/* Logo */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-green-600 rounded-full mb-2 border-2 border-green-400">
                <IoLeaf className="text-white" size={28} />
              </div>
              <h2 className="text-xl font-bold text-white">Welcome Back</h2>
              <p className="text-green-200 text-xs mt-1">Sign in to your account</p>
            </div>

            {/* Sign In Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                icon={IoMailOutline}
                placeholder="you@example.com"
                className="bg-green-950/50 border-green-700/50 text-white placeholder-green-300/50 text-sm py-2"
                labelClassName="text-green-200 text-xs"
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
                className="bg-green-950/50 border-green-700/50 text-white placeholder-green-300/50 text-sm py-2"
                labelClassName="text-green-200 text-xs"
              />

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="rounded border-green-700 bg-green-950/50 text-green-400 focus:ring-green-400 w-3.5 h-3.5"
                  />
                  <span className="ml-1.5 text-green-200">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-green-400 hover:text-green-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                loading={loading}
                className="bg-green-600 hover:bg-green-700 text-white text-sm py-2"
              >
                Sign In
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-green-800"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-green-900/30 text-green-300">Or continue with</span>
              </div>
            </div>

            {/* Google Sign In */}
            <button className="w-full flex items-center justify-center px-4 py-2 border border-green-700 rounded-xl hover:bg-green-800/30 transition-colors mb-3">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
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
              <span className="text-white text-sm">Google</span>
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-xs text-green-200">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-green-400 hover:text-green-300 transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;