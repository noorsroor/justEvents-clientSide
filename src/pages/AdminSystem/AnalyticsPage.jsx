import React, { useEffect, useState } from 'react';
import './AnalyticsPage.css';
import { toast } from 'react-toastify';

import {
  fetchCategoryStats,
  fetchPopularEvents,
  fetchRsvpTrends,
  fetchExpiryStats,
  fetchTotalBookings,
  fetchMostUsedRooms,
  fetchBookingTrends,
  fetchBookingsByBuilding,
  fetchBookingCancelRate,
} from '../../services/adminService';

import NavBar from '../../components/common/NavBar';
import Footer from '../../components/common/Footer';

import {
  PieChart, Pie, Cell, Tooltip, BarChart, Bar,
  XAxis, YAxis, ResponsiveContainer, LineChart, Line
} from 'recharts';

import {
  BarChart2, PieChart as PieChartIcon,
  TrendingUp, Building2, Star
} from 'lucide-react';

const COLORS = ['#4F959D', '#062743', '#113A5D', '#98D2C0', '#F9F9F9', '#FFB347', '#B19CD9'];

const AnalyticsPage = () => {
  const [categoryStats, setCategoryStats] = useState([]);
  const [popularEvents, setPopularEvents] = useState([]);
  const [rsvpTrends, setRsvpTrends] = useState([]);
  const [expiryStats, setExpiryStats] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [mostUsedRooms, setMostUsedRooms] = useState([]);
  const [bookingTrends, setBookingTrends] = useState([]);
  const [bookingsByBuilding, setBookingsByBuilding] = useState([]);
  const [cancelRate, setCancelRate] = useState(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [
          cat, pop, rsvp, exp, total, used, trend, byBuilding, cancel
        ] = await Promise.all([
          fetchCategoryStats(),
          fetchPopularEvents(),
          fetchRsvpTrends(),
          fetchExpiryStats(),
          fetchTotalBookings(),
          fetchMostUsedRooms(),
          fetchBookingTrends(),
          fetchBookingsByBuilding(),
          fetchBookingCancelRate(),
        ]);

        setCategoryStats(Array.isArray(cat) ? cat : []);
        setPopularEvents(Array.isArray(pop) ? pop : []);
        setRsvpTrends(Array.isArray(rsvp) ? rsvp : []);

    
        const formattedExpiry = [
          { status: 'Upcoming Events', count: parseInt(exp.upcoming_events || 0) },
          { status: 'Past Events', count: parseInt(exp.past_events || 0) }
        ];
        setExpiryStats(formattedExpiry);

        setTotalBookings(total?.count || 0);

        const formattedRooms = (Array.isArray(used) ? used : []).map(room => ({
          room: room.name || `Room ${room.room_id || room.id}`,
          count: room.bookings || room.count || 0
        }));
        setMostUsedRooms(formattedRooms);

        const formattedTrends = (Array.isArray(trend) ? trend : []).map(entry => ({
          date: entry.date,
          count: entry.count
        }));
        setBookingTrends(formattedTrends);

        const formattedBuildings = (Array.isArray(byBuilding) ? byBuilding : []).map(entry => ({
          building: entry.building,
          count: entry.bookings || entry.count || 0
        }));
        setBookingsByBuilding(formattedBuildings);

        setCancelRate(cancel || {});
      } catch (err) {
        console.error('Analytics fetch error:', err);
        toast.error('Failed to load analytics data');
      }
    };

    loadAnalytics();
  }, []);

  return (
    <>
      <NavBar />
      <div className="analytics-page">
        <h2 className="page-title">System Analytics Overview</h2>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card">
            <span>Total Bookings</span>
            <strong>{totalBookings}</strong>
          </div>
          <div className="summary-card">
            <span>Cancelled Rate</span>
            <strong>{cancelRate?.cancel_rate || '0%'}</strong>
          </div>
        </div>

        {/* Popular Events */}
        <div className="analytics-section">
          <h3><Star size={18} /> Top Popular Events</h3>
          {popularEvents.length === 0 ? (
            <p>No data available.</p>
          ) : (
            <ul className="event-list">
              {popularEvents.map((e, i) => (
                <li key={e.id || i}>
                  <strong>{e.title}</strong> — {e.rsvp_count} RSVPs
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* RSVP Trends */}
        <div className="analytics-section">
          <h3><TrendingUp size={18} /> RSVP Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={rsvpTrends}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#113A5D" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Expiry Status */}
        <div className="analytics-section">
          <h3><PieChartIcon size={18} /> Event Expiry Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={expiryStats} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={100}>
                {expiryStats.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Event Categories */}
        <div className="analytics-section">
          <h3><PieChartIcon size={18} /> Event Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={categoryStats} dataKey="total_events" nameKey="category" cx="50%" cy="50%" outerRadius={100}>
                {categoryStats.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Most Used Rooms */}
        <div className="analytics-section">
          <h3><BarChart2 size={18} /> Most Used Rooms</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mostUsedRooms}>
              <XAxis dataKey="room" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#98D2C0" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Booking Trends */}
        <div className="analytics-section">
          <h3><TrendingUp size={18} /> Booking Trends Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={bookingTrends}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#062743" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bookings By Building */}
        <div className="analytics-section">
          <h3><Building2 size={18} /> Bookings By Building</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bookingsByBuilding}>
              <XAxis dataKey="building" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#FFB347" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AnalyticsPage;
