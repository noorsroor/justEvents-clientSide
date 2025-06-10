import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { verifyEmail, resendVerificationCode } from '../../services/authService';
import { toast } from 'react-toastify';

import InputField from '../../components/common/InputField';
import PrimaryButton from '../../components/common/PrimaryButton';

const VerifyEmailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!code) {
      toast.error('Please enter the code');
      return;
    }

    try {
      setLoading(true);
      await verifyEmail(email, code);
      toast.success('Email verified successfully!');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendVerificationCode(email);
      toast.success('Verification code resent!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend code');
    }
  };

  return (
    <>
      <h2 className="mb-4">Check your email for a code</h2>

      <InputField label="Email" type="email" value={email} disabled />

      <InputField
        label="Enter verification code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter code"
      />

      <PrimaryButton
        text="Submit"
        onClick={handleVerify}
        isLoading={loading}
      />

      <div className="text-center mt-3">
        Didn’t get a code?{' '}
        <button onClick={handleResend} className="btn btn-link p-0">
          Resend Code
        </button>
      </div>

      <div className="text-center mt-4">
        <Link to="/login">Back to login</Link>
      </div>

      
    </>
  );
};

export default VerifyEmailPage;