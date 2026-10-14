export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  variant = 'primary',
  trend,
  onClick
}) {
  const isClickable = typeof onClick === 'function'

  return (
    <div
      className={`box has-background-${variant} has-text-white p-5 ${isClickable ? 'is-clickable' : ''}`}
      onClick={onClick}
      style={{
        borderRadius: '10px',
        boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: isClickable ? 'pointer' : 'default'
      }}
    >
      <div className="is-flex is-justify-content-space-between is-align-items-start mb-2">
        <h3 className="is-size-7 has-text-weight-bold has-text-white-ter is-uppercase" style={{ letterSpacing: '0.5px' }}>
          {title}
        </h3>
        {icon && (
          <span className="is-size-4" role="img" aria-label={title}>
            {icon}
          </span>
        )}
      </div>

      <p className="is-size-3 has-text-weight-bold mb-1" style={{ lineHeight: 1.1 }}>
        {value}
      </p>

      {(subtitle || trend) && (
        <div className="is-flex is-align-items-center is-justify-content-space-between mt-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          {subtitle && (
            <p className="is-size-7 has-text-white-bis mb-0">
              {subtitle}
            </p>
          )}
          {trend && (
            <span className="tag is-small is-light has-text-weight-bold">
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
