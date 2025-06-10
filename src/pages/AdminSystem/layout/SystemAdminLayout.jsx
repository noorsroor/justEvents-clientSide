// src/pages/AdminSystem/layout/SystemAdminLayout.jsx
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import './SystemAdminLayout.css';

const SystemAdminLayout = () => {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>JUSTEvents Admin</h2>
        <nav>
          <NavLink to="/admin/dashboard">Dashboard</NavLink>
          <NavLink to="/admin/pending-users">Pending Users</NavLink>
          <NavLink to="/admin/pending-events">Event Approvals</NavLink>
          <NavLink to="/admin/notifications">Notifications</NavLink>
        </nav>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default SystemAdminLayout;
