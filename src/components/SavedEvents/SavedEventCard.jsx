import React from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaTag, FaTrashAlt, FaClock, FaExternalLinkAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../pages/SavedEvents/savedEvents.css';

const SavedEventCard = ({ event, onUnsave }) => {
  const navigate = useNavigate();

  const goToEventDetails = () => {
    navigate(`/events/${event.id}`);
  };

  const handleUnsaveClick = (e) => {
    e.stopPropagation();
    onUnsave(event.id);
  };

  return (
    <div className="event-glow-card clickable">
      {event.image_url && (
        <img
          src={event.image_url}
          alt={event.title}
          className="event-image"
        />
      )}

      <div className="event-content">
        <h5>{event.title}</h5>
        <p>
          <FaCalendarAlt className="event-icon" /> {event.date} <br />
          <FaClock className="event-icon" /> {event.time} <br />
          <FaMapMarkerAlt className="event-icon" /> {event.venue_name || 'Unknown Venue'} <br />
          <FaTag className="event-icon" /> {event.category}
        </p>

        <div className="event-actions">
          <button className="event-unsave-btn" onClick={handleUnsaveClick}>
            <FaTrashAlt className="icon-space" /> Unsave
          </button>

          <button className="event-details-btn" onClick={goToEventDetails}>
            <FaExternalLinkAlt className="icon-space" /> View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavedEventCard;
