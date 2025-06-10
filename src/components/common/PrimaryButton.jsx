import React from 'react';

const PrimaryButton = ({
  text,
  onClick,
  isLoading = false,
  type = 'button',
  className = '',
  disabled = false,
  loadingText = 'Loading...',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      aria-busy={isLoading}
      aria-label={text}
      title={text}
      className={`w-100 text-white btn ${className}`}
      style={{
        backgroundColor: '#113A5D',
        border: 'none',
        padding: '12px',
        borderRadius: '8px',
        fontWeight: '600',
        fontSize: '16px',
        boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
        cursor: isLoading || disabled ? 'not-allowed' : 'pointer',
        opacity: isLoading || disabled ? 0.7 : 1,
        transition: '0.2s',
      }}
    >
      {isLoading ? (
        <span>
          <span
            className="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          />
          {loadingText}
        </span>
      ) : (
        text
      )}
    </button>
  );
};

export default PrimaryButton;