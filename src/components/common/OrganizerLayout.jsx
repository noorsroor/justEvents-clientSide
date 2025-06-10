import React from 'react';
import { Outlet } from 'react-router-dom';
import OrganizerNavbar from '../components/Navbar/OrganizerNavbar';
import './OrganizerLayout.css';

const OrganizerLayout = () => {
  return (
    <div className="organizer-layout">
      <OrganizerNavbar />
      <div className="layout-content">
        <Outlet />
      </div>
    </div>
  );
};

export default OrganizerLayout;
