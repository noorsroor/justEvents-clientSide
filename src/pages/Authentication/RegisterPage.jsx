import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../services/authService';
import { toast } from 'react-toastify';

import InputField from '../../components/common/InputField';
import PrimaryButton from '../../components/common/PrimaryButton';
import SSOButton from '../../components/common/SSOButton';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });
  const [loading, setLoading] = useState(false);

  const roles = ['Organizer', 'Visitor', 'Campus Admin'];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    const { name, email, password, confirmPassword, role } = form;

    if (!name || !email || !password || !confirmPassword || !role) {
      toast.warning('Please fill in all fields and select a role');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await register(name, email, password, role);
      toast.success('Registered successfully! Please verify your email.');
      navigate('/verify-email', { state: { email } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  const handleMicrosoftLogin = () => {
    window.location.href = 'http://localhost:5000/auth/microsoft';
  };

  return (
    <>
      <h2 className="mb-4">Join JUSTEvents</h2>

      <InputField
        label="Username"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Enter your username"
      />
      <InputField
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Enter your email"
      />
      <InputField
        label="Password"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Enter your password"
      />
      <InputField
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        value={form.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm your password"
      />

      <div className="mb-3 text-start">
        <label className="form-label">Role Selection</label>
        <select
          className="form-select"
          name="role"
          value={form.role}
          onChange={handleChange}
          required
        >
          <option value="">Select a role</option>
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      <PrimaryButton text="Create" onClick={handleRegister} isLoading={loading} />

      <div className="text-center my-3">
        <span>Or sign up with</span>
      </div>

      <div className="d-flex justify-content-center gap-3">
        <SSOButton provider="microsoft" onClick={handleMicrosoftLogin} />
        <SSOButton provider="google" onClick={handleGoogleLogin} />
      </div>

      <p className="text-muted mt-2 text-center" style={{ fontSize: '0.875rem' }}>
        Students should sign up using Microsoft SSO only.
      </p>
      <div className="text-center mt-4">
        Already have an account? <Link to="/login">Log in</Link>
      </div>

    </>
  );
};

export default RegisterPage;