import React, { useEffect, useState } from 'react';
import {
  getTotalBookings,
  getMostUsedRooms,
  getBookingTrends,
  getBookingsByBuilding,
  getBookingCancelRate,
} from '../../services/campus/analyticsService';
import { getBookingStats } from '../../services/campus/bookingService';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  HiOutlineChartBar,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
} from 'react-icons/hi2';
import { StatCard } from '../../components/campusAdmin/StatCard';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/common/NavBar';
import Footer from '../../components/common/Footer';
import './campusAdmin.css';

const COLORS = ['#062743', '#113A5D', '#4F959D', '#98D2C0', '#ccc'];

const CampusRoomAnalyticsPage = () => {
  const [totalBookings, setTotalBookings] = useState(0);
  const [cancelRate, setCancelRate] = useState(null);
  const [mostUsedRooms, setMostUsedRooms] = useState([]);
  const [bookingTrends, setBookingTrends] = useState([]);
  const [byBuilding, setByBuilding] = useState([]);
  const [stats, setStats] = useState({
    total_pending: 0,
    total_today: 0,
    total_approved: 0,
    total_rejected: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [
          total,
          cancel,
          mostUsed,
          trends,
          buildings,
          bookingStats
        ] = await Promise.all([
          getTotalBookings(),
          getBookingCancelRate(),
          getMostUsedRooms(),
          getBookingTrends(),
          getBookingsByBuilding(),
          getBookingStats(),
        ]);

        setTotalBookings(total.count);
        setCancelRate(cancel.cancel_rate);
        setMostUsedRooms(mostUsed);
        setBookingTrends(trends);
        setByBuilding(buildings);
        setStats(bookingStats);
      } catch (err) {
        toast.error('Failed to load analytics data.');
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchAll();
  }, []);

  return (
    <>
      <NavBar />
      <main className="campus-admin-page">
        <div className="admin-header">
          <button onClick={() => navigate(-1)} className="back-link">← Back</button>
          <div className="admin-title centered">
            <HiOutlineChartBar className="title-icon" />
            <h2>Room Booking Analytics</h2>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="stat-card-grid row-1">
          <StatCard title="Today's Bookings" value={stats.total_today} icon={<HiOutlineClock />} color="bg-[#4F959D]" />
          <StatCard title="Pending" value={stats.total_pending} icon={<HiOutlineChartBar />} color="bg-[#062743]" />
          <StatCard title="Approved" value={stats.total_approved} icon={<HiOutlineCheckCircle />} color="bg-green-500" />
          <StatCard title="Rejected" value={stats.total_rejected} icon={<HiOutlineXCircle />} color="bg-red-500" />
        </div>

        <div className="stat-card-grid row-2">
          <StatCard title="Total Bookings" value={totalBookings} icon={<HiOutlineChartBar />} color="bg-[#113A5D]" />
          <StatCard title="Cancel Rate" value={cancelRate !== null ? `${cancelRate}%` : '0%'} icon={<HiOutlineXCircle />} color="bg-[#ccc]" />
        </div>

        {/* Booking Trends */}
        <div className="analytics-section">
          <h3 className="text-lg font-semibold text-secondary mb-2">Booking Trends</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={bookingTrends}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line dataKey="count" stroke="#4F959D" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Most Used Rooms */}
        <div className="analytics-section">
          <h3 className="text-lg font-semibold text-secondary mb-2">Most Used Rooms</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={mostUsedRooms}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings" fill="#113A5D" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bookings by Building */}
        <div className="analytics-section">
          <h3 className="text-lg font-semibold text-secondary mb-2">Bookings by Building</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={byBuilding}
                dataKey="bookings"
                nameKey="building"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {byBuilding.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CampusRoomAnalyticsPage;
