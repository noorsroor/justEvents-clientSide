import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import api from '../../services/api';
import NavBar from '../../components/common/NavBar';
import Footer from '../../components/common/Footer';

import './styles/RoomCalendarView.css';

const localizer = momentLocalizer(moment);

const RoomCalendarView = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/booking/bookings/me');
        const bookings = res.data.data || [];

        const formatted = bookings
          .filter(b => b.start_time && b.end_time)
          .map(b => ({
            id: b.id,
            title: `📍 ${b.room_name} – ${b.purpose}`,
            start: new Date(b.start_time),
            end: new Date(b.end_time),
            status: b.status,
            className: `${b.status.toLowerCase()}-event` // Add class for CSS targeting
          }));

        setEvents(formatted);
      } catch (err) {
        console.error('RoomCalendar error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const eventStyleGetter = (event) => {
    let bgColor = '#4F959D';
    let textColor = '#062743';

    if (event.status === 'Pending') {
      bgColor = '#113A5D';
      textColor = '#ffffff';
    }
    if (event.status === 'Approved') {
      bgColor = '#98D2C0';
      textColor = '#062743';
    }
    if (event.status === 'Rejected') {
      bgColor = '#d9534f';
      textColor = '#ffffff';
    }

    return {
      className: event.className,
      style: {
        backgroundColor: bgColor,
        color: textColor,
        borderRadius: '10px',
        padding: '4px 8px',
        fontWeight: 600,
        fontSize: '14px',
        border: 'none',
        boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
      }
    };
  };

  return (
    <>
      <NavBar />
      <div className="room-calendar">
        <button className="back-button" onClick={() => window.history.back()}>
          ← Back
        </button>
        <h1>Room Booking Calendar</h1>

        <div className="legend">
          <span className="badge approved">Approved</span>
          <span className="badge pending">Pending</span>
          <span className="badge rejected">Rejected</span>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="calendar-container">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              defaultView="month"
              eventPropGetter={eventStyleGetter}
              style={{ height: 600 }}
            />
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default RoomCalendarView;
