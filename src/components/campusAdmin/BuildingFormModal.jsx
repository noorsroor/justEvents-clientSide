import React, { useEffect, useState } from 'react';
import { addBuilding, updateBuilding } from '../../services/campus/buildingService';
import { toast } from 'react-toastify';
  import './buildingFormModal.css';

const BuildingFormModal = ({ open, onClose, onSuccess, existing }) => {
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setName(existing?.name || '');
  }, [existing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (existing) {
        await updateBuilding(existing.id, { name });
        toast.success('Building updated.');
      } else {
        await addBuilding({ name });
        toast.success('Building added.');
      }
      onSuccess();
      onClose();
    } catch {
      toast.error('Failed to save building.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;



return (
  <div className="modal-overlay">
    <form onSubmit={handleSubmit} className="modal-form">
      <h3 className="modal-title">{existing ? 'Edit Building' : 'Add Building'}</h3>

      <div className="input-wrapper">
        <input
          type="text"
          id="buildingName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder=" "
          className="input-field"
        />
        <label htmlFor="buildingName" className="input-label">Building Name</label>
      </div>

      <div className="modal-buttons">
        <button type="button" onClick={onClose} className="modal-button cancel-btn" disabled={submitting}>
          Cancel
        </button>
        <button type="submit" disabled={submitting} className="modal-button submit-btn">
          {submitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  </div>
);

};

export default BuildingFormModal;
