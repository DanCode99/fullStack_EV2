
export function FormField({
  label,
  id,
  error,
  children,
  helpText
}) {
  return (
    <div className="field">
      {label && (
        <label className="label" htmlFor={id}>
          {label}
        </label>
      )}
      <div className="control">
        {children}
      </div>
      {error && <p className="help is-danger">{error}</p>}
      {helpText && !error && <p className="help has-text-grey">{helpText}</p>}
    </div>
  )
}

export default FormField

