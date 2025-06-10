import React, { useEffect, useState } from 'react';
import './PendingEventsPage.css';
import { fetchPendingEvents, reviewEvent } from '../../../services/adminService';
import { toast } from 'react-toastify';
import NavBar from '../../../components/common/NavBar';
import Footer from '../../../components/common/Footer';

const PendingEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [reasonMap, setReasonMap] = useState({});

  useEffect(() => {
    console.log(" PendingEventsPage mounted");
    fetchPendingEvents()
      .then(res => {
        console.log(" Events API Response:", res.data);
        setEvents(res.data.data || []);
      })
      .catch((err) => {
        console.error(" Failed to fetch events:", err);
        toast.error("Failed to load pending events");
      });
  }, []);

  const handleAction = async (eventId, status) => {
    const reason = reasonMap[eventId] || '';
    if (status === 'Rejected' && reason.trim() === '') {
      toast.warning("Please provide a reason for rejection.");
      return;
    }

    try {
      await reviewEvent(eventId, { status, reason });
      toast.success(`Event ${status.toLowerCase()}!`);
      setEvents(prev => prev.filter(e => e.event_id !== eventId)); 
    }catch (err) {
      console.error("Review event failed:", err);
      const message =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      "Action failed. Please try again.";
      toast.error(`${message}`);
    }
  };

  const handleReasonChange = (eventId, value) => {
    setReasonMap(prev => ({ ...prev, [eventId]: value }));
  };

  return (
    <>
      <NavBar />
      <div className="pending-events-page">
        <h2>Pending Event Approvals</h2>
        {events.length === 0 ? (
          <p className="empty-message">No events awaiting approval 🎉</p>
        ) : (
          <table className="event-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Organizer</th>
                <th>Reason (if reject)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={`${event.event_id}-${event.approval_id}`}>
                  <td>{event.title}</td>
                  <td>{event.date}</td>
                  <td>{event.organizer_name || 'N/A'}</td>
                  <td>
                    <input
                      type="text"
                      placeholder="Reason"
                      value={reasonMap[event.event_id] || ''}
                      onChange={(e) => handleReasonChange(event.event_id, e.target.value)}
                    />
                  </td>
                  <td>
                    <button
                      className="approve-btn"
                      onClick={() => handleAction(event.event_id, 'Approved')}
                    >
                      Approve
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleAction(event.event_id, 'Rejected')}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Footer />
    </>
  );
};

export default PendingEventsPage;
