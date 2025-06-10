import api from '../api';

/**
 * Get total number of bookings
 */
export const getTotalBookings = async () => {
  const response = await api.get('/analytics/bookings/total');
  return response.data.data;
};

/**
 * Get most used rooms for bookings
 */
export const getMostUsedRooms = async () => {
  const response = await api.get('/analytics/bookings/most-used');
  return response.data.data;
};

/**
 * Get booking trends over time
 */
export const getBookingTrends = async () => {
  const response = await api.get('/analytics/bookings/trends');
  return response.data.data;
};

/**
 * Get booking distribution by building
 */
export const getBookingsByBuilding = async () => {
  const response = await api.get('/analytics/bookings/by-building');
  return response.data.data;
};

/**
 * Get rate of booking cancellations
 */
export const getBookingCancelRate = async () => {
  const response = await api.get('/analytics/bookings/cancel-rate');
  return response.data.data;
};
