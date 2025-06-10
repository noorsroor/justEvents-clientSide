import React, { useState, useEffect } from 'react';

const EventForm = ({ initialValues, onSubmit, isEditing = false, buttonLabel = 'Create Event' }) => {
  const [formData, setFormData] = useState({ ...initialValues });
  const [previewImage, setPreviewImage] = useState(null);
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    fetch('/api/rooms') // تأكد من ربطك الصحيح مع API
      .then((res) => res.json())
      .then((data) => setVenues(data))
      .catch((err) => console.error('Failed to load venues', err));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = new FormData();
    for (const key in formData) {
      payload.append(key, formData[key]);
    }
    onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#F9F9F9] max-w-2xl mx-auto p-8 rounded-2xl shadow-md space-y-6"
    >
      <h2 className="text-2xl font-semibold text-[#062743]">
        {isEditing ? 'Edit Event' : 'Create New Event'}
      </h2>

      <div>
        <label className="block text-[#113A5D] mb-1">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title || ''}
          onChange={handleChange}
          className="w-full border border-[#4F959D] p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block text-[#113A5D] mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          rows="4"
          className="w-full border border-[#4F959D] p-2 rounded"
          required
        />
      </div>

      <div className="flex gap-4">
        <div className="w-1/2">
          <label className="block text-[#113A5D] mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date || ''}
            onChange={handleChange}
            className="w-full border border-[#4F959D] p-2 rounded"
            required
          />
        </div>

        <div className="w-1/2">
          <label className="block text-[#113A5D] mb-1">Time</label>
          <input
            type="time"
            name="time"
            value={formData.time || ''}
            onChange={handleChange}
            className="w-full border border-[#4F959D] p-2 rounded"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-[#113A5D] mb-1">Venue</label>
        <select
          name="venue_id"
          value={formData.venue_id || ''}
          onChange={handleChange}
          className="w-full border border-[#4F959D] p-2 rounded"
          required
        >
          <option value="">Select Venue</option>
          {venues.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[#113A5D] mb-1">Image</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="w-full"
        />
        {previewImage && (
          <img
            src={previewImage}
            alt="Preview"
            className="mt-2 w-48 h-auto rounded shadow"
          />
        )}
      </div>

      <button
        type="submit"
        className="bg-[#113A5D] text-white px-6 py-2 rounded hover:bg-[#4F959D] transition"
      >
        {buttonLabel}
      </button>
    </form>
  );
};

export default EventForm;
