import React, { useEffect, useState } from 'react';
import './PendingUsersPage.css';
import { fetchPendingUsers, approveUser, rejectUser } from '../../../services/adminService';
import { toast } from 'react-toastify';
import NavBar from '../../../components/common/NavBar';
import Footer from '../../../components/common/Footer';

const PendingUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingUsers()
      .then(res => setUsers(res.data.data || []))
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveUser(id);
      toast.success("User approved!");
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch {
      toast.error("Approval failed");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectUser(id);
      toast.info("User rejected");
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch {
      toast.error("Rejection failed");
    }
  };

  return (
    <>
      <NavBar />
      <div className="pending-users-page">
        <h2>Pending User Approvals</h2>

        {loading ? (
          <p className="pending-users-loading">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="empty-message">No pending users 🎉</p>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Requested Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.requested_role}</td>
                  <td>
                    <button className="approve-btn" onClick={() => handleApprove(user.id)}>Approve</button>
                    <button className="reject-btn" onClick={() => handleReject(user.id)}>Reject</button>
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

export default PendingUsersPage;
