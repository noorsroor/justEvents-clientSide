import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../../services/authService';
import { toast } from 'react-toastify';

import InputField from '../../components/common/InputField';
import PrimaryButton from '../../components/common/PrimaryButton';

const ResetPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Correct way to get the token:
  const query = new URLSearchParams(location.search);
  const token = query.get('token');

  console.log("Token found in URL:", token);

  const [form, setForm] = useState({
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleReset = async () => {
    const { password, confirmPassword } = form;

    if (!password || !confirmPassword) {
      toast.warning('Please fill in both fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await resetPassword(token, password);
      toast.success('Password reset successfully!');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="mb-4">Set a new password</h2>

      <InputField
        label="New Password"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Enter new password"
      />
      <InputField
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        value={form.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm new password"
      />

      <PrimaryButton
        text="Reset Password"
        onClick={handleReset}
        isLoading={loading}
      />

      <div className="text-center mt-4">
        <Link to="/login">Back to login</Link>
      </div>
    </>
  );
};

export default ResetPasswordPage;
