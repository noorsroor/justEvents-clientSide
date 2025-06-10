import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaBookmark, FaSignOutAlt, FaCalendarAlt } from 'react-icons/fa';
import { useUser } from '../../context/UserContext';
import NotificationBadge from '../notifications/NotificationBadge';
import './navbar.css';

const NavBar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, role, logout, loading, user } = useUser();

  useEffect(() => {
    console.log('[NavBar] Context →', { isLoggedIn, role, user });
  }, [isLoggedIn, role, user]);

  if (loading) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-left brand-name">
        <NavLink to="/home" className="brand-link">
          <span className="brand-navy">JUST</span>
          <span className="brand-teal">Events</span>
        </NavLink>
      </div>

      <nav className="navbar-right">
        <NavLink to="/events" className="nav-link">Browse Events</NavLink>
        <NavLink to="/campus-map" className="nav-link">Campus Map</NavLink>

        {!isLoggedIn ? (
          <>
            <NavLink to="/login" className="nav-link">Login</NavLink>
            <NavLink to="/register" className="nav-link">Register</NavLink>
          </>
        ) : (
          <>
            <NavLink to="/saved" className="nav-link">
              <FaBookmark style={{ marginRight: '5px' }} /> Saved Events
            </NavLink>

            {role !== 'System Admin' && <NotificationBadge />}

            {['student', 'organizer', 'visitor'].includes(role?.toLowerCase()) && (
              <>
                {['student', 'visitor'].includes(role?.toLowerCase()) && (
                  <NavLink to="/rsvps/me" className="nav-link">
                    <FaBookmark style={{ marginRight: '5px' }} /> My RSVPs
                  </NavLink>
                )}
                <NavLink to="/bookings/me" className="nav-link">
                  <FaCalendarAlt style={{ marginRight: '5px' }} /> My Bookings
                </NavLink>
                <NavLink to="/bookings/new" className="nav-link">Book a Room</NavLink>
                <NavLink to="/calendar" className="nav-link">Room Calendar</NavLink>
              </>
            )}

            {role === 'Organizer' && (
              <>
                <NavLink to="/organizer/dashboard" className="nav-link">Dashboard</NavLink>
                <NavLink to="/organizer/my-events" className="nav-link">My Events</NavLink>
                <NavLink to="/events/create" className="nav-link">Create Event</NavLink>
              </>
            )}

            {role === 'Campus Admin' && (
              <>
                <NavLink to="/campus-admin/room-requests" className="nav-link">Pending Bookings</NavLink>
                <NavLink to="/campus-admin/manage-buildings" className="nav-link">Buildings</NavLink>
                <NavLink to="/campus-admin/manage-rooms" className="nav-link">Rooms</NavLink>
                <NavLink to="/campus-admin/analytics" className="nav-link">Analytics</NavLink>
              </>
            )}

            {role === 'System Admin' && (
              <>
                <NavLink to="/admin/analytics" className="nav-link">Analytics</NavLink>
                <NavLink to="/admin/dashboard" className="nav-link">Dashboard</NavLink>
                <NavLink to="/admin/pending-users" className="nav-link">Pending Users</NavLink>
                <NavLink to="/admin/pending-events" className="nav-link">Pending Events</NavLink>
                <NavLink to="/admin/notifications" className="nav-link">Notifications</NavLink>
              </>
            )}

            <button className="btn logout-button" onClick={handleLogout}>
              <FaSignOutAlt style={{ marginRight: '5px' }} /> Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default NavBar;
