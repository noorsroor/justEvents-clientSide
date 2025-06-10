import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { requestPasswordReset } from '../../services/authService';
import { toast } from 'react-toastify';

import InputField from '../../components/common/InputField';
import PrimaryButton from '../../components/common/PrimaryButton';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendReset = async () => {
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    try {
      setLoading(true);
      await requestPasswordReset(email);
      toast.success('Reset link sent! Check your inbox');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="mb-4">Reset your password</h2>

      <InputField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
      />

      <PrimaryButton
        text="Send Reset Link"
        onClick={handleSendReset}
        isLoading={loading}
      />

      <div className="text-center mt-4">
        <Link to="/login">Back to login</Link>
      </div>

      
    </>
  );
};

export default ForgotPasswordPage;