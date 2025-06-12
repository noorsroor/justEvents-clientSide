// src/context/UserContext.jsx
import { jwtDecode } from 'jwt-decode';
import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

let logoutTimer = null;

const startSessionTimer = (token, logoutFn) => {
  try {
    const decoded = jwtDecode(token);
    const expiryTime = decoded.exp * 1000;
    const delay = expiryTime - Date.now();

    console.log('JWT expires in (ms):', delay);

    if (logoutTimer) clearTimeout(logoutTimer);

    if (delay > 0) {
      logoutTimer = setTimeout(() => {
        console.log('Session expired via timer');
        toast.dismiss();
        toast.error('Session expired. Please log in again.', { toastId: 'session-expired' });
        logoutFn();
        setTimeout(() => {
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }, 200);
      }, delay);
    }
  } catch (err) {
    console.error('JWT decode failed:', err.message);
  }
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const isTokenValid = () => {
    const token = localStorage.getItem('accessToken');
    try {
      if (!token) return false;
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  };

  const logout = () => {
    console.log('Logging out user...');
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    setUser(null);
    setRole(null);
    setIsLoggedIn(false);
    localStorage.setItem('logout', Date.now());
    if (logoutTimer) clearTimeout(logoutTimer);
    logoutTimer = null;
  };

  const login = (userData) => {
    console.log('Logging in:', userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('accessToken', userData.token);
    localStorage.setItem('refreshToken', userData.refreshToken);
    localStorage.setItem('role', userData.role);
    setUser(userData);
    setRole(userData.role);
    setIsLoggedIn(true);
    startSessionTimer(userData.token, logout);
  };

  // Initialize context from localStorage or refresh
  useEffect(() => {
    const init = async () => {
      const savedUser = localStorage.getItem('user');
      const savedRole = localStorage.getItem('role');
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      console.log('[UserContext Init] Access Token:', accessToken);
      console.log('[UserContext Init] Refresh Token:', refreshToken);

      // Case 1: Try refresh token if no access token
      if (!accessToken && refreshToken) {
        try {
          const res = await fetch('https://justevents-serverside.onrender.com/auth/refresh-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: refreshToken }),
          });

          const data = await res.json();
          const newToken = data?.data?.accessToken;

          if (newToken) {
            console.log('[UserContext] Recovered session using refreshToken');
            localStorage.setItem('accessToken', newToken);
            const recoveredUser = savedUser ? JSON.parse(savedUser) : { name: 'Recovered User' };
            setUser(recoveredUser);
            setRole(savedRole || 'Student');
            setIsLoggedIn(true);
            startSessionTimer(newToken, logout);
            return;
          }

          throw new Error('Refresh failed');
        } catch (err) {
          console.warn('[UserContext] Token refresh failed:', err.message);
          logout();
          return;
        }
      }

      // Case 2: Use existing valid access token
      if (!accessToken || !savedUser) return;

      try {
        const decoded = jwtDecode(accessToken);
        if (decoded.exp * 1000 > Date.now()) {
          setUser(JSON.parse(savedUser));
          setRole(savedRole);
          setIsLoggedIn(true);
          startSessionTimer(accessToken, logout);
        } else {
          logout();
        }
      } catch (err) {
        console.warn('[UserContext] Invalid token on load:', err.message);
        logout();
      }
    };

    init();
  }, []);

  // Sync logout across browser tabs
  useEffect(() => {
    const syncLogout = (event) => {
      if (event.key === 'logout') {
        setUser(null);
        setRole(null);
        setIsLoggedIn(false);
      }
    };
    window.addEventListener('storage', syncLogout);
    return () => window.removeEventListener('storage', syncLogout);
  }, []);

  // Global sync handler for token refresh
  useEffect(() => {
    window.updateUserContext = () => {
      const savedUser = localStorage.getItem('user');
      const savedRole = localStorage.getItem('role');
      setUser(savedUser ? JSON.parse(savedUser) : null);
      setRole(savedRole || null);
      setIsLoggedIn(!!savedUser);
    };
    return () => {
      window.updateUserContext = null;
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, role, isLoggedIn, login, logout, isTokenValid }}>
      {children}
    </UserContext.Provider>
  );
};
