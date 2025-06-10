import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import './feedbackForm.css';

const MAX_COMMENT_LENGTH = 500;

const FeedbackForm = ({ eventId, onFeedbackSubmitted, existingFeedback }) => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('accessToken');

  const isEdit = !!existingFeedback;

  /**
   * Populate state if editing
   */
  useEffect(() => {
    if (isEdit) {
      setComment(existingFeedback.comment);
      setRating(existingFeedback.rating);
    } else {
      const savedComment = localStorage.getItem('savedComment');
      const savedRating = localStorage.getItem('savedRating');
      if (savedComment) setComment(savedComment);
      if (savedRating) setRating(Number(savedRating));
    }
  }, [isEdit, existingFeedback]);

  /**
   * Handle Form Submission (POST or PUT)
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      localStorage.setItem('savedComment', comment);
      localStorage.setItem('savedRating', rating);
      localStorage.setItem('redirectAfterLogin', location.pathname);
      toast.warning('You need to be logged in to submit feedback.');
      return navigate('/login');
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');

      if (isEdit) {
        // Edit feedback (PUT)
        await api.put(`/api/feedback/${existingFeedback.id}`, { comment, rating }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Feedback updated!');
      } else {
        // New feedback (POST)
        await api.post(`/api/events/${eventId}/feedback`, { comment, rating }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Feedback submitted!');
      }

      localStorage.removeItem('savedComment');
      localStorage.removeItem('savedRating');
      setComment('');
      setRating(5);
      onFeedbackSubmitted();
    } catch (error) {
      console.error(error.message);
      if (error.response?.status === 409) {
        toast.error('You have already submitted feedback.');
      } else if (error.response?.status === 403) {
        toast.error('Not allowed.');
      } else {
        toast.error('Error submitting feedback.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      <h3>{isEdit ? 'Edit Your Feedback' : 'Share Your Experience'}</h3>

      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((num) => (
          <span
            key={num}
            className={`star ${num <= rating ? 'active' : ''}`}
            onClick={() => setRating(num)}
          >
            ★
          </span>
        ))}
      </div>

      <textarea
        placeholder="Write your feedback..."
        value={comment}
        onChange={(e) => setComment(e.target.value.slice(0, MAX_COMMENT_LENGTH))}
        required
      />
      <div className="char-counter">{comment.length} / {MAX_COMMENT_LENGTH}</div>

      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : isEdit ? 'Update Feedback' : 'Submit Feedback'}
      </button>
    </form>
  );
};

export default FeedbackForm;
