import React, { useEffect, useState } from 'react';
import { fetchMyRsvps } from '../services/rsvpService';
import NavBar from '../components/common/NavBar';
import Footer from '../components/common/Footer';
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import EventCard from '../components/Events/EventCard';
import './myRsvps.css';

const MyRsvpsPage = () => {
  const [events, setEvents] = useState([]);
  const { logout } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchMyRsvps();
        setEvents(data);
      } catch (err) {
        if (err.message.toLowerCase().includes('unauthorized')) {
          toast.error('Session expired. Please log in again.');
          logout();
          navigate('/login');
        } else {
          toast.error('Failed to load RSVP events');
        }
      }
    };
    load();
  }, [logout, navigate]);

  return (
    <>
      <NavBar />

      <div className="my-rsvps-container">
        <div className="my-rsvps-header">
          {events.length > 0 && (
            <span className="my-rsvps-count-label">{events.length} Going</span>
          )}
          <h2 className="my-rsvps-title">Your RSVPed Events</h2>
        </div>

        {events.length === 0 ? (
          <p className="text-center">You haven't RSVPed to any events yet.</p>
        ) : (
          <div className="my-rsvps-grid">
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default MyRsvpsPage;
