// src/components/Landing/FeedbackQuotesSection.jsx
import React, { useEffect, useState, useCallback } from 'react';
import './feedbackQuotesSection.css';
import feedbackService from '../../services/feedbackService';
import LoadingSpinner from '../common/LoadingSpinner';

const mockFeedbacks = [
  {
    user_name: "Lina M.",
    comment: "The AI workshop was eye-opening! Definitely coming back next semester.",
  },
  {
    user_name: "Omar H.",
    comment: "I loved the marathon. Great energy and a sense of community at JUST!",
  },
  {
    user_name: "Ranya T.",
    comment: "Organizers were super responsive. Feedback was actually applied later!",
  },
];

const FeedbackQuotesSection = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQuotes = useCallback(async () => {
    try {
      console.log("Fetching Feedback...");
      const res = await feedbackService.getRecentFeedbackPublic();
      if (res.data && res.data.length > 0) {
        setFeedbacks(res.data);
        console.log("API Data Loaded");
      } else {
        console.warn("No data found, switching to mock data");
        setFeedbacks(mockFeedbacks);
      }
    } catch (err) {
      console.error('Failed to load public feedback:', err.message);
      setFeedbacks(mockFeedbacks);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  return (
    <section className="feedback-quotes-section">
      <h2 className="section-title">What Students Are Saying</h2>

      {loading ? (
        <div className="loading-spinner">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="feedback-grid">
          {feedbacks.map((item, index) => (
            <div className="feedback-card" key={index}>
              <p className="feedback-text">" {item.comment} "</p>
              <span className="feedback-user">— {item.user_name}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default FeedbackQuotesSection;
