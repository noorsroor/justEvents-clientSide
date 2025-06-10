import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { editEvent, getEventById } from '../../services/eventService';
import api from '../../services/api';
import { toast } from 'react-toastify';
import NavBar from '../../components/common/NavBar';
import Footer from '../../components/common/Footer';
import './EditEventPage.css';

const EditEventPage = () => {
  const { id } = useParams();
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
    const fetchEvent = async () => {
      try {
        const res = await getEventById(id);
        const event = res.data.data;

        const formattedDate = event.date?.split('T')[0]; // ✅ Fix date format

        setFormValues({
          title: event.title,
          description: event.description,
          date: formattedDate || '',
          time: event.time,
          venue_id: event.venue_id,
          image: null,
        });

        if (event.image_url) {
          setImagePreview(`/images/${event.image_url}`);
        }
      } catch (err) {
        console.error('Failed to fetch event details:', err.message);
        toast.error('Failed to load event details');
      }
    };

    const fetchRooms = async () => {
      try {
        const res = await api.get('/api/rooms');
        setRooms(res.data.data);
      } catch (err) {
        console.error('Failed to load rooms:', err.message);
        toast.error('Could not load venue options');
      }
    };

    fetchEvent();
    fetchRooms();
  }, [id]);

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

  const handleEdit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('title', formValues.title);
      formData.append('description', formValues.description);
      formData.append('date', formValues.date);
      formData.append('time', formValues.time);
      formData.append('venue_id', formValues.venue_id);

      if (formValues.image) {
        formData.append('image', formValues.image);
      }

      await editEvent(id, formData);
      toast.success('Event updated successfully');
      navigate('/organizer/my-events');
    } catch (err) {
      console.error('Update event error:', err.message);
      toast.error('Failed to update event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="edit-event-container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 className="edit-event-heading">Edit Event</h1>

        <form className="event-form" onSubmit={handleEdit}>
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
            {loading ? 'Updating...' : 'Update Event'}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default EditEventPage;
