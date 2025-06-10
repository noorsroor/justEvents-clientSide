// src/layouts/CampusAdminLayout.jsx
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const CampusAdminLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'Campus Admin') {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="campus-admin-layout">
      <header className="p-4 bg-primary text-white font-bold text-xl">
        Campus Admin Panel
      </header>
      <main className="p-6 bg-gray-50 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default CampusAdminLayout;
