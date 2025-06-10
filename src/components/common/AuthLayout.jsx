import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import '../../pages/Authentication/auth.css';
import Footer from './Footer.jsx'; 

const AuthLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    console.log(" Checking authentication state...");

    const accessToken = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role')?.toLowerCase();

    if (accessToken) {
      console.log(" User is authenticated.");
      setIsAuthenticated(true);
    }

    if (role === "pending") {
      console.log(" User is pending. Allowing access to Request Role.");
      setIsPending(true);
    }

    setIsLoading(false);
  }, []);

  // 🌀 Loading screen while checking
  if (isLoading) {
    return (
      <div className="loading-screen">
        <h3>Loading...</h3>
      </div>
    );
  }

  //  Allowed without login
  const openPaths = [
    "/login",
    "/register",
    "/forgot-password",
    "/verify-email",
    "/reset-password"
  ];

  if (openPaths.includes(location.pathname)) {
    console.log(` Allowing ${location.pathname} to render.`);
    return (
      <div className="auth-layout">
        <img src="/images/just.jpeg" alt="Background" className="auth-background" />
        <main className="auth-main">
          <div className="auth-card text-start">
            <img
              src="/images/logo.jpg"
              alt="JUSTEvents Logo"
              style={{ width: '160px', height: '40px', marginBottom: '1rem' }}
            />
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  //  Request Role page for Pending
  if (location.pathname === "/request-role" && isPending) {
    console.log(" Allowing /request-role to render for Pending role.");
    return (
      <div className="auth-layout">
        <img src="/images/just.jpeg" alt="Background" className="auth-background" />
        <main className="auth-main">
          <div className="auth-card text-start">
            <img
              src="/images/logo.jpg"
              alt="JUSTEvents Logo"
              style={{ width: '160px', height: '40px', marginBottom: '1rem' }}
            />
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  //  Redirect if not authenticated
  if (!isAuthenticated && !isPending) {
    console.warn(" Not authenticated → redirecting to login.");
    return <Navigate to="/login" />;
  }

  //  Authenticated → show layout
  console.log(" Authenticated. Rendering layout...");
  return (
    <div className="auth-layout">
      <img src="/images/just.jpeg" alt="Background" className="auth-background" />
      <main className="auth-main">
        <div className="auth-card text-start">
          <img
            src="/images/logo.jpg"
            alt="JUSTEvents Logo"
            style={{ width: '160px', height: '40px', marginBottom: '1rem' }}
          />
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AuthLayout;
