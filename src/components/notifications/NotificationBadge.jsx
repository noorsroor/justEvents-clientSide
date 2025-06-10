// src/components/notifications/NotificationBadge.jsx
import React, { useEffect, useState } from 'react';
import { fetchNotifications } from '../../services/notificationService';
import { NavLink } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import './notifications.css';

const NotificationBadge = () => {
  const [count, setCount] = useState(0);

  const loadUnread = async () => {
    try {
      const data = await fetchNotifications(true);
      setCount(data.length);
    } catch {
      setCount(0);
    }
  };

  useEffect(() => {
    loadUnread();
    const interval = setInterval(loadUnread, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <NavLink to="/notifications" className="notification-icon-link">
      <FaBell className="notification-bell" />
      {count > 0 && <span className="notification-badge">{count}</span>}
    </NavLink>
  );
};

export default NotificationBadge;
