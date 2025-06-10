// RejectionReasonModal.jsx
import React from 'react';
import './RejectionReasonModal.css';

const RejectionReasonModal = ({ isOpen, onClose, reason }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay-fixed">
      <div className="modal-box">
        <h3>Rejection Reason</h3>
        <p>{reason || 'No reason provided.'}</p>
        <button className="modal-close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default RejectionReasonModal;