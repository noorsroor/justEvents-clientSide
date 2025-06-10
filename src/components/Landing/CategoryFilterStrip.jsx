// src/components/Events/CategoryFilterStrip.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './categoryFilterStrip.css';

const categories = [
  'All',
  'General',
  'Social',
  'Sports',
  'Academic',
  'Tech',
  'Health',
  'Workshop',
];

const CategoryFilterStrip = ({ onCategoryClick }) => {
  const [currentCategory, setCurrentCategory] = useState('All');
  const navigate = useNavigate();
  const location = useLocation();

  // Detect if we are on the EventsPage or not
  const isOnEventsPage = location.pathname.includes("/events");

  // Read the category from the URL and set it active
  useEffect(() => {
    const categoryFromURL = new URLSearchParams(location.search).get('category');
    if (categoryFromURL && categories.includes(categoryFromURL)) {
      console.log("Category from URL:", categoryFromURL);
      setCurrentCategory(categoryFromURL);
    } else {
      setCurrentCategory('All');
    }
  }, [location.search]);

  const handleClick = (category) => {
    console.log("Category Clicked:", category);
    setCurrentCategory(category);

    if (isOnEventsPage) {
      // If we are on EventsPage, just call the click handler
      if (onCategoryClick) {
        onCategoryClick(category);
      }
    } else {
      // If we are on LandingPage, navigate to the Events page
      const query = category === 'All' ? '' : `?category=${category}`;
      navigate(`/events${query}`);
    }
  };

  return (
    <div className="category-strip-wrapper">
      <div className="category-strip">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-pill ${currentCategory === cat ? 'active' : ''}`}
            onClick={() => handleClick(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilterStrip;
