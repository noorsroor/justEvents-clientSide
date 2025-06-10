import api from './api';

/**
 * Public: Fetch recent feedback for Landing Page
 */
export const getRecentFeedbackPublic = () => api.get('/api/recent-public');

/**
 * Submit feedback for a specific event (Authenticated user)
 * @param {number} eventId
 * @param {object} payload - { comment, rating }
 */
export const submitFeedback = (eventId, payload) =>
  api.post(`/api/events/${eventId}/feedback`, payload);

/**
 * Fetch feedback for a specific event (for display)
 * @param {number} eventId
 */
export const fetchEventFeedback = (eventId) =>
  api.get(`/api/events/${eventId}/feedback`);

/**
 * Export all as object
 */
const feedbackService = {
  getRecentFeedbackPublic,
  submitFeedback,
  fetchEventFeedback,
};

export default feedbackService;
