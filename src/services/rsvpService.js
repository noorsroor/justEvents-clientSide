import api from './api';

export const fetchMyRsvps = async () => {
  const response = await api.get('/api/rsvps/me');
  return response.data.data;
};

