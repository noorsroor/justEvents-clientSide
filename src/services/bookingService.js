import api from '../services/api';

const API_URL = '/booking';

export const createBooking = async (data) => {
  return await api.post(`${API_URL}/bookings`, data);
};

export const getMyBookings = async () => {
  return await api.get(`${API_URL}/bookings/me`);
};

export const cancelBooking = async (id) => {
  return await api.delete(`${API_URL}/bookings/${id}`);
};

export const getPendingBookings = async () => {
  return await api.get(`${API_URL}/bookings/pending`);
};

export const reviewBooking = async (id, status) => {
  return await api.patch(`${API_URL}/bookings/${id}`, { status });
};

export const getBookingStats = async () => {
  return await api.get(`${API_URL}/bookings/stats`);
};
