import React from 'react';

const SSOButton = ({ provider, onClick, size = 64, disabled = false }) => {
  const logos = {
    google: '/images/google.jpeg',
    microsoft: '/images/outlook.jpeg',
  };

  const capitalized = provider.charAt(0).toUpperCase() + provider.slice(1);
  const logoSrc = logos[provider];

  return (
    <button
      onClick={onClick}
      aria-label={`Login with ${capitalized}`}
      title={`Login with ${capitalized}`}
      disabled={disabled}
      className="border rounded-circle bg-white"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      <img
        src={logoSrc || '/images/default-icon.png'}
        alt={`${capitalized} logo`}
        style={{ width: size / 2, height: size / 2 }}
      />
    </button>
  );
};

export default SSOButton;