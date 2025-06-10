import api from './api';

export const fetchNotifications = async (onlyUnread = false) => {
  const response = await api.get(`/notifications${onlyUnread ? '?unread=true' : ''}`);
  return response.data.data;
};

export const markAsRead = (id) => api.patch(`/notifications/${id}/read`);
export const markAllAsRead = () => api.patch(`/notifications/mark-all-read`);
export const deleteOldNotifications = () => api.delete('/notifications/cleanup-old');
