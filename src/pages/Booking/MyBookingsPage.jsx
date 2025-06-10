import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';
import NavBar from '../../components/common/NavBar';
import Footer from '../../components/common/Footer';
import "../../pages/Booking/styles/MyBookingsPage.css";

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/booking/bookings/me');
      setBookings(res.data.data || []);
    } catch (err) {
      toast.error('Failed to fetch your bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.delete(`/booking/bookings/${id}`);
      toast.success('Booking cancelled successfully');
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      toast.error('Failed to cancel booking');
    }
  };

  return (
    <>
      <NavBar />

      <div className="my-bookings">
        <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
        <h1>My Room Bookings</h1>

        {loading ? (
          <p>Loading...</p>
        ) : bookings.length === 0 ? (
          <p className="no-bookings">You have no bookings yet.</p>
        ) : (
          <div className="booking-grid">
            {bookings.map((booking) => (
              <div key={booking.id} className="booking-card">
                <button
                  className="details-link"
                  onClick={() => navigate(`/booking/details/${booking.id}`)}
                >
                  View Details →
                </button>
                <h2>{booking.room_name}</h2>
                <p><strong>Building:</strong> {booking.building}</p>
                <p><strong>Purpose:</strong> {booking.purpose}</p>
                <p><strong>Start:</strong> {new Date(booking.start_time).toLocaleString()}</p>
                <p><strong>End:</strong> {new Date(booking.end_time).toLocaleString()}</p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span className={`badge ${booking.status.toLowerCase()}`}>
                    {booking.status}
                  </span>
                </p>


                {booking.status === 'Pending' && (
                  <button onClick={() => handleCancel(booking.id)} className="cancel-button">
                    Cancel Booking
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default MyBookingsPage;
