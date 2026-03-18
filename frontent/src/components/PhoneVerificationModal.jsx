import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import verificationApi from '../api/verificationApi';
import Button from './ui/Button';
import Input from './ui/Input';
import { IoCallOutline, IoClose } from 'react-icons/io5';
import toast from 'react-hot-toast';

const PhoneVerificationModal = ({ isOpen, onClose, onVerified }) => {
  const { user, updateUser } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState('input'); // 'input', 'verify'
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  if (!isOpen) return null;

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendCode = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      await verificationApi.sendPhoneVerification(phoneNumber);
      toast.success(`Verification code sent to ${phoneNumber}`);
      setStep('verify');
      startCountdown();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length < 4) {
      toast.error('Please enter a valid verification code');
      return;
    }

    setLoading(true);
    try {
      const response = await verificationApi.verifyPhone(phoneNumber, verificationCode);
      
      // Update user in context
      updateUser({ 
        phone_number: phoneNumber,
        phone_verified: true 
      });
      
      toast.success('Phone number verified successfully!');
      onVerified?.();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (countdown > 0) return;
    setStep('input');
    setVerificationCode('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gradient-to-b from-green-950 to-green-900 rounded-2xl p-6 max-w-md w-full mx-4 border border-green-400/30 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Verify Your Phone</h2>
          <button 
            onClick={onClose}
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
              onClick={handleSendCode}
              loading={loading}
              disabled={loading}
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
                onClick={handleResend}
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
              onClick={handleVerifyCode}
              loading={loading}
              disabled={loading}
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
            onClick={onClose}
            className="text-xs text-green-300/70 hover:text-green-300"
          >
            Skip for now
          </button>
        </p>
      </div>
    </div>
  );
};

export default PhoneVerificationModal;