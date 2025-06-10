import React, { useEffect, useState } from 'react';
import { getPendingBookings, reviewBooking } from '../../services/campus/bookingService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/common/NavBar';
import Footer from '../../components/common/Footer';
import './campusAdmin.css';
import { HiOutlineBuildingOffice2 } from 'react-icons/hi2';

const CampusBookingRequestsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const navigate = useNavigate();

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await getPendingBookings();
      setBookings(data);
    } catch (err) {
      toast.error('Failed to load booking requests.');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id, status) => {
    if (!window.confirm(`Are you sure you want to ${status.toLowerCase()} this booking?`)) return;

    try {
      setActionLoadingId(id);
      await reviewBooking(id, status);
      toast.success(`Booking ${status.toLowerCase()} successfully.`);
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      toast.error('Failed to update booking.');
    } finally {
      setActionLoadingId(null);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <>
      <NavBar />
      <main className="campus-admin-page">
        {/* Header with icon and back button */}
        <div className="admin-header">
          <button onClick={() => navigate(-1)} className="back-link">← Back</button>
          <div className="admin-title centered">
            <HiOutlineBuildingOffice2 className="title-icon" />
            <h2>Room Booking Requests</h2>
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-xl shadow p-4 border">
          {loading ? (
            <p className="text-center py-6 text-gray-500">Loading...</p>
          ) : (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 border-b">
                  <th className="py-3 px-2">#</th>
                  <th className="px-2">Room</th>
                  <th className="px-2">User</th>
                  <th className="px-2">Start Time</th>
                  <th className="px-2">End Time</th>
                  <th className="px-2">Purpose</th>
                  <th className="px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center text-gray-400 py-6">
                      No pending bookings.
                    </td>
                  </tr>
                ) : (
                  bookings.map((b, idx) => (
                    <tr key={b.id} className="hover:bg-gray-50 border-b">
                      <td className="py-2 px-2">{idx + 1}</td>
                      <td className="px-2">{b.room_name || 'Unknown'}</td>
                      <td className="px-2">{b.user_name}</td>
                      <td className="px-2">{new Date(b.start_time).toLocaleString()}</td>
                      <td className="px-2">{new Date(b.end_time).toLocaleString()}</td>
                      <td className="px-2">{b.purpose}</td>
                      <td className="px-2 flex gap-2 items-center">
                        <button
                          className="action-button approve"
                          disabled={actionLoadingId === b.id}
                          onClick={() => handleReview(b.id, 'Approved')}
                        >
                          {actionLoadingId === b.id ? '...' : 'Approve'}
                        </button>
                        <span>  </span>
                        <button
                          className="action-button reject"
                          disabled={actionLoadingId === b.id}
                          onClick={() => handleReview(b.id, 'Rejected')}
                        >
                          {actionLoadingId === b.id ? '...' : 'Reject'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CampusBookingRequestsPage;
