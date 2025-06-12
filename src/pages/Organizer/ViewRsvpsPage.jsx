import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Footer from '../../components/common/Footer';
import NavBar from '../../components/common/NavBar';
import './ViewRsvpsPage.css';

const ViewRsvpsPage = () => {
  const { id } = useParams(); // Event ID
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRsvps = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get(`https://justevents-serverside.onrender.com/api/events/${id}/rsvps`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const emails = res.data.data.map((rsvp) => rsvp.email); // only email
        setRsvps(emails);
      } catch (err) {
        console.error('Failed to fetch RSVPs', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRsvps();
  }, [id]);

  return (
    <>
      <NavBar />
      <div className="rsvps-wrapper">
        <div className="rsvps-container">
          <h2>RSVP List</h2>
          {loading ? (
            <p>Loading...</p>
          ) : rsvps.length === 0 ? (
            <p>No RSVPs yet for this event.</p>
          ) : (
            <ul className="rsvp-list">
              {rsvps.map((email, index) => (
                <li key={index} className="rsvp-item">{email}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ViewRsvpsPage;
