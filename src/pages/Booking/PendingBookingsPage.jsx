import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import NavBar from '../../components/common/NavBar';
import Footer from '../../components/common/Footer';
import "../../pages/Booking/styles/PendingBookingsPage.css";

const PendingBookingsPage = () => {
  const [pendingBookings, setPendingBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingBookings = async () => {
      try {
        const res = await api.get('/booking/bookings/pending');
        setPendingBookings(res.data.data || []);
      } catch (error) {
        toast.error('Failed to fetch pending bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchPendingBookings();
  }, []);

  const handleReview = async (id, status) => {
    try {
      await api.patch(`/booking/bookings/${id}`, { status });
      toast.success(`Booking ${status.toLowerCase()} successfully`);
      setPendingBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      toast.error('Failed to update booking status');
    }
  };

  return (
    <>
      <NavBar />
      <div className="pending-bookings">
        <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
        <h1>Pending Room Bookings</h1>

        {loading ? (
          <p>Loading...</p>
        ) : pendingBookings.length === 0 ? (
          <p>No pending bookings found.</p>
        ) : (
          <div className="booking-grid">
            {pendingBookings.map((booking) => (
              <div key={booking.id} className="booking-card">
                <button
                  className="details-link"
                  onClick={() => navigate(`/booking/details/${booking.id}`)}
                >
                  View Details →
                </button>
                <h2>{booking.room_name}</h2>
                <p><strong>Purpose:</strong> {booking.purpose}</p>
                <p><strong>Start:</strong> {new Date(booking.start_time).toLocaleString()}</p>
                <p><strong>End:</strong> {new Date(booking.end_time).toLocaleString()}</p>
                <p><strong>Requested by:</strong> {booking.user_name}</p>
                <p><strong>Building:</strong> {booking.building}</p>

                <div className="buttons">
                  <button onClick={() => handleReview(booking.id, 'Approved')} className="approve-button">
                    Approve
                  </button>
                  <button onClick={() => handleReview(booking.id, 'Rejected')} className="reject-button">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default PendingBookingsPage;
