import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import eventService from '../../services/eventService';
import FeedbackForm from '../../components/Feedback/FeedbackForm';
import EventFeedbackList from '../../components/Feedback/EventFeedbackList';
import Footer from '../../components/common/Footer';
import { FaCalendarAlt, FaMapMarkerAlt, FaUser, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import './eventDetailsPage.css';
import api from '../../services/api';
import { saveEvent, unsaveEvent, getSavedEvents } from '../../services/savedEventsService';
import { toast } from 'react-toastify';

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [organizer, setOrganizer] = useState("Organizer Not Found");
  const [location, setLocation] = useState("Room Not Found");
  const [loading, setLoading] = useState(true);
  const [refreshFeedback, setRefreshFeedback] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [hasRSVPed, setHasRSVPed] = useState(false);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const token = localStorage.getItem('accessToken');
  const userRole = (localStorage.getItem('role') || '').toLowerCase();

  useEffect(() => {
    const redirectPath = localStorage.getItem('redirectAfterLogin');
    if (redirectPath === `/events/${id}`) {
      localStorage.removeItem('redirectAfterLogin');
      setRefreshFeedback(true);
    }
  }, [id]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const { data: eventRes } = await eventService.getEventById(id);
        setEvent(eventRes.data);

        const [organizerRes, roomRes] = await Promise.allSettled([
          api.get(`/api/users/${eventRes.data.organizer_id}/basic`),
          api.get(`/api/rooms/${eventRes.data.venue_id}/basic`)
        ]);

        if (organizerRes.status === "fulfilled") {
          setOrganizer(organizerRes.value.data.data.name);
        }
        if (roomRes.status === "fulfilled") {
          const roomData = roomRes.value.data.data;
          setLocation(`${roomData.name}, ${roomData.building}`);
        }

        if (token) {
          try {
            const savedEvents = await getSavedEvents();
            const isAlreadySaved = savedEvents.some(ev => ev.id === parseInt(id));
            setIsSaved(isAlreadySaved);
          } catch (err) {
            console.warn('Could not fetch saved events.');
          }

          try {
            const { data } = await api.get(`/api/events/${id}/my-rsvp`);
            setHasRSVPed(data.data.hasRSVPed);
          } catch (err) {
            console.warn('Could not fetch RSVP status.');
            setHasRSVPed(false);
          }
        }
      } catch (err) {
        console.error('Failed to fetch event details:', err.message);
        toast.error("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id, refreshFeedback, token]);

  const handleSaveToggle = async () => {
    if (!token) {
      toast.warning('You need to be logged in to save events.');
      localStorage.setItem('redirectAfterLogin', `/events/${id}`);
      navigate('/login');
      return;
    }

    try {
      if (isSaved) {
        await unsaveEvent(id);
        toast.success('Event removed from saved list.');
      } else {
        await saveEvent(id);
        toast.success('Event saved successfully.');
      }
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Error during save/unsave:', error.message);
      toast.error('Failed to update saved status.');
    }
  };

  const handleRsvpToggle = async () => {
    if (!token || !['student', 'visitor'].includes(userRole)) {
      toast.warning('Login as a Student or Visitor to RSVP.');
      localStorage.setItem('redirectAfterLogin', `/events/${id}`);
      navigate('/login');
      return;
    }

    try {
      setRsvpLoading(true);

      if (hasRSVPed) {
        await api.delete(`/api/events/${id}/rsvp`);
        toast.info('You have canceled your RSVP.');
      } else {
        await api.post(`/api/events/${id}/rsvp`);
        toast.success('RSVP successful!');
      }

      try {
        const { data } = await api.get(`/api/events/${id}/my-rsvp`);
        setHasRSVPed(data.data.hasRSVPed);
      } catch (err) {
        console.warn('Failed to refresh RSVP status after toggle.');
        setHasRSVPed(false);
      }

    } catch (error) {
      console.error('RSVP error:', error.message);
      toast.error(error.response?.data?.message || 'RSVP action failed.');
    } finally {
      setRsvpLoading(false);
    }
  };

  if (loading) return <p className="loading-text">Loading event details...</p>;
  if (!event) return <p className="loading-text">Event not found.</p>;

  return (
    <>
      <div className="event-hero-full">
        {!event.image_url || imageError ? (
          <div className="event-image-placeholder">
            <span>No Image Available</span>
          </div>
        ) : (
          <img
            src={`/uploads/${event.image_url}`}
            alt={event.title}
            className="event-hero-image-full"
            onError={() => setImageError(true)}
          />
        )}
        <div className="event-hero-overlay-full">
          <h1 className="event-title-full">{event.title}</h1>
          <p className="event-category-full">{event.category}</p>
        </div>
      </div>

      <div className="event-info-full">
        <div className="event-meta-full">
          <p>
            <FaMapMarkerAlt className="event-icon-full" />
            <strong> Location:</strong> {location}
          </p>
          <p>
            <FaCalendarAlt className="event-icon-full" />
            <strong> Date & Time:</strong> {new Date(event.date).toLocaleString()} at {event.time}
          </p>
          <p>
            <FaUser className="event-icon-full" />
            <strong> Organizer:</strong> {organizer}
          </p>
        </div>

        <button
          className={`save-event-btn ${isSaved ? 'saved' : ''}`}
          onClick={handleSaveToggle}
        >
          {isSaved ? <FaBookmark /> : <FaRegBookmark />} {isSaved ? 'Unsave Event' : 'Save Event'}
        </button>

        {event.status === 'Approved' && ['student', 'visitor'].includes(userRole) && (
          <button
            className={`rsvp-btn ${hasRSVPed ? 'cancel' : ''}`}
            onClick={handleRsvpToggle}
            disabled={rsvpLoading}
          >
            {hasRSVPed ? 'Cancel RSVP' : 'RSVP to Event'}
          </button>
        )}

        <div className="event-description-full">
          <h2>About the Event</h2>
          <div className="description-content">
            {event.description
              ? event.description.split('\n').map((para, index) => (
                  <p key={index}>{para}</p>
                ))
              : <p>No description available.</p>}
          </div>
        </div>

        <div className="feedback-section-full">
          <h2 className="section-title-full">Feedback & Reviews</h2>
          <div className="feedback-container-full">
            <div className="feedback-form-wrapper">
              <FeedbackForm
                eventId={id}
                onFeedbackSubmitted={() => setRefreshFeedback(!refreshFeedback)}
              />
            </div>
            <div className="feedback-list-wrapper">
              <EventFeedbackList eventId={id} refresh={refreshFeedback} onFeedbackSubmitted={() => setRefreshFeedback(!refreshFeedback)} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default EventDetailsPage;
