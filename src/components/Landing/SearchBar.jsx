// src/components/Landing/SearchBar.jsx
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import './searchBar.css';

const SearchBar = ({ fromNav = false }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Debounced search handler
  const handleSearch = useCallback(() => {
    const trimmed = query.trim();
    navigate(trimmed ? `/events?search=${encodeURIComponent(trimmed)}` : '/events');
  }, [query, navigate]); 

  // KeyDown Handler
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className={`search-bar-container ${fromNav ? 'from-nav' : ''}`}>
      <input
        type="text"
        placeholder="Search events by name or category..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="search-input"
      />
      <button onClick={handleSearch} className="search-button" aria-label="Search">
        <Search size={20} />
      </button>
    </div>
  );
};

export default SearchBar;
