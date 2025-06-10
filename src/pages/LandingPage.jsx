// src/pages/LandingPage.jsx
import React from 'react';
import './landingPage.css';
import HeroCarousel from '../components/Landing/HeroCarousel.jsx';
import Footer from '../components/common/Footer.jsx';
import NavBar from '../components/common/NavBar.jsx';
import CategoryFilterStrip from '../components/Landing/CategoryFilterStrip';
import FeaturedEventsSection from '../components/Landing/FeaturedEventsSection';
import UpcomingEventsSection from '../components/Landing/UpcomingEventsSection';
import FeedbackQuotesSection from '../components/Landing/FeedbackQuotesSection';
import StatsSummaryStrip from '../components/Landing/StatsSummaryStrip';
import DualCTASection from '../components/Landing/DualCTASection.jsx';

const LandingPage = () => {
  return (
    <div className="landing-container">

      <NavBar />

      {/* Hero Carousel Section */}
      <section className="hero-carousel-section">
        <HeroCarousel />
      </section>

      <CategoryFilterStrip />
      <FeaturedEventsSection />
      <UpcomingEventsSection />
      <FeedbackQuotesSection />
      <StatsSummaryStrip />
      <DualCTASection /> {/* Combined both Room Booking CTA + Organizer CTA */}
      <Footer />
    </div>
  );
};

export default LandingPage;
