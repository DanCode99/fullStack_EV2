import { useState } from 'react'
import { FormField } from '../../components/molecules/FormField/FormField.jsx'
import { Input } from '../../components/atoms/Input/Input.jsx'
import { Button } from '../../components/atoms/Button/Button.jsx'

export function LoginView({ onLoginSuccess, onNavigate }) {
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!correo.trim() || !password.trim()) {
      setError('Por favor completa todos los campos.')
      return
    }

    const success = onLoginSuccess(correo, password)
    if (!success) {
      setError('Credenciales incorrectas. Verifica tu correo y contraseña.')
    }
  }

  return (
    <div className="section min-vh-70 is-flex is-align-items-center">
      <div className="container" style={{ maxWidth: '440px' }}>
        <div className="box p-5">
          <div className="has-text-centered mb-5">
            <h1 className="title is-3 mb-2">Iniciar Sesión</h1>
            <p className="subtitle is-6 has-text-grey">
              Accede a tu cuenta de cliente o administración
            </p>
          </div>

          {error && (
            <div className="notification is-danger is-light p-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <FormField label="Correo Electrónico">
              <Input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="Ej: admin@duoc.cl"
                required
              />
            </FormField>

            <FormField label="Contraseña">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="******"
                required
              />
            </FormField>

            <Button
              type="submit"
              variant="primary"
              className="is-fullwidth mt-4"
            >
              Ingresar
            </Button>
          </form>

          <hr />

          <div className="has-text-centered">
            <p className="is-size-7 has-text-grey mb-2">
              ¿No tienes una cuenta aún?
            </p>
            <Button
              variant="light"
              size="small"
              onClick={() => onNavigate('registro')}
            >
              Crear una cuenta nueva
            </Button>
          </div>
        </div>
      </div>

    </div>
  )
}
