import React from 'react';

const BookingCard = ({ booking }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2">{booking.room_name}</h2>
      <p><strong>Purpose:</strong> {booking.purpose}</p>
      <p><strong>Start Time:</strong> {new Date(booking.start_time).toLocaleString()}</p>
      <p><strong>End Time:</strong> {new Date(booking.end_time).toLocaleString()}</p>
      <p><strong>Status:</strong> {booking.status}</p>
    </div>
  );
};

export default BookingCard;
