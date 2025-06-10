import api from '../api';

/**
 * Fetch all rooms (includes building info)
 */
export const getRooms = async () => {
  const response = await api.get('/api/rooms');
  return response.data.data;
};

/**
 * Add a new room
 * @param {object} room - Room data (name, type, building_id, etc.)
 */
export const addRoom = async (room) => {
  const response = await api.post('/api/rooms', room);
  return response.data;
};

/**
 * Update a room
 * @param {number} id - Room ID
 * @param {object} updates - Updated data
 */
export const updateRoom = async (id, updates) => {
  const response = await api.put(`/api/rooms/${id}`, updates);
  return response.data;
};

/**
 * Delete a room
 * @param {number} id - Room ID
 */
export const deleteRoom = async (id) => {
  const response = await api.delete(`/api/rooms/${id}`);
  return response.data;
};
