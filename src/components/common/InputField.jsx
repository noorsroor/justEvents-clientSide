import React, { useState } from 'react';

const InputField = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  name,
  id,
  autoFocus = false,
  error = '',
  className = '',
  showToggle = false, // for password toggle
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || name;

  const resolvedType =
    type === 'password' && showToggle ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="mb-3">
      {label && <label htmlFor={inputId} className="form-label">{label}</label>}
      <div className="position-relative">
        <input
          id={inputId}
          type={resolvedType}
          className={`form-control ${className} ${error ? 'is-invalid' : ''}`}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          name={name}
          required
          autoFocus={autoFocus}
          disabled={disabled}
          inputMode={type === 'email' ? 'email' : undefined}
        />
        {type === 'password' && showToggle && (
          <span
            className="position-absolute top-50 end-0 translate-middle-y me-3"
            style={{ cursor: 'pointer' }}
            onClick={() => setShowPassword((prev) => !prev)}
            role="button"
            aria-label="Toggle password visibility"
          >
            {showPassword ? '👁️' : '🙈'}
          </span>
        )}
      </div>
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default InputField;