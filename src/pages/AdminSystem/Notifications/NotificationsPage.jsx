import React, { useEffect, useState } from 'react';
import './NotificationsPage.css';
import {
  fetchNotifications,
  markAsRead,
  markAllRead,
  deleteOldNotifications,
} from '../../../services/adminService';
import { toast } from 'react-toastify';
import NavBar from '../../../components/common/NavBar';
import Footer from '../../../components/common/Footer';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = async () => {
    try {
      const res = await fetchNotifications();
      setNotifications(res.data.data || []);
    } catch {
      toast.error('Failed to load notifications');
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    await markAsRead(id);
    toast.success('Marked as read');
    loadNotifications();
  };

  const handleMarkAll = async () => {
    await markAllRead();
    toast.info('All marked as read');
    loadNotifications();
  };

  const handleDeleteOld = async () => {
    await deleteOldNotifications();
    toast.success('Old notifications deleted');
    loadNotifications();
  };

  return (
    <>
      <NavBar />
      <div className="notifications-wrapper">
        <div className="notifications-page">
          <h2>Notifications</h2>

          <div className="actions">
            <button onClick={handleMarkAll}>Mark All as Read</button>
            <button onClick={handleDeleteOld}>Delete Old (30+ days)</button>
          </div>

          {notifications.length === 0 ? (
            <p className="empty-message">No notifications.</p>
          ) : (
            <ul className="notification-list">
              {notifications.map((n) => (
                <li key={n.id} className={n.is_read ? 'read' : 'unread'}>
                  <p style={{ whiteSpace: 'pre-line' }}>
                  {n.message.replace(' submitted', '\nsubmitted')}
                  </p>
                  <small>{new Date(n.created_at).toLocaleString()}</small>
                  {!n.is_read && (
                    <button onClick={() => handleMarkAsRead(n.id)}>Mark as Read</button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default NotificationsPage;
