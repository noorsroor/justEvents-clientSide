import React, { useEffect, useState } from 'react';
import { fetchNotifications, markAllAsRead } from '../../services/notificationService';
import NotificationItem from '../../components/notifications/NotificationItem';
import { toast } from 'react-toastify';
import { FaBell, FaCheckDouble } from 'react-icons/fa'; 
import NavBar from '../../components/common/NavBar'; 
import Footer from '../../components/common/Footer'; 
import './notificationsPage.css';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const data = await fetchNotifications();
      setNotifications(data);
    } catch {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAll = async () => {
    try {
      await markAllAsRead();
      toast.success('All notifications marked as read');
      loadNotifications();
    } catch {
      toast.error('Failed to mark notifications as read');
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <>
      <NavBar />
      <div className="notifications-wrapper">
        <div className="notifications-page">
          <h2><FaBell style={{ marginRight: '10px' }} /> Notifications</h2>

          <button className="mark-all-btn" onClick={handleMarkAll}>
            <FaCheckDouble style={{ marginRight: '8px' }} />
            Mark All as Read
          </button>

          {loading ? (
            <p>Loading...</p>
          ) : notifications.length === 0 ? (
            <p>🎉 You’re all caught up!</p>
          ) : (
            notifications.map((n) => (
              <NotificationItem key={n.id} notification={n} onUpdate={loadNotifications} />
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NotificationsPage;
