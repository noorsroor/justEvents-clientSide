import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CampusAdminLayout from '../layouts/CampusAdminLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';
import CampusBuildingsPage from '../pages/campusAdmin/CampusBuildingsPage';
import CampusRoomsPage from '../pages/campusAdmin/CampusRoomsPage';
import CampusBookingRequestsPage from '../pages/campusAdmin/CampusBookingRequestsPage';
import CampusRoomAnalyticsPage from '../pages/campusAdmin/CampusRoomAnalyticsPage';

const CampusAdminRoutes = () => {
  return (
    <Routes>
      <Route
        path="/campus-admin/*"
        element={
          <ProtectedRoute role="Campus Admin">
            <CampusAdminLayout>
              <Routes>
                <Route path="buildings" element={<CampusBuildingsPage />} />
                <Route path="rooms" element={<CampusRoomsPage />} />
                <Route path="bookings" element={<CampusBookingRequestsPage />} />
                <Route path="analytics" element={<CampusRoomAnalyticsPage />} />
              </Routes>
            </CampusAdminLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default CampusAdminRoutes;
