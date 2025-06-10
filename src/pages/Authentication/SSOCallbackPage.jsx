import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SSOCallbackPage = () => {
  const navigate = useNavigate();
  const [isProcessed, setIsProcessed] = useState(false);

  useEffect(() => {
    const isAtCallback = window.location.pathname.includes('/sso/callback');
    if (!isAtCallback) return;

    if (isProcessed) {
      console.log("Already processed, skipping re-render.");
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const role = params.get('role');
    const name = params.get('name');
    const id = params.get('id'); // Optional: only set if available

    console.log("Received SSO Callback Data →", {
      token,
      role,
      name,
      id
    });

    if (!token || !role || !name) {
      console.error("Missing required SSO parameters.");
      toast.error("SSO failed. Missing user data.");
      navigate('/login');
      return;
    }

    const cleanRole = role.trim().toLowerCase();

    // Save to LocalStorage
    localStorage.setItem('accessToken', token);
    localStorage.setItem('role', cleanRole);
    if (id) localStorage.setItem('userId', id); // Only store if provided
    localStorage.setItem('user', JSON.stringify({ role: cleanRole, name }));

    console.log("Local Storage Saved: ", {
      accessToken: localStorage.getItem('accessToken'),
      role: localStorage.getItem('role'),
      userId: localStorage.getItem('userId'),
      user: localStorage.getItem('user'),
    });

    setIsProcessed(true);

    if (cleanRole === "pending") {
      toast.info("You need to complete your role request.");
      navigate('/request-role', { replace: true });
    } else {
      navigate('/home', { replace: true });
    }
  }, [navigate, isProcessed]);

  return (
    <div>
      <h2>Processing SSO...</h2>
    </div>
  );
};

export default SSOCallbackPage;
