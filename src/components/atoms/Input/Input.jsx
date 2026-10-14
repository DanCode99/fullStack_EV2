
export function Input({
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  readOnly = false,
  className = '',
  hasError = false
}) {
  const inputClass = `input ${hasError ? 'is-danger' : ''} ${className}`.trim()

  return (
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      readOnly={readOnly}
      className={inputClass}
    />
  )
}
