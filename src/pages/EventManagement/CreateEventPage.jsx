// src/pages/EventManagement/CreateEventPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../../services/eventService';
import api from '../../services/api';
import { toast } from 'react-toastify';
import NavBar from '../../components/common/NavBar';
import Footer from '../../components/common/Footer';
import './CreateEventPage.css';

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [rooms, setRooms] = useState([]);

  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue_id: '',
    image: null,
  });

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get('/api/rooms');
        setRooms(res.data.data);
      } catch (err) {
        console.error('Failed to load rooms:', err.message);
        toast.error('Could not load venue options');
      }
    };

    fetchRooms();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image') {
      const file = files[0];
      if (file) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
          toast.error('Only JPG or PNG files are allowed');
          return;
        }

        setFormValues({ ...formValues, image: file });
        setImagePreview(URL.createObjectURL(file));
      }
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const timeRegex = /^\d{2}:\d{2}$/;

    if (!dateRegex.test(formValues.date)) {
      toast.error('Invalid date format. Use YYYY-MM-DD');
      return;
    }

    if (!timeRegex.test(formValues.time)) {
      toast.error('Invalid time format. Use HH:MM');
      return;
    }

    const formData = new FormData();
    Object.entries(formValues).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      setLoading(true);
      await createEvent(formData);
      toast.success('Event created and pending approval');
      navigate('/organizer/my-events');
    } catch (err) {
      console.error('Create event error:', err);
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Failed to create event');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="create-event-container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h1 className="create-event-heading">Create New Event</h1>

        <form className="event-form" onSubmit={handleCreate}>
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            className="form-input"
            value={formValues.title}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Event Description"
            className="form-input"
            rows="4"
            value={formValues.description}
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="date"
            className="form-input"
            value={formValues.date}
            onChange={handleChange}
            required
          />

          <input
            type="time"
            name="time"
            className="form-input"
            value={formValues.time}
            onChange={handleChange}
            required
          />

          <select
            name="venue_id"
            className="form-input"
            value={formValues.venue_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Venue</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name} — {room.building_name}
              </option>
            ))}
          </select>

          <input
            type="file"
            name="image"
            className="form-input"
            accept="image/jpeg,image/png,image/jpg"
            onChange={handleChange}
          />

          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Creating...' : 'Create Event'}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default CreateEventPage;
