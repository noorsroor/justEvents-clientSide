// src/components/common/LoadingSpinner.jsx
import React from 'react';
import './loadingSpinner.css'; 

const LoadingSpinner = () => {
  return (
    <div className="spinner">
      <div className="double-bounce1"></div>
      <div className="double-bounce2"></div>
    </div>
  );
};

export default LoadingSpinner;
