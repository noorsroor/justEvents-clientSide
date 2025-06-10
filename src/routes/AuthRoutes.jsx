import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';

// Auth Pages
import LoginPage from '../pages/Authentication/LoginPage';
import RegisterPage from '../pages/Authentication/RegisterPage';
import VerifyEmailPage from '../pages/Authentication/VerifyEmailPage';
import ForgotPasswordPage from '../pages/Authentication/ForgotPasswordPage';
import ResetPasswordPage from '../pages/Authentication/ResetPasswordPage';
import RequestRolePage from '../pages/Authentication/RequestRolePage';

const AuthRoutes = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/request-role" element={<RequestRolePage />} />
      </Route>
    </Routes>
  );
};

export default AuthRoutes;
