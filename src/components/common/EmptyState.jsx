// src/components/common/EmptyState.jsx
import React from 'react';
import './emptyState.css';

const EmptyState = ({ message, actionLabel, onAction }) => {
  return (
    <div className="empty-state">
      <p className="empty-text">{message}</p>
      {onAction && (
        <button className="empty-action-btn" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
