import React, { useEffect, useState } from 'react';
import './DashboardPage.css';
import {
  fetchTotalEvents,
  fetchTotalRSVPs,
  fetchTopUsers,
  autoCloseExpired,
  fetchEventOfWeek
} from '../../../services/adminService';
import StatCard from '../components/StatCard';
import { toast } from 'react-toastify';
import NavBar from '../../../components/common/NavBar';
import Footer from '../../../components/common/Footer';

const DashboardPage = () => {
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalRSVPs, setTotalRSVPs] = useState(0);
  const [topUsers, setTopUsers] = useState([]);
  const [eventOfWeek, setEventOfWeek] = useState(null);

  const loadStats = async () => {
    try {
      const resEvents = await fetchTotalEvents();
      const resRSVPs = await fetchTotalRSVPs();
      const resUsers = await fetchTopUsers();
      const resEOW = await fetchEventOfWeek();

      console.log("Events:", resEvents.data);
      console.log("RSVPs:", resRSVPs.data);

      setTotalEvents(resEvents?.data?.data?.count || 0);
      setTotalRSVPs(resRSVPs?.data?.data?.count || 0);
      setTopUsers(resUsers?.data?.data || []);
      setEventOfWeek(resEOW || null);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      toast.error("Failed to load dashboard stats");
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleAutoClose = async () => {
    try {
      const res = await autoCloseExpired();
      toast.success(`${res.data.data.affected} events marked as expired`);
      loadStats(); // reload stats
    } catch {
      toast.error("Failed to close expired events");
    }
  };

  return (
    <>
      <NavBar />
      <div className="dashboard-page">
        <h2>System Admin Dashboard</h2>

        <div className="stats-grid">
          <StatCard title="Total Events" value={totalEvents} />
          <StatCard title="Total RSVPs" value={totalRSVPs} />
          
        </div>

        <div className="top-users">
          <h3>Top Engaged Users</h3>
          {topUsers.length === 0 ? (
            <p>No users yet 💤</p>
          ) : (
            <ul>
              {topUsers.map((user, index) => (
                <li key={user.id}>
                  #{index + 1} — {user.name} ({user.engagement_score} pts)
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="auto-close-container">
          <button onClick={handleAutoClose}>Auto-close expired events</button>
        </div>

        {eventOfWeek && (
          <div className="event-of-week">
            <h3>🌟 Event of the Week</h3>
            <p><strong>Title:</strong> {eventOfWeek.title}</p>
            <p><strong>Category:</strong> {eventOfWeek.category}</p>
            <p><strong>RSVPs:</strong> {eventOfWeek.rsvp_count}</p>
            <p><strong>Avg. Rating:</strong> {eventOfWeek.avg_rating} ⭐</p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default DashboardPage;
