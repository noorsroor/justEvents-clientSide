// src/components/Landing/UpcomingEventsSection.jsx
import React, { useEffect, useState, useCallback } from 'react';
import api from '../../services/api';
import { CalendarDays } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import { Link, useNavigate } from 'react-router-dom';
import './upcomingEventsSection.css';

const mockEvents = [
  {
    id: 1,
    title: "AI & Robotics Meetup",
    date: "2025-05-25",
    description: "Explore the latest in robotics at JUST’s tech hub!",
  },
  {
    id: 2,
    title: "JUST Chess Open",
    date: "2025-05-27",
    description: "Students and staff go head-to-head in our chess challenge.",
  },
  {
    id: 3,
    title: "Startup Pitch Night",
    date: "2025-05-30",
    description: "Support student startups and vote for your favorite pitch.",
  },
];

const UpcomingEventsSection = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Wrapped with useCallback
  const fetchUpcoming = useCallback(async () => {
    try {
      console.log("Fetching Upcoming Events...");
      const res = await api.get('/api/events?upcoming=true');
      if (res.data?.data?.length > 0) {
        setEvents(res.data.data);
        console.log("API Data Loaded");
      } else {
        console.warn("API returned no data, using mock events.");
        setEvents(mockEvents);
      }
    } catch (err) {
      console.error('Failed to fetch upcoming events:', err.message);
      setEvents(mockEvents);
    } finally {
      setLoading(false);
    }
  }, []);

  // useEffect with correct dependencies
  useEffect(() => {
    fetchUpcoming();
  }, [fetchUpcoming]);

  return (
    <section className="upcoming-events-calendar">
      <div className="section-title-with-icon">
        <CalendarDays size={22} />
        <h2>Upcoming Events</h2>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <LoadingSpinner />
        </div>
      ) : events.length > 0 ? (
        <ul className="calendar-event-list">
          {events.map((event) => {
            const eventDate = event.date ? new Date(event.date) : new Date();
            const day = eventDate.toLocaleDateString('en-US', { day: '2-digit' });
            const month = eventDate.toLocaleDateString('en-US', { month: 'short' });
            const weekday = eventDate.toLocaleDateString('en-US', { weekday: 'short' });

            return (
              <li className="calendar-event-card" key={event.id}>
                <div className="calendar-date-box" aria-label={`${weekday}, ${month} ${day}`}>
                  <div className="calendar-day">{day}</div>
                  <div className="calendar-month">{month}</div>
                  <div className="calendar-weekday">{weekday}</div>
                </div>
                <div className="calendar-event-info">
                  <h4>{event.title}</h4>
                  <p>{event.description}</p>
                  <Link to={`/events/${event.id}`} className="calendar-event-link">
                    View Details
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="empty-text">
          No upcoming events available right now.
          <button className="back-button" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      )}
    </section>
  );
};

export default UpcomingEventsSection;
