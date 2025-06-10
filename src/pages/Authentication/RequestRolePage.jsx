import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './requestRole.css';

const validRoles = ['Organizer', 'Campus Admin', 'Visitor'];

const RequestRolePage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch user info from localStorage
  useEffect(() => {
    console.log(" RequestRolePage Loaded");

    const accessToken = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role');
    const user = JSON.parse(localStorage.getItem('user') ?? '{}');

    console.log(" Local Storage Data →", { accessToken, role, user });

    if (!accessToken || !role || !user.name) {
      toast.error("You are not authenticated. Redirecting...");
      navigate('/login');
      return;
    }

    if (role.trim().toLowerCase() !== 'pending') {
      toast.info("You already have a role.");
      navigate('/home');
      return;
    }

    setUserData(user);
  }, [navigate]);

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleFileChange = (e) => {
    setAttachmentFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');

    if (!selectedRole || !validRoles.includes(selectedRole)) {
      toast.warning("Please select a valid role.");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('requested_role', selectedRole);
      if (attachmentFile) {
        formData.append('attachment', attachmentFile);
      }

      const response = await fetch('http://localhost:5000/auth/request-role', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Role request submitted!");
        navigate('/home');
      } else {
        toast.error(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Role request error:", err);
      toast.error("Failed to submit role request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="request-role-container">
      <h2>Request Your Role</h2>
      {userData ? (
        <form onSubmit={handleSubmit} className="request-role-form">
          <p>Welcome, <strong>{userData.name}</strong>. Please select your role below:</p>

          <label>
            Select Role:
            <select value={selectedRole} onChange={handleRoleChange} required>
              <option value="">-- Choose Role --</option>
              {validRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>

          <label>
            Optional File (ID / Proof):
            <input type="file" accept=".pdf,.jpg,.png" onChange={handleFileChange} />
          </label>

          <button type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      ) : (
        <p>Loading user info...</p>
      )}
    </div>
  );
};

export default RequestRolePage;
