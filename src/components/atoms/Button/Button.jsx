import React from 'react'

export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = '',
  disabled = false,
  className = '',
  id
}) {
  const variantClass = variant ? `is-${variant}` : ''
  const bootstrapVariant = variant ? `btn-${variant}` : ''
  const sizeClass = size ? `is-${size}` : ''
  const fullClassName = `button ${variantClass} ${bootstrapVariant} ${sizeClass} ${className}`.trim()

  return (
    <button
      id={id}
      type={type}
      className={fullClassName}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button
