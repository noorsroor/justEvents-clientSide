import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAllEvents } from '../../services/eventService.js';
import EventCard from '../../components/Events/EventCard.jsx';
import SearchBar from '../../components/Landing/SearchBar';
import CategoryFilterStrip from '../../components/Landing/CategoryFilterStrip';
import Footer from '../../components/common/Footer.jsx';
import NavBar from '../../components/common/NavBar.jsx'; 
import './eventsPage.css';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';
  const categoryQuery = searchParams.get('category') || 'All';
  const isUpcoming = searchParams.get('upcoming') === 'true';
  const sortQuery = searchParams.get('sort') || 'latest';

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  const title = isUpcoming
    ? categoryQuery === 'All'
      ? 'Upcoming Events at JUST'
      : `Upcoming ${capitalize(categoryQuery)} Events at JUST`
    : categoryQuery === 'All'
      ? 'Discover Events at JUST'
      : `Explore ${capitalize(categoryQuery)} Events at JUST`;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);

        const filters = new URLSearchParams();
        filters.append('status', 'Approved');
        if (categoryQuery !== 'All') filters.append('category', categoryQuery);
        if (searchQuery) filters.append('search', searchQuery);
        if (isUpcoming) filters.append('upcoming', 'true');
        filters.append('sort', sortQuery);

        const query = `?${filters.toString()}`;
        console.log('[Query Sent]:', query);

        const res = await getAllEvents(query);
        setEvents(res.data?.data || []);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [searchQuery, categoryQuery, isUpcoming, sortQuery]);

  const handleSortChange = (e) => {
    const updated = new URLSearchParams(location.search);
    updated.set('sort', e.target.value);
    navigate(`/events?${updated.toString()}`);
  };

  const handleCategoryClick = (category) => {
    const updated = new URLSearchParams(location.search);
    if (category === 'All') {
      updated.delete('category');
    } else {
      updated.set('category', category);
    }
    navigate(`/events?${updated.toString()}`);
  };

  const toggleUpcoming = () => {
    const updated = new URLSearchParams(location.search);
    if (isUpcoming) {
      updated.delete('upcoming');
    } else {
      updated.set('upcoming', 'true');
    }
    navigate(`/events?${updated.toString()}`);
  };

  return (
    <>
      <NavBar />
      <div className="events-page-container">
        <h1 className="events-title">{title}</h1>

        <div className="filter-bar">
          <SearchBar fromNav={false} />
          <select value={sortQuery} onChange={handleSortChange} className="filter-dropdown">
            <option value="latest">Latest</option>
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        <CategoryFilterStrip onCategoryClick={handleCategoryClick} />

        <button 
          className={`upcoming-events-button ${isUpcoming ? 'active' : ''}`}
          onClick={toggleUpcoming}
        >
          {isUpcoming ? 'Show All Events' : 'View Upcoming Events'}
        </button>

        {loading ? (
          <p className="loading-text">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="empty-text">No events available at this time.</p>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default EventsPage;
