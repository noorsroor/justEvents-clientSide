import React from 'react';

const StatCard = ({ title, value }) => {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '2px solid #4F959D',
        padding: '1.5rem',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        textAlign: 'center',
        minWidth: '200px',
        height: '120px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <h4
        style={{
          marginBottom: '0.5rem',
          color: '#113A5D',
          fontSize: '1.1rem',
        }}
      >
        {title}
      </h4>
      <p
        style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#062743',
          margin: 0,
        }}
      >
        {value ?? '—'}
      </p>
    </div>
  );
};

export default StatCard;
