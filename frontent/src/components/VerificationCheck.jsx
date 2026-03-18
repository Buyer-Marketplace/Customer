import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './ui/Loader';
import Button from './ui/Button';
import Input from './ui/Input';
import { IoMailOutline, IoCallOutline, IoPersonOutline, IoClose } from 'react-icons/io5';
import toast from 'react-hot-toast';

/**
 * VerificationCheck Component
 * 
 * Checks user verification status after login and redirects to appropriate pages
 * Only runs on protected routes, not on login/signup pages
 */
const VerificationCheck = ({ children, requiredChecks = ['phone', 'email', 'profile'] }) => {
  const { user, isAuthenticated, loading, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showVerification, setShowVerification] = useState(false);
  const [verificationType, setVerificationType] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState('input'); // 'input', 'verify'
  const [sendingCode, setSendingCode] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Don't run checks on auth pages
  const isAuthPage = ['/signin', '/signup', '/forgot-password'].includes(location.pathname);

  useEffect(() => {
    if (isAuthPage || loading || !isAuthenticated || !user) return;

    // Check what needs verification
    const checks = [];

    if (requiredChecks.includes('phone') && !user.phone_number) {
      checks.push('phone');
    }
    
    if (requiredChecks.includes('email') && !user.email_verified) {
      checks.push('email');
    }
    
    if (requiredChecks.includes('profile') && (!user.full_name || !user.email)) {
      checks.push('profile');
    }

    if (checks.length > 0) {
      setVerificationType(checks[0]); // Handle one at a time
      setShowVerification(true);
    } else {
      setShowVerification(false);
    }
  }, [user, isAuthenticated, loading, isAuthPage, requiredChecks]);

  // Countdown timer for resend code
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendPhoneCode = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setSendingCode(true);
    try {
      // TODO: Replace with actual API call to send verification code
      // await authApi.sendPhoneVerification(phoneNumber);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Verification code sent to ${phoneNumber}`);
      setStep('verify');
      setCountdown(60); // 60 second countdown
    } catch (error) {
      toast.error('Failed to send verification code');
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerifyPhone = async () => {
    if (!verificationCode || verificationCode.length < 4) {
      toast.error('Please enter a valid verification code');
      return;
    }

    setVerifying(true);
    try {
      // TODO: Replace with actual API call to verify code
      // await authApi.verifyPhone(phoneNumber, verificationCode);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update user in context
      updateUser({ phone_number: phoneNumber, phone_verified: true });
      
      toast.success('Phone number verified successfully!');
      setShowVerification(false);
      
      // Refresh page to re-run checks
      window.location.reload();
    } catch (error) {
      toast.error('Invalid verification code');
    } finally {
      setVerifying(false);
    }
  };

  const handleResendCode = () => {
    if (countdown > 0) return;
    setStep('input');
    setCountdown(0);
  };

  const handleCompleteProfile = async () => {
    // Navigate to profile page with return state
    navigate('/profile', { 
      state: { 
        from: location,
        requireProfileComplete: true,
        message: 'Please complete your profile to continue'
      }
    });
  };

  const handleVerifyEmail = () => {
    // Navigate to email verification page
    navigate('/verify-email', { 
      state: { 
        from: location,
        email: user?.email
      }
    });
  };

  const handleSkip = () => {
    // Allow skipping for now, but will show again on next protected route
    setShowVerification(false);
    toast('You can complete verification later from your profile', {
      icon: 'ℹ️'
    });
  };

  // Don't show on auth pages
  if (isAuthPage || !showVerification) {
    return children;
  }

  // Render verification UI based on type
  const renderVerification = () => {
    switch (verificationType) {
      case 'phone':
        return (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-gradient-to-b from-green-950 to-green-900 rounded-2xl p-6 max-w-md w-full mx-4 border border-green-400/30 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Verify Your Phone</h2>
                <button 
                  onClick={handleSkip}
                  className="p-1 text-green-400 hover:text-white hover:bg-green-800 rounded-lg transition-colors"
                >
                  <IoClose size={20} />
                </button>
              </div>
              
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-600/30 rounded-full flex items-center justify-center border-2 border-green-400">
                  <IoCallOutline className="text-green-400" size={30} />
                </div>
              </div>
              
              {/* Info Text */}
              <p className="text-center text-green-200 text-sm mb-6">
                Phone verification is required for M-Pesa payments and order notifications
              </p>

              {/* Phone Input Step */}
              {step === 'input' && (
                <>
                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="e.g., 254712345678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="mb-4"
                    labelClassName="text-green-200"
                  />
                  <p className="text-xs text-green-300/70 mb-4">
                    Enter your phone number in international format (e.g., 254712345678)
                  </p>
                  <Button
                    onClick={handleSendPhoneCode}
                    loading={sendingCode}
                    disabled={sendingCode}
                    fullWidth
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Send Verification Code
                  </Button>
                </>
              )}

              {/* Verification Code Step */}
              {step === 'verify' && (
                <>
                  <div className="mb-4 p-3 bg-green-800/30 rounded-lg text-center">
                    <p className="text-xs text-green-300">Code sent to</p>
                    <p className="text-sm font-medium text-white">{phoneNumber}</p>
                  </div>
                  
                  <Input
                    label="Verification Code"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="mb-4"
                    labelClassName="text-green-200"
                  />
                  
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={handleResendCode}
                      disabled={countdown > 0}
                      className={`text-sm ${
                        countdown > 0 
                          ? 'text-green-300/50 cursor-not-allowed' 
                          : 'text-green-400 hover:text-green-300'
                      }`}
                    >
                      Resend Code {countdown > 0 && `(${countdown}s)`}
                    </button>
                    <button
                      onClick={() => setStep('input')}
                      className="text-sm text-green-400 hover:text-green-300"
                    >
                      Change Number
                    </button>
                  </div>
                  
                  <Button
                    onClick={handleVerifyPhone}
                    loading={verifying}
                    disabled={verifying}
                    fullWidth
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Verify & Continue
                  </Button>
                </>
              )}

              {/* Skip Link */}
              <p className="text-center mt-4">
                <button
                  onClick={handleSkip}
                  className="text-xs text-green-300/70 hover:text-green-300"
                >
                  Skip for now
                </button>
              </p>
            </div>
          </div>
        );

      case 'email':
        return (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-gradient-to-b from-green-950 to-green-900 rounded-2xl p-6 max-w-md w-full mx-4 border border-green-400/30 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Verify Your Email</h2>
                <button 
                  onClick={handleSkip}
                  className="p-1 text-green-400 hover:text-white hover:bg-green-800 rounded-lg transition-colors"
                >
                  <IoClose size={20} />
                </button>
              </div>
              
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-600/30 rounded-full flex items-center justify-center border-2 border-green-400">
                  <IoMailOutline className="text-green-400" size={30} />
                </div>
              </div>
              
              <p className="text-center text-green-200 text-sm mb-4">
                We've sent a verification email to:
              </p>
              <p className="text-center text-white font-medium mb-6">{user?.email}</p>
              
              <p className="text-center text-green-300/70 text-xs mb-6">
                Please check your inbox and click the verification link.
              </p>
              
              <Button
                onClick={handleVerifyEmail}
                fullWidth
                className="bg-green-600 hover:bg-green-700 text-white mb-3"
              >
                I've Verified My Email
              </Button>
              
              <Button
                onClick={() => toast.success('Verification email resent!')}
                variant="outline"
                fullWidth
                className="border-2 border-green-400 text-green-300 hover:bg-green-800/30"
              >
                Resend Email
              </Button>

              <p className="text-center mt-4">
                <button
                  onClick={handleSkip}
                  className="text-xs text-green-300/70 hover:text-green-300"
                >
                  Skip for now
                </button>
              </p>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-gradient-to-b from-green-950 to-green-900 rounded-2xl p-6 max-w-md w-full mx-4 border border-green-400/30 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Complete Your Profile</h2>
                <button 
                  onClick={handleSkip}
                  className="p-1 text-green-400 hover:text-white hover:bg-green-800 rounded-lg transition-colors"
                >
                  <IoClose size={20} />
                </button>
              </div>
              
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-600/30 rounded-full flex items-center justify-center border-2 border-green-400">
                  <IoPersonOutline className="text-green-400" size={30} />
                </div>
              </div>
              
              <p className="text-center text-green-200 text-sm mb-6">
                Please complete your profile to continue. This helps us serve you better.
              </p>
              
              <div className="space-y-3 mb-6">
                {!user?.full_name && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                    <span className="text-yellow-300">Full name missing</span>
                  </div>
                )}
                {!user?.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                    <span className="text-yellow-300">Email address missing</span>
                  </div>
                )}
                {!user?.phone_number && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                    <span className="text-yellow-300">Phone number missing</span>
                  </div>
                )}
              </div>
              
              <Button
                onClick={handleCompleteProfile}
                fullWidth
                className="bg-green-600 hover:bg-green-700 text-white mb-3"
              >
                Complete Profile
              </Button>

              <p className="text-center mt-4">
                <button
                  onClick={handleSkip}
                  className="text-xs text-green-300/70 hover:text-green-300"
                >
                  Skip for now
                </button>
              </p>
            </div>
          </div>
        );

      default:
        return children;
    }
  };

  return (
    <>
      {renderVerification()}
      {children}
    </>
  );
};

export default VerificationCheck;