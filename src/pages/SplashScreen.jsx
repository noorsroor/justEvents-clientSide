// src/pages/SplashScreen.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home'); //  redirect to Landing Page after 3.5 seconds
    }, 3500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center text-center"
      style={{
        height: '100vh',
        padding: '2rem',
        background: 'linear-gradient(to bottom right, #f9f9f9, #98d2c0)',
        color: '#062743',
      }}
    >
      <h1
        className="mb-3"
        style={{ fontSize: '3rem', fontWeight: '800', lineHeight: '1.2' }}
      >
        Welcome to{' '}
        <span style={{ color: '#4F959D' }}>
          JUSTEvents
        </span>
      </h1>

      <p className="text-muted" style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>
        Redirecting you to your event experience...
      </p>

      <button
        // Skip button
        onClick={() => navigate('/home')}
        className="btn btn-outline-dark"
        style={{ borderRadius: '12px', padding: '10px 24px', fontWeight: '500' }}
      >
        Skip Now
      </button>
    </div>
  );
};

export default SplashScreen;
