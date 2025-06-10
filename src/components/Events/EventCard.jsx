// src/components/Events/EventCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './eventCard.css';

const EventCard = ({ event, actions }) => {
  const { id, title, date, description, image_url, category } = event;

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="event-card">
      {image_url ? (
        <img
          src={`/images/${image_url}`}
          alt={title}
          className="event-image"
          loading="lazy"
        />
      ) : (
        <div className="event-image placeholder">
          <span>No Image</span>
        </div>
      )}

      <div className="event-body">
        <span className="event-date">{formattedDate}</span>
        <h4 className="event-title">{title}</h4>
        <span className="event-category">{category || 'General'}</span>

        <p className="event-description">
          {description?.length > 100 ? `${description.slice(0, 100)}...` : description}
        </p>

        <Link to={`/events/${id}`} className="event-button">
          View Details
        </Link>

        {actions && <div className="event-actions">{actions}</div>}
      </div>
    </div>
  );
};

export default EventCard;
