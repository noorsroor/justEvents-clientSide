// src/pages/SavedEvents/SavedEventsPage.jsx
import React, { useEffect, useState } from 'react';
import { getSavedEvents, unsaveEvent } from '../../services/savedEventsService';
import { toast } from 'react-toastify';
import SavedEventCard from '../../components/SavedEvents/SavedEventCard';
import Footer from '../../components/common/Footer';
import NavBar from '../../components/common/NavBar'; 
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import './savedEvents.css';

const SavedEventsPage = () => {
  const [savedEvents, setSavedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const { logout } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedEvents = async () => {
      try {
        const events = await getSavedEvents();

        if (Array.isArray(events)) {
          setSavedEvents(events);
        } else {
          console.error('Expected an array but got:', events);
          toast.error('Failed to load saved events');
          setSavedEvents([]);
        }
      } catch (error) {
        console.error(error.message);

        if (error.message.toLowerCase().includes('unauthorized')) {
          toast.error('Session expired. Please log in again.');
          logout();
          setTimeout(() => {
            navigate('/login');
          }, 200);
        } else {
          toast.error('Failed to load saved events');
        }

        setSavedEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedEvents();
  }, [logout, navigate]);

  const handleUnsave = async (eventId) => {
    try {
      await unsaveEvent(eventId);
      setSavedEvents((prev) => prev.filter((event) => event.id !== eventId));
      toast.success('Removed from saved events');
    } catch (error) {
      console.error(error.message);
      toast.error('Failed to unsave event');
    }
  };

  return (
    <>
      <NavBar />

      <div className="saved-events-container">
        <div className="saved-header">
          <div className="saved-count-container">
            <span className="saved-count-label">{savedEvents.length} Saved</span>
            </div>
            <h2 className="saved-title">Your Saved Events</h2>
            </div>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : savedEvents.length === 0 ? (
          <p className="text-center">No saved events yet.</p>
        ) : (
          <div className="saved-grid">
            {savedEvents.map((event) => (
              <SavedEventCard
                key={event.id}
                event={event}
                onUnsave={handleUnsave}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default SavedEventsPage;
