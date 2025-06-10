import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import NavBar from '../../components/common/NavBar';
import Footer from '../../components/common/Footer';
import "../../pages/Booking/styles/BookingDetails.css";

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const res = await api.get(`/booking/bookings/${id}`);
        setBooking(res.data.data);
      } catch (error) {
        toast.error('Failed to fetch booking details');
      } finally {
        setLoading(false);
      }
    };
    fetchBookingDetails();
  }, [id]);

  if (loading) return <div className="booking-details"><p>Loading...</p></div>;
  if (!booking) return <div className="booking-details"><p>No booking found.</p></div>;

  return (
    <>
      <NavBar />
      <div className="booking-details">
        <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
        <h1>Booking Details</h1>

        <div className="details-card">
          <h2>{booking.room_name}</h2>
          <p><strong>Purpose:</strong> {booking.purpose}</p>
          <p><strong>Start Time:</strong> {new Date(booking.start_time).toLocaleString()}</p>
          <p><strong>End Time:</strong> {new Date(booking.end_time).toLocaleString()}</p>
          <p><strong>Status:</strong> {booking.status}</p>
          <p><strong>Booked By:</strong> {booking.user_name}</p>
          <p><strong>Email:</strong> {booking.user_email}</p>
          <p><strong>Created At:</strong> {new Date(booking.created_at).toLocaleString()}</p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BookingDetails;
