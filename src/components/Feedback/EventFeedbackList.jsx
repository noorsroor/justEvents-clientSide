import React, { useEffect, useState } from 'react';
import { fetchEventFeedback } from '../../services/feedbackService';
import api from '../../services/api';
import { FaStar, FaRegStar } from 'react-icons/fa';
import FeedbackForm from './FeedbackForm';
import { toast } from 'react-toastify';
import './eventFeedback.css';

const EventFeedbackList = ({ eventId, refresh, onFeedbackSubmitted }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [editFeedback, setEditFeedback] = useState(null);

  // ✅ Parse userId once and use string for strict match
  const storedId = localStorage.getItem('userId');
  const currentUserId = storedId ? String(storedId) : null;

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        setError(false);

        if (!eventId) {
          console.error('Event ID is missing.');
          setError(true);
          setLoading(false);
          return;
        }

        const res = await fetchEventFeedback(eventId);

        if (res.data && res.data.success) {
          setFeedbacks(res.data.data);
        } else {
          console.error('Unexpected response format:', res.data);
          setFeedbacks([]);
        }
      } catch (error) {
        console.error('Error fetching feedback:', error.message);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [eventId, refresh]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('accessToken');
      await api.delete(`/api/feedback/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Feedback deleted');
      onFeedbackSubmitted(); // ✅ refetch parent
    } catch (err) {
      toast.error('Failed to delete feedback');
    }
  };

  const handleEdit = (feedback) => {
    setEditFeedback(feedback);
  };

  if (loading) return <p className="text-center mt-4">Loading feedback...</p>;
  if (error) return <p className="text-center mt-4">Failed to load feedback. Please try again later.</p>;
  if (feedbacks.length === 0) return <p className="text-center mt-4">No feedback yet for this event.</p>;

  return (
    <div className="feedback-list">
      <h4 className="feedback-heading">What Attendees Said</h4>

      {editFeedback && (
        <FeedbackForm
          eventId={eventId}
          existingFeedback={editFeedback}
          onFeedbackSubmitted={() => {
            setEditFeedback(null);
            onFeedbackSubmitted(); // ✅ trigger parent refresh
          }}
        />
      )}

      {feedbacks.map(({ id, rating, comment, created_at, updated_at, is_edited, user_name, user_id }) => {
        const isAuthor = String(user_id) === currentUserId;

        return (
          <div key={id} className="feedback-item">
            <div className="feedback-meta">
              <span className="feedback-user">{user_name || 'Anonymous Attendee'}</span>
              <span className="feedback-date">
                {Number(is_edited) === 1
                  ? `Edited on ${new Date(updated_at).toLocaleDateString('en-GB')}`
                  : `Posted on ${new Date(created_at).toLocaleDateString('en-GB')}`}
              </span>
            </div>

            <p className="feedback-comment">“{comment}”</p>

            <div className="feedback-rating">
              {[...Array(5)].map((_, index) =>
                index < rating ? (
                  <FaStar key={index} color="#f5b301" />
                ) : (
                  <FaRegStar key={index} color="#c7c7c7" />
                )
              )}
            </div>

            {isAuthor && (
              <div className="feedback-actions">
                <button onClick={() => handleEdit({ id, comment, rating })}>Edit</button>
                <button onClick={() => handleDelete(id)}>Delete</button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default EventFeedbackList;
