import api from './api'; // Centralized axios instance with token + interceptors

// Register a new user
export const register = (name, email, password, role) =>
  api.post('/auth/register', { name, email, password, role });

// Login with email & password
export const login = (email, password) =>
  api.post('/auth/login', { email, password });

// Verify email with code
export const verifyEmail = (email, code) =>
  api.post('/auth/verify', { email, code });

// Resend verification code
export const resendVerificationCode = (email) =>
  api.post('/auth/resend-code', { email });

// Request password reset link
export const requestPasswordReset = (email) =>
  api.post('/auth/reset-password-request', { email });

// Submit new password using token
export const resetPassword = (token, newPassword) =>
  api.post('/auth/reset-password-submit', { token, newPassword });

// Request role (Organizer or Campus Admin) with optional attachment
export const requestRole = (requestedRole, attachment) => {
  const formData = new FormData();
  formData.append('requestedRole', requestedRole);
  if (attachment) formData.append('attachment', attachment);

  return api.post('/auth/request-role', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Trigger access token refresh manually 
export const refreshToken = (refreshToken) =>
  api.post('/auth/refresh-token', { token: refreshToken });
