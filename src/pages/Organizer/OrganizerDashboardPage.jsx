import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../../components/common/NavBar';
import Footer from '../../components/common/Footer';
import {
  FaCheckCircle,
  FaHourglassHalf,
  FaCalendarAlt,
  FaArrowLeft,
  FaPlus,
  FaClipboardList,
  FaStar,
  FaChartLine,
  FaChartPie,
  FaClock
} from 'react-icons/fa';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import './OrganizerDashboardPage.css';

const BASE_URL = 'http://localhost:5000';

const OrganizerDashboardPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [summary, setSummary] = useState({});
  const [trendData, setTrendData] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [featureEvent, setFeatureEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#113a5d', '#4f959d', '#98d2c0', '#062743', '#ccc'];

  const handleAutoCloseExpired = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      };
      const res = await axios.patch(`${BASE_URL}/analytics/events/auto-close-expired`, {}, config);
      alert(res.data.message || 'Expired events auto-closed');
    } catch (err) {
      console.error('Failed to close expired events', err);
      alert('Failed to auto-close expired events.');
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('accessToken');

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        };

        const [summaryRes, trend, categories, feature, calendar] = await Promise.all([
          axios.get(`${BASE_URL}/dashboard/organizer/${user.id}/summary`, config),
          axios.get(`${BASE_URL}/analytics/rsvp-trend`, config),
          axios.get(`${BASE_URL}/analytics/category-stats`, config),
          axios.get(`${BASE_URL}/analytics/events/event-of-the-week`, config),
          axios.get(`${BASE_URL}/analytics/events/calendar?range=month`, config)
        ]);

        setSummary(summaryRes.data.data);
        setTrendData(trend.data.data);
        setCategoryStats(categories.data.data);
        setFeatureEvent(feature.data.data);
        setEvents(calendar.data.data || []);
      } catch (err) {
        console.error('Dashboard analytics fetch failed', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const upcoming = events
    .filter((e) => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="org-dashboard loading-state">
          <p className="loading-text">Loading dashboard...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="org-dashboard">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>

        <h1 className="org-title">Organizer Dashboard</h1>

        {/* Stats Grid */}
        <div className="org-stats">
          <div className="stat-card total">
            <FaClipboardList className="stat-icon" />
            <p>Total Events</p>
            <h3>{summary.total_events || 0}</h3>
          </div>
          <div className="stat-card approved">
            <FaCheckCircle className="stat-icon" />
            <p>Total RSVPs</p>
            <h3>{summary.total_rsvps || 0}</h3>
          </div>
          <div className="stat-card pending">
            <FaHourglassHalf className="stat-icon" />
            <p>Average Rating</p>
            <h3>{summary.avg_rating || 0}</h3>
          </div>
          <div className="stat-card warning" onClick={handleAutoCloseExpired}>
            <FaClock className="stat-icon" />
            <p>Close Expired</p>
            <h3>↻</h3>
          </div>
        </div>

        {/* RSVP Trend Chart */}
        <div className="chart-section">
          <h2><FaChartLine /> RSVP Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#113a5d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Stats Chart */}
        <div className="chart-section">
          <h2><FaChartPie /> Event Categories</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryStats}
                dataKey="total_events"
                nameKey="category"
                outerRadius={100}
                label
              >
                {categoryStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Upcoming Events */}
        <div className="org-upcoming">
          <h2>Upcoming Events</h2>
          {upcoming.length === 0 ? (
            <p className="muted-text">No upcoming events.</p>
          ) : (
            <div className="upcoming-cards">
              {upcoming.map((e) => (
                <div className="upcoming-card" key={e.id}>
                  <FaCalendarAlt className="upcoming-icon" />
                  <div>
                    <h4>{e.title}</h4>
                    <p>{new Date(e.date).toLocaleDateString()} at {e.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Feature Event */}
        {featureEvent && (
          <div className="org-upcoming">
            <h2> Event of the Week</h2>
            <div className="upcoming-card">
              <FaStar className="upcoming-icon" />
              <div>
                <h4>{featureEvent.title}</h4>
                <p>Category: {featureEvent.category} | RSVPs: {featureEvent.rsvp_count} | Avg. Rating: {featureEvent.avg_rating}</p>
              </div>
            </div>
            <br/>
          </div>
        )}

        {/* Quick Links */}
        <div className="org-actions">
          <Link to="/events/create" className="action-btn primary">
            <FaPlus /> Create New Event
          </Link>
          <Link to="/organizer/my-events" className="action-btn secondary">
            <FaClipboardList /> View My Events
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrganizerDashboardPage;
