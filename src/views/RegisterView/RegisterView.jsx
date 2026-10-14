import { useState } from 'react'
import { FormField } from '../../components/molecules/FormField/FormField.jsx'
import { Input } from '../../components/atoms/Input/Input.jsx'
import { Button } from '../../components/atoms/Button/Button.jsx'
import { regionesYcomunas } from '../../data/regiones.js'

export function RegisterView({ onRegisterUser, onNavigate }) {
  const [formData, setFormData] = useState({
    run: '',
    nombre: '',
    apellidos: '',
    correo: '',
    fechaNacimiento: '',
    tipoUsuario: 'Cliente',
    region: regionesYcomunas[0]?.region || '',
    comuna: regionesYcomunas[0]?.comunas[0] || '',
    direccion: '',
    password: '',
    confirmPassword: ''
  })

  const [errors, setErrors] = useState({})
  const [successMsg, setSuccessMsg] = useState('')

  const selectedRegionObj = regionesYcomunas.find(r => r.region === formData.region)
  const availableComunas = selectedRegionObj ? selectedRegionObj.comunas : []

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleRegionChange = (e) => {
    const newReg = e.target.value
    const rObj = regionesYcomunas.find(r => r.region === newReg)
    setFormData(prev => ({
      ...prev,
      region: newReg,
      comuna: rObj?.comunas[0] || ''
    }))
  }

  const validate = () => {
    const err = {}
    if (!formData.run.trim() || formData.run.length < 8) err.run = 'RUN inválido (mínimo 8 dígitos sin puntos)'
    if (!formData.nombre.trim()) err.nombre = 'Nombre obligatorio'
    if (!formData.apellidos.trim()) err.apellidos = 'Apellidos obligatorios'
    if (!formData.correo.trim() || !formData.correo.includes('@')) err.correo = 'Correo electrónico inválido'
    if (!formData.fechaNacimiento) err.fechaNacimiento = 'Fecha de nacimiento requerida'
    if (!formData.direccion.trim()) err.direccion = 'Dirección obligatoria'
    if (!formData.password || formData.password.length < 6) err.password = 'La contraseña debe tener al menos 6 caracteres'
    if (formData.password !== formData.confirmPassword) err.confirmPassword = 'Las contraseñas no coinciden'
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const userToSave = { ...formData }; delete userToSave.confirmPassword;
    const success = onRegisterUser(userToSave)

    if (success) {
      setSuccessMsg('¡Usuario registrado con éxito! Ya puedes iniciar sesión.')
      setTimeout(() => {
        onNavigate('login')
      }, 1500)
    } else {
      setErrors({ run: 'Ya existe un usuario con este RUN registrado.' })
    }
  }

  return (
    <div className="section min-vh-70">
      <div className="container" style={{ maxWidth: '750px' }}>
        <div className="box p-5">
          <div className="has-text-centered mb-5">
            <h1 className="title is-3 mb-2">Crear Cuenta Nueva</h1>
            <p className="subtitle is-6 has-text-grey">
              Únete a nuestra comunidad futbolera y accede a ofertas exclusivas
            </p>
          </div>

          {successMsg && (
            <div className="notification is-success mb-4">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="columns">
              <div className="column is-4">
                <FormField label="RUN (sin puntos ni guion) *" error={errors.run}>
                  <Input
                    name="run"
                    value={formData.run}
                    onChange={handleChange}
                    placeholder="123456789"
                    hasError={!!errors.run}
                  />
                </FormField>
              </div>
              <div className="column is-4">
                <FormField label="Nombre *" error={errors.nombre}>
                  <Input
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Daniel"
                    hasError={!!errors.nombre}
                  />
                </FormField>
              </div>
              <div className="column is-4">
                <FormField label="Apellidos *" error={errors.apellidos}>
                  <Input
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleChange}
                    placeholder="Pérez"
                    hasError={!!errors.apellidos}
                  />
                </FormField>
              </div>
            </div>

            <div className="columns">
              <div className="column is-6">
                <FormField label="Correo Electrónico *" error={errors.correo}>
                  <Input
                    name="correo"
                    type="email"
                    value={formData.correo}
                    onChange={handleChange}
                    placeholder="usuario@correo.com"
                    hasError={!!errors.correo}
                  />
                </FormField>
              </div>
              <div className="column is-6">
                <FormField label="Fecha de Nacimiento *" error={errors.fechaNacimiento}>
                  <Input
                    name="fechaNacimiento"
                    type="date"
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                    hasError={!!errors.fechaNacimiento}
                  />
                </FormField>
              </div>
            </div>

            <div className="columns">
              <div className="column is-6">
                <div className="field">
                  <label className="label">Región *</label>
                  <div className="control">
                    <div className="select is-fullwidth">
                      <select
                        name="region"
                        value={formData.region}
                        onChange={handleRegionChange}
                      >
                        {regionesYcomunas.map(r => (
                          <option key={r.region} value={r.region}>{r.region}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="column is-6">
                <div className="field">
                  <label className="label">Comuna *</label>
                  <div className="control">
                    <div className="select is-fullwidth">
                      <select
                        name="comuna"
                        value={formData.comuna}
                        onChange={handleChange}
                      >
                        {availableComunas.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <FormField label="Dirección de Domicilio *" error={errors.direccion}>
              <Input
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Ej: Pasaje Los Alerces 456"
                hasError={!!errors.direccion}
              />
            </FormField>

            <div className="columns">
              <div className="column is-6">
                <FormField label="Contraseña *" error={errors.password}>
                  <Input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mínimo 6 caracteres"
                    hasError={!!errors.password}
                  />
                </FormField>
              </div>
              <div className="column is-6">
                <FormField label="Confirmar Contraseña *" error={errors.confirmPassword}>
                  <Input
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repite tu contraseña"
                    hasError={!!errors.confirmPassword}
                  />
                </FormField>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="is-fullwidth mt-4"
            >
              Registrar Cuenta
            </Button>
          </form>

          <hr />

          <div className="has-text-centered">
            <span className="is-size-7 has-text-grey mr-2">¿Ya estás registrado?</span>
            <Button
              variant="light"
              size="small"
              onClick={() => onNavigate('login')}
            >
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
