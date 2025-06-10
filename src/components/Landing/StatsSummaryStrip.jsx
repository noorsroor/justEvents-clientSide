// src/components/Landing/StatsSummaryStrip.jsx
import React, { useEffect, useState, useCallback } from 'react';
import './statsSummaryStrip.css';
import { CalendarCheck, Users, MessageSquare } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const fallbackStats = {
  eventsHosted: 136,
  activeUsers: 420,
  feedbackReceived: 89,
};

const StatsSummaryStrip = () => {
  const [stats, setStats] = useState(fallbackStats);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      console.log("Fetching Stats...");
      const res = await api.get('/analytics/summary-public');
      if (res.data) {
        setStats({
          eventsHosted: res.data.totalEvents ?? fallbackStats.eventsHosted,
          activeUsers: res.data.totalUsers ?? fallbackStats.activeUsers,
          feedbackReceived: res.data.totalFeedback ?? fallbackStats.feedbackReceived,
        });
      } else {
        console.warn("No data returned, using fallback stats.");
      }
    } catch (err) {
      console.error('Failed to fetch stats summary:', err.message);
      setStats(fallbackStats);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <section className="stats-strip" aria-label="JUSTEvents platform statistics">
      {loading ? (
        <div className="loading-spinner">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <div className="stat-card">
            <div className="stat-icon"><CalendarCheck size={28} color="#062743"/></div>
            <div className="stat-value">{stats.eventsHosted}</div>
            <div className="stat-label">Events Hosted</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><Users size={28} color="#062743"/></div>
            <div className="stat-value">{stats.activeUsers}</div>
            <div className="stat-label">Active Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><MessageSquare size={28} color="#062743"/></div>
            <div className="stat-value">{stats.feedbackReceived}</div>
            <div className="stat-label">Feedback Received</div>
          </div>
        </>
      )}
    </section>
  );
};

export default StatsSummaryStrip;
