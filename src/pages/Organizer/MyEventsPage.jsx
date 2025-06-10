// src/pages/Organizer/MyEventsPage.jsx
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { deleteEvent } from '../../services/eventService';
import NavBar from '../../components/common/NavBar';
import Footer from '../../components/common/Footer';
import RejectionReasonModal from '../../components/Events/RejectionReasonModal';
import EventCard from '../../components/Events/EventCard';
import './MyEventsPage.css';

const MyEventsPage = () => {
  const location = useLocation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [modalReason, setModalReason] = useState('');

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          toast.error('You need to be logged in to view your events');
          return;
        }

        const res = await api.get('/api/my-events', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setEvents(res.data.data);
      } catch (err) {
        console.error('Failed to load events:', err.message);
        toast.error('Error loading your events');
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, [location.key]);

  const handleDelete = async (eventId) => {
    const confirm = window.confirm("Are you sure you want to delete this event?");
    if (!confirm) return;

    try {
      await deleteEvent(eventId);
      toast.success("Event deleted successfully");
      setEvents((prev) => prev.filter(e => e.id !== eventId));
    } catch (err) {
      console.error("Delete error", err.message);
      toast.error("Failed to delete event");
    }
  };

  const statusCount = {
    All: events.length,
    Approved: events.filter(e => e.status === 'Approved').length,
    Pending: events.filter(e => e.status === 'Pending').length,
    Rejected: events.filter(e => e.status === 'Rejected').length,
  };

  return (
    <>
      <NavBar />
      <div className="my-events-container">
        <button className="back-btn" onClick={() => window.history.back()}>
          ← Back
        </button>
        <h1 className="my-events-heading">My Events</h1>

        <div className="filter-buttons">
          {['All', 'Approved', 'Pending', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
            >
              {status} ({statusCount[status]})
            </button>
          ))}
        </div>

        {loading ? (
          <p className="loading-message">Loading your events...</p>
        ) : events.length === 0 ? (
          <p className="no-events-message">You haven’t created any events yet.</p>
        ) : (
          <div className="event-card-list">
            {events
              .filter((event) => filterStatus === 'All' || event.status === filterStatus)
              .map((event, index) => (
                <EventCard
                  key={`${event.id}-${index}`}
                  event={event}
                  actions={
                    <>
                      <Link to={`/events/edit/${event.id}`} className="action-btn edit-btn">
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="action-btn delete-btn"
                      >
                        Delete
                      </button>
                      {event.status === 'Approved' && (
                        <Link to={`/events/${event.id}/rsvps`} className="action-btn view-btn">
                          View RSVPs
                        </Link>
                      )}
                      {event.status === 'Rejected' && (
                        <button
                          onClick={() => {
                            setModalReason(event.decision_reason);
                            setShowModal(true);
                          }}
                          className="action-btn view-btn"
                        >
                          View Reason
                        </button>
                      )}
                    </>
                  }
                />
              ))}
          </div>
        )}
      </div>

      <RejectionReasonModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        reason={modalReason}
      />

      <Footer />
    </>
  );
};

export default MyEventsPage;
