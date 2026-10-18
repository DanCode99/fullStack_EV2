import React from 'react'

export function Heading({ level = 2, children, className = '' }) {
  const Tag = `h${level}`
  const sizeClass = `is-size-${level}`
  return (
    <Tag className={`title ${sizeClass} ${className}`.trim()}>
      {children}
    </Tag>
  )
}

export default Heading
