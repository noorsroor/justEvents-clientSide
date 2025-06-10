import api from './api';

/**
 * PUBLIC ROUTES (Unauthenticated Users)
 */
export const getPopularEventsPublic = () => api.get('/analytics/popular-events-public');
export const getPublicStats = () => api.get('/analytics/summary-public');

/**
 * FETCH EVENTS
 */
export const getAllEvents = (query = '') => api.get(`/api/events${query}`);
export const getPopularEvents = () => api.get('/analytics/popular-events');
export const getEventById = (id) => api.get(`/api/events/${id}`);

/**
 * CREATE EVENT (Organizer Only)
 */
export const createEvent = async (formData) => {
  try {
    const response = await api.post('/api/events', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (err) {
    console.error('Failed to create event:', err.message);
    throw new Error(err.response?.data?.message || 'Event creation failed');
  }
};

/**
 * EDIT EVENT (Organizer Only)
 */
export const editEvent = async (id, formData) => {
  try {
    const response = await api.put(`/api/events/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (err) {
    console.error('Failed to edit event:', err.message);
    throw new Error(err.response?.data?.message || 'Event update failed');
  }
};

/**
 * DELETE EVENT (Organizer Only)
 */
export const deleteEvent = async (id) => {
  try {
    const response = await api.delete(`/api/events/${id}`);
    return response.data;
  } catch (err) {
    console.error('Failed to delete event:', err.message);
    throw new Error(err.response?.data?.message || 'Event deletion failed');
  }
};

/**
 * EXPORT ALL
 */
const eventService = {
  getAllEvents,
  getPopularEvents,
  getPopularEventsPublic,
  getEventById,
  getPublicStats,
  createEvent,
  editEvent,
  deleteEvent,
};

export default eventService;
