import api from './api'; // Axios instance with token + baseURL

/**
 * =====================
 * User Management
 * =====================
 */
export const fetchPendingUsers = () => {
  console.log("Calling GET /admin/pending-users");
  return api.get('/admin/pending-users');
};

export const approveUser = (id) => {
  console.log(`Approving user ID ${id}`);
  return api.patch(`/admin/approve/${id}`);
};

export const rejectUser = (id) => {
  console.log(`Rejecting user ID ${id}`);
  return api.patch(`/admin/reject/${id}`);
};

/**
 * =====================
 * Event Approvals
 * =====================
 */
export const fetchPendingEvents = () => {
  console.log("Calling GET /approve/events");
  return api.get('/approve/events');
};

export const reviewEvent = (eventId, payload) => {
  console.log(`Reviewing event ID ${eventId} with payload`, payload);
  return api.post(`/approve/event/${eventId}`, payload);
};

/**
 * =====================
 * Notification Management
 * =====================
 */
export const fetchNotifications = () => api.get('/notifications');
export const markAsRead = (id) => api.patch(`/notifications/${id}/read`);
export const markAllRead = () => api.patch('/notifications/mark-all-read');
export const deleteOldNotifications = () => api.delete('/notifications/cleanup-old');

/**
 * =====================
 * Dashboard Analytics
 * =====================
 */
export const fetchTotalEvents = () => api.get('/analytics/total-events');
export const fetchTotalRSVPs = () => api.get('/analytics/total-rsvps');
export const fetchTopUsers = () => api.get('/analytics/users/most-engaged');
export const autoCloseExpired = () => api.patch('/analytics/events/auto-close-expired');

export const fetchBookingStats = () => api.get('/booking/bookings/stats');
/**
 * =====================
 * Fixed Analytics Functions 
 * =====================
 */

// EVENTS
export const fetchPopularEvents = async () => {
  const res = await api.get('/analytics/popular-events');
  return res.data.data;
};

export const fetchRsvpTrends = async () => {
  const res = await api.get('/analytics/rsvp-trend');
  return res.data.data;
};

export const fetchCategoryStats = async () => {
  const res = await api.get('/analytics/category-stats');
  return res.data.data;
};

export const fetchExpiryStats = async () => {
  const res = await api.get('/analytics/events/expiry-status');
  return res.data.data;
};

// BOOKINGS
export const fetchTotalBookings = async () => {
  const res = await api.get('/analytics/bookings/total');
  return res.data.data;
};

export const fetchMostUsedRooms = async () => {
  const res = await api.get('/analytics/bookings/most-used');
  return res.data.data;
};

export const fetchBookingTrends = async () => {
  const res = await api.get('/analytics/bookings/trends');
  return res.data.data;
};

export const fetchBookingsByBuilding = async () => {
  const res = await api.get('/analytics/bookings/by-building');
  return res.data.data;
};

export const fetchBookingCancelRate = async () => {
  const res = await api.get('/analytics/bookings/cancel-rate');
  return res.data.data;
};

// EVENT OF THE WEEK (optional)
export const fetchEventOfWeek = async () => {
  const res = await api.get('/analytics/events/event-of-the-week');
  return res.data.data;
};
