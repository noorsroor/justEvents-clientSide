import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../../pages/Booking/styles/BookingPage.css";

const BookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("Token not found. Please login first.");
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:5000/api/bookings/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBookings(response.data.data);
      } catch (error) {
        console.error('Failed to fetch bookings:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="booking-page">
      <h1>My Bookings</h1>
      <div className="booking-grid">
        {bookings.map((booking) => (
          <div key={booking.id} className="booking-card">
            <h2>{booking.room_name}</h2>
            <p><strong>Purpose:</strong> {booking.purpose}</p>
            <p><strong>Start Time:</strong> {new Date(booking.start_time).toLocaleString()}</p>
            <p><strong>End Time:</strong> {new Date(booking.end_time).toLocaleString()}</p>
            <p><strong>Status:</strong> {booking.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingPage;
