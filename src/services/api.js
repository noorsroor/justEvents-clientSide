// src/utils/axios.js
import axios from 'axios';
import { toast } from 'react-toastify';

let navigateHandler = null;
export const setNavigateHandler = (fn) => {
  navigateHandler = fn;
};

const api = axios.create({
  baseURL: 'https://justevents-serverside.onrender.com',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

console.log('AXIOS CONNECTED →', api.defaults.baseURL);

// Request Interceptor: Inject access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');

  const isPublic =
    config.url.includes('/public') ||
    config.url.includes('/auth') ||
    config.url === '/analytics/popular-events-public' ||
    config.url === '/analytics/summary-public' ||
    config.url === '/feedback/recent-public' ||
    (config.method === 'get' && /^\/events(\/\d+)?$/.test(config.url)) ||
    config.url === '/api/buildings' ||
    config.url.startsWith('/api/campus-map/navigate');

  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response Interceptor: Attempt token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/refresh-token') &&
      !originalRequest.url.includes('/auth/login')
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('Missing refresh token');

        const refreshResponse = await axios.post('https://justevents-serverside.onrender.com/auth/refresh-token', {
          token: refreshToken,
        });

        const newAccessToken = refreshResponse.data?.data?.accessToken;

        if (newAccessToken) {
          // Save new token and retry original request
          localStorage.setItem('accessToken', newAccessToken);

          // Safe header re-injection
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

          // Sync UserContext (optional)
          if (window.updateUserContext) window.updateUserContext();

          return api(originalRequest); // Retry original request with new token
        }

        throw new Error('No new access token returned');
      } catch (refreshErr) {
        toast.dismiss();
        toast.error('Session expired. Please log in again.', { toastId: 'session-expired' });

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('role');

        if (navigateHandler) {
          navigateHandler('/login');
        } else {
          window.location.href = '/login';
        }

        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
