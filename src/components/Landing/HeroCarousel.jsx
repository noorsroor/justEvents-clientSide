// src/components/Landing/HeroCarousel.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './heroCarousel.css';

const slides = [
  {
    title: "Ready. Set. Discover.",
    subtitle: "Explore campus events, workshops, and fun activities around JUST.",
    buttonText: "Browse Events",
    link: "/events",
    bg: "#e8f3f1"
  },
  {
    title: "Join the Experience.",
    subtitle: "Create your account and start RSVPing to events you love.",
    buttonText: "Register Now",
    link: "/register",
    bg: "#dceef0"
  },
  {
    title: "Stay in the Loop.",
    subtitle: "Browse and search for events happening this week on campus.",
    buttonText: "Upcoming Events",
    link: "/events?upcoming=true", 
    bg: "#d9e9e5"
  }
];

const HeroCarousel = () => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  const resetInterval = useCallback(() => {
    clearInterval(window.heroCarouselTimer);
    window.heroCarouselTimer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
  }, []);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % slides.length);
    resetInterval();
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
    resetInterval();
  };

  const handleButtonClick = () => {
    // "Upcoming Events" button, toggle the state
    if (slides[index].buttonText === "Upcoming Events") {
      navigate(`/events?upcoming=true`);
    } else {
      navigate(slides[index].link);
    }
  };

  useEffect(() => {
    resetInterval();
    return () => clearInterval(window.heroCarouselTimer);
  }, [resetInterval]);

  return (
    <div className="carousel-container" style={{ backgroundColor: slides[index].bg }}>
      <div className="carousel-content">
        <h1 className="carousel-title">{slides[index].title}</h1>
        <p className="carousel-subtitle">{slides[index].subtitle}</p>
        <button className="carousel-button" onClick={handleButtonClick}>
          {slides[index].buttonText}
        </button>
      </div>

      <div className="carousel-controls">
        <button onClick={prevSlide} aria-label="Previous Slide">&lt;</button>
        <button onClick={nextSlide} aria-label="Next Slide">&gt;</button>
      </div>

      <div className="carousel-dots">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === index ? 'active' : ''}`}
            onClick={() => setIndex(i)}
            aria-current={i === index ? 'true' : 'false'}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
