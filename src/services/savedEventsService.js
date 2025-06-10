import api from './api';

/**
 * Fetch all saved events for the logged-in user
 */
export const getSavedEvents = async () => {
  try {
    const response = await api.get('/api/saved-events');
    return response.data.data;
  } catch (err) {
    console.error('Failed to load saved events:', err.message);
    throw new Error('Could not load saved events');
  }
};

/**
 * Save a specific event
 */
export const saveEvent = async (eventId) => {
  try {
    const response = await api.post(`/api/events/${eventId}/save`);
    return response.data.message;
  } catch (err) {
    if (err.response?.status === 409) {
      console.warn('Event already saved');
      throw new Error('Event already saved');
    }
    console.error(`Failed to save event ID ${eventId}:`, err.message);
    throw new Error('Could not save event');
  }
};

/**
 * Remove a saved event
 */
export const unsaveEvent = async (eventId) => {
  try {
    await api.delete(`/api/events/${eventId}/save`);
  } catch (err) {
    console.error(`Failed to unsave event ID ${eventId}:`, err.message);
    throw new Error('Could not unsave event');
  }
};
