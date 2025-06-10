// src/components/Landing/FeaturedEventsSection.jsx
import React, { useEffect, useState, useCallback } from 'react';
import EventCard from '../Events/EventCard';
import api from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import './featuredEventsSection.css';
import { useNavigate } from 'react-router-dom';

const mockEvents = [
  {
    id: 1,
    title: "AI & Machine Learning Workshop",
    date: "2025-05-20",
    description: "Join us for a deep dive into modern AI tools and ML techniques.",
    category: "Tech",
    image_url: "ai_workshop.jpg",
  },
  {
    id: 2,
    title: "JUST Marathon 2025",
    date: "2025-06-02",
    description: "Run with students, staff, and faculty in our annual JUST marathon!",
    category: "Sports",
    image_url: "marathon.webp",
  },
  {
    id: 3,
    title: "Medical Club First Aid Training",
    date: "2025-05-28",
    description: "Certified hands-on training in emergency response and first aid.",
    category: "Health",
    image_url: "first_aid.jpeg",
  },
];

const FeaturedEventsSection = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(false); 
  const navigate = useNavigate();

  // Fetch function wrapped with useCallback to prevent re-creation
  const fetchFeatured = useCallback(async () => {
    try {
      console.log("Fetching Featured Events...");
      const response = await api.get('/analytics/popular-events-public');
      const data = response?.data || [];
      if (data.length > 0) {
        setEvents(data);
        setIsMock(false);
        console.log("API Data Loaded");
      } else {
        console.warn("API returned no data, using mock events.");
        setEvents(mockEvents);
        setIsMock(true);
      }
    } catch (error) {
      console.error('Failed to fetch featured events:', error.message);
      setEvents(mockEvents);
      setIsMock(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // useEffect with correct dependencies
  useEffect(() => {
    fetchFeatured();
  }, [fetchFeatured]);

  // Handle Explore More Click
  const handleExploreMore = () => {
    navigate('/events');
  };

  return (
    <section className="featured-events-section">
      <h2 className="section-title">
        {isMock ? "Sample Featured Events" : "Featured Events"}
      </h2>

      {loading ? (
        <div className="loading-spinner">
          <LoadingSpinner />
        </div>
      ) : events.length > 0 ? (
        <div className="event-card-grid">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <p className="empty-text">No featured events available right now.</p>
      )}

      {/* New Explore More Button */}
      <button className="explore-more-button" onClick={handleExploreMore}>
        Explore More Events
      </button>
    </section>
  );
};

export default FeaturedEventsSection;
