import React, { useEffect, useState } from 'react';
import { addRoom, updateRoom } from '../../services/campus/roomService';
import { toast } from 'react-toastify';
import './roomFormModal.css';

const RoomFormModal = ({ open, onClose, onSuccess, existing, buildings }) => {
  const [name, setName] = useState('');
  const [buildingId, setBuildingId] = useState('');
  const [capacity, setCapacity] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setName(existing?.name || '');
    setBuildingId(existing?.building_id || '');
    setCapacity(existing?.capacity || '');
  }, [existing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name,
        building_id: buildingId,
        capacity: parseInt(capacity),
      };

      if (existing) {
        await updateRoom(existing.id, payload);
        toast.success('Room updated.');
      } else {
        await addRoom(payload);
        toast.success('Room added.');
      }

      onSuccess();
      onClose();
    } catch {
      toast.error('Failed to save room.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <form onSubmit={handleSubmit} className="modal-form">
        <h3 className="modal-title">{existing ? 'Edit Room' : 'Add Room'}</h3>

        <div className="input-wrapper">
          <input
            type="text"
            id="roomName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder=" "
            className="input-field"
          />
          <label htmlFor="roomName" className="input-label">Room Name</label>
        </div>

        <div className="input-wrapper">
          <select
            id="buildingSelect"
            value={buildingId}
            onChange={(e) => setBuildingId(e.target.value)}
            required
            className="select-field"
          >
            <option value="" disabled>Select Building</option>
            {buildings.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          <label htmlFor="buildingSelect" className="input-label">Building</label>
        </div>

        <div className="input-wrapper">
          <input
            type="number"
            id="roomCapacity"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            required
            min={1}
            max={200}
            placeholder=" "
            className="input-field"
          />
          <label htmlFor="roomCapacity" className="input-label">Capacity</label>
        </div>

        <div className="modal-buttons">
          <button
            type="button"
            onClick={onClose}
            className="modal-button cancel-btn"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="modal-button submit-btn"
          >
            {submitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoomFormModal;
