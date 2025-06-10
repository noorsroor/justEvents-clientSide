// src/components/notifications/NotificationItem.jsx
import React from 'react';
import { markAsRead } from '../../services/notificationService';
import './notifications.css';

const NotificationItem = ({ notification, onUpdate }) => {
  const { id, message, type, created_at, is_read } = notification;

  const handleClick = async () => {
    if (!is_read) {
      await markAsRead(id);
      onUpdate(); // Refetch list or update state
    }
  };

  return (
    <div
      className={`notification-card ${type} ${is_read ? 'read' : 'unread'}`}
      onClick={handleClick}
    >
      <div className="message">{message}</div>
      <div className="timestamp">{new Date(created_at).toLocaleString()}</div>
    </div>
  );
};

export default NotificationItem;
