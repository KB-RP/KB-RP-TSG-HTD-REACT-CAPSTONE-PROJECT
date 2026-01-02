// src/components/FormInput.jsx
export const FormInput = ({
  id,
  label,
  type,
  value,
  onChange,
  placeholder = '',
  required = false,
  error,
  className = '',
}) => {
  return (
    <div className={`auth__group ${className}`.trim()}>
      <label htmlFor={id} className={`auth__label ${required ? 'auth__label--required' : ''}`.trim()}>
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        className={`auth__input ${error ? 'auth__input--error' : ''}`.trim()}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
      {error && <span className="auth__error">{error}</span>}
    </div>
  );
};