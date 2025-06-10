import React from 'react';
import './dualCTASection.css';
import { PlusCircle, CalendarClock, MapPinned } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const DualCTASection = () => {
  const navigate = useNavigate();
  const { isLoggedIn, role } = useUser();

  const isOrganizer = role === 'Organizer';
  const isBookingAllowed = ['student', 'visitor', 'organizer'].includes(role?.toLowerCase());

  const handleNavigate = (path) => navigate(path);

  return (
    <section className="dual-cta-section">
      <h2 className="cta-title">Bring Your Ideas to Life at JUST</h2>
      <p className="cta-subtitle">
        Create engaging events, reserve campus rooms, and empower your student journey – all in one place.
      </p>

      <div className="cta-button-group">
        {/* Always show Campus Map */}
        <button onClick={() => handleNavigate('/campus-map')}>
          <MapPinned size={18} /> Explore Campus Map
        </button>

        {!isLoggedIn && (
          <>
            <button onClick={() => handleNavigate('/login')}>
              <PlusCircle size={18} /> Start Hosting
            </button>
            <button onClick={() => handleNavigate('/login')}>
              <CalendarClock size={18} /> Book a Room
            </button>
          </>
        )}

        {isLoggedIn && isOrganizer && (
          <button onClick={() => handleNavigate('/events/create')}>
            <PlusCircle size={18} /> Start Hosting
          </button>
        )}

        {isLoggedIn && isBookingAllowed && (
          <>
            <button onClick={() => handleNavigate('/bookings/new')}>
              <CalendarClock size={18} /> Book a Room
            </button>
            <button onClick={() => handleNavigate('/calendar')}>
              <CalendarClock size={18} /> View Calendar
            </button>
          </>
        )}

        {isLoggedIn && role === 'Campus Admin' && (
          <button onClick={() => handleNavigate('/campus-admin/room-requests')}>
            <CalendarClock size={18} /> Room Requests
          </button>
        )}

        {isLoggedIn && role === 'System Admin' && (
          <button onClick={() => handleNavigate('/admin/dashboard')}>
            <CalendarClock size={18} /> Admin Dashboard
          </button>
        )}
      </div>
    </section>
  );
};

export default DualCTASection;
