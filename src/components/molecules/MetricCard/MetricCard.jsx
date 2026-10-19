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
      className={`box has-background-${variant} has-text-white p-5 metric-card-box ${isClickable ? 'is-clickable' : ''}`}
      onClick={onClick}
    >
      <div className="is-flex is-justify-content-space-between is-align-items-start mb-2">
        <h3 className="is-size-7 has-text-weight-bold has-text-white-ter is-uppercase metric-card-title">
          {title}
        </h3>
        {icon && (
          <span className="is-size-4" role="img" aria-label={title}>
            {icon}
          </span>
        )}
      </div>

      <p className="is-size-3 has-text-weight-bold mb-1 metric-card-value">
        {value}
      </p>

      {(subtitle || trend) && (
        <div className="is-flex is-align-items-center is-justify-content-space-between mt-2 pt-2 metric-card-footer">
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

export default MetricCard

