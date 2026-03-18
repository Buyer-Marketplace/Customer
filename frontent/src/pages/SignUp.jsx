import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleButton from '../components/ui/GoogleButton';
import { IoArrowBack, IoLeaf } from 'react-icons/io5';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { headerImages } from '../constants/homeConstants';
import toast from 'react-hot-toast';

const headerGradient = "bg-gradient-to-b from-transparent via-green-950/30 to-green-950";

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { googleLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get the page they tried to visit, or default to home
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    AOS.init({ duration: 600, once: true });
  }, []);

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Simulate getting user data from Google OAuth
      const googleUserData = {
        email: 'user@gmail.com', // This would come from Google
        fullName: 'Google User', // This would come from Google
      };
      
      const result = await googleLogin(googleUserData);
      
      if (result.success) {
        toast.success('Account created successfully!');
        navigate(from, { replace: true });
      } else {
        setError(result.error || 'Sign up failed. Please try again.');
        toast.error(result.error || 'Sign up failed');
      }
    } catch (err) {
      const errorMessage = 'Unable to connect to server. Please check your connection.';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Sign up error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-950 relative">
      {/* Header Image */}
      <div className="absolute inset-0 h-[30vh] overflow-hidden">
        <img 
          src={headerImages.hero}
          alt="Farm landscape"
          className="w-full h-full object-cover"
          loading="eager"
        />
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

      <div className="relative z-10 flex items-center justify-center min-h-screen pt-[8vh]">
        <div className="w-full max-w-sm px-4" data-aos="fade-up">
          <div className="bg-green-900/40 backdrop-blur-md rounded-2xl p-6 border border-green-400/20 shadow-xl text-center">
            
            {/* Logo */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-3 border-2 border-green-400 shadow-lg shadow-green-600/30">
              <IoLeaf className="text-white" size={30} />
            </div>
            
            <h2 className="text-xl font-bold text-white mb-2">Join AgriTrace</h2>
            <p className="text-green-200 text-sm mb-6">
              Create your account with Google
            </p>

            {/* Show which page they were trying to access */}
            {from !== '/' && (
              <p className="text-xs text-green-300/70 mb-4">
                You need to sign up to access this page
              </p>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-400/20 rounded-lg text-sm text-red-200 text-center">
                {error}
              </div>
            )}
            
            {/* Google Sign Up Button */}
            <GoogleButton
              onClick={handleGoogleSignUp}
              loading={loading}
              text="Sign up with Google"
              fullWidth
            />

            {/* Info Text */}
            <div className="text-xs text-green-300/70 mt-6">
              By signing up, you agree to our{' '}
              <Link to="/terms" className="text-green-400 hover:underline">
                Terms
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-green-400 hover:underline">
                Privacy Policy
              </Link>
            </div>

            {/* Sign In Link */}
            <p className="text-sm text-green-200 mt-6">
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