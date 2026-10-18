import React from 'react'

export function Badge({ children, variant = 'primary', className = '' }) {
  return (
    <span className={`tag is-${variant} ${className}`.trim()}>
      {children}
    </span>
  )
}

export default Badge
