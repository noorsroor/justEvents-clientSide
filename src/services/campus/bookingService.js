import api from '../api';

// GET all pending booking requests (Campus Admin)
export const getPendingBookings = async () => {
  try {
    const response = await api.get('/booking/bookings/pending');
    return response.data.data;
  } catch (err) {
    console.error('Failed to fetch pending bookings:', err.message);
    throw new Error('Could not load booking requests');
  }
};

// PATCH approve/reject booking by ID
export const reviewBooking = async (id, status) => {
  try {
    const response = await api.patch(`/booking/bookings/${id}`, { status });
    return response.data.message;
  } catch (err) {
    console.error(`Failed to update booking status for ID ${id}:`, err.message);
    throw new Error('Booking review failed');
  }
};

// GET booking stats (for analytics/dashboard)
export const getBookingStats = async () => {
  try {
    const response = await api.get('/booking/bookings/stats');
    return response.data.data;
  } catch (err) {
    console.error('Failed to fetch booking stats:', err.message);
    throw new Error('Could not load booking statistics');
  }
};
