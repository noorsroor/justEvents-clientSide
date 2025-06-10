import api from '../api';

/**
 * Fetch all buildings
 */
export const getBuildings = async () => {
  const response = await api.get('/api/buildings');
  return response.data.data;
};

/**
 * Add a new building
 * @param {object} building - { name, description, ... }
 */
export const addBuilding = async (building) => {
  const response = await api.post('/api/buildings', building);
  return response.data;
};

/**
 * Update an existing building
 * @param {number} id - Building ID
 * @param {object} updates - Updated building data
 */
export const updateBuilding = async (id, updates) => {
  const response = await api.put(`/api/buildings/${id}`, updates);
  return response.data;
};

/**
 * Delete a building
 * @param {number} id - Building ID
 */
export const deleteBuilding = async (id) => {
  const response = await api.delete(`/api/buildings/${id}`);
  return response.data;
};
