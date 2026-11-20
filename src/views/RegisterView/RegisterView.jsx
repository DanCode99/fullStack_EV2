import { useState, useEffect } from 'react'
import { FormField } from '../../components/molecules/FormField/FormField.jsx'
import { Input } from '../../components/atoms/Input/Input.jsx'
import { Button } from '../../components/atoms/Button/Button.jsx'
import { userService } from '../../services/userService.js'

export function RegisterView({ onRegisterUser, onNavigate }) {
  const [regiones, setRegiones] = useState([])
  const [selectedRegionId, setSelectedRegionId] = useState('')
  const [comunas, setComunas] = useState([])
  const [loadingLocations, setLoadingLocations] = useState(false)
  const [loadingSubmit, setLoadingSubmit] = useState(false)

  const [formData, setFormData] = useState({
    run: '',
    nombre: '',
    apellidos: '',
    correo: '',
    fechaNacimiento: '',
    idComuna: '',
    direccion: '',
    password: '',
    confirmPassword: ''
  })

  const [errors, setErrors] = useState({})
  const [backendError, setBackendError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Cargar regiones desde GET /ubicaciones/regiones
  useEffect(() => {
    let isMounted = true
    const loadRegiones = async () => {
      try {
        setLoadingLocations(true)
        const data = await userService.getRegiones()
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setRegiones(data)
          const firstRegId = data[0].idRegion || data[0].id
          setSelectedRegionId(firstRegId)
        }
      } catch (err) {
        console.warn('No se pudieron cargar regiones del backend, usando fallback local:', err)
        // Fallback defensivo si la API de Spring Boot aún no está levantada
        const fallback = [
          { idRegion: 1, nombreRegion: 'Región Metropolitana de Santiago' },
          { idRegion: 2, nombreRegion: 'Región de Valparaíso' },
          { idRegion: 3, nombreRegion: 'Región del Biobío' }
        ]
        if (isMounted) {
          setRegiones(fallback)
          setSelectedRegionId(1)
        }
      } finally {
        if (isMounted) setLoadingLocations(false)
      }
    }
    loadRegiones()
    return () => { isMounted = false }
  }, [])

  // Cargar comunas de la región seleccionada desde GET /ubicaciones/regiones/{id}/comunas
  useEffect(() => {
    if (!selectedRegionId) return
    let isMounted = true
    const loadComunas = async () => {
      try {
        setLoadingLocations(true)
        const data = await userService.getComunasByRegion(selectedRegionId)
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setComunas(data)
          const firstComunaId = data[0].idComuna || data[0].id
          setFormData(prev => ({ ...prev, idComuna: firstComunaId }))
        }
      } catch (err) {
        console.warn(`No se pudieron cargar comunas para la región ${selectedRegionId}:`, err)
        // Fallback defensivo para que el formulario siempre sea operable
        const fallbackComunas = [
          { idComuna: Number(selectedRegionId) * 10 + 1, nombreComuna: 'Comuna Central', idRegion: Number(selectedRegionId) },
          { idComuna: Number(selectedRegionId) * 10 + 2, nombreComuna: 'Comuna Norte', idRegion: Number(selectedRegionId) }
        ]
        if (isMounted) {
          setComunas(fallbackComunas)
          setFormData(prev => ({ ...prev, idComuna: fallbackComunas[0].idComuna }))
        }
      } finally {
        if (isMounted) setLoadingLocations(false)
      }
    }
    loadComunas()
    return () => { isMounted = false }
  }, [selectedRegionId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    if (backendError) setBackendError('')
  }

  const handleRegionChange = (e) => {
    const newRegId = e.target.value
    setSelectedRegionId(newRegId)
  }

  const validate = () => {
    const err = {}
    if (!formData.run.trim() || formData.run.length < 8) err.run = 'RUN inválido (mínimo 8 dígitos sin puntos ni guion)'
    if (!formData.nombre.trim()) err.nombre = 'Nombre obligatorio'
    if (!formData.apellidos.trim()) err.apellidos = 'Apellidos obligatorios'
    if (!formData.correo.trim() || !formData.correo.includes('@')) err.correo = 'Correo electrónico inválido'
    if (!formData.fechaNacimiento) err.fechaNacimiento = 'Fecha de nacimiento requerida'
    if (!formData.idComuna) err.idComuna = 'Debes seleccionar una comuna'
    if (!formData.direccion.trim()) err.direccion = 'Dirección obligatoria'
    if (!formData.password || formData.password.length < 6) err.password = 'La contraseña debe tener al menos 6 caracteres'
    if (formData.password !== formData.confirmPassword) err.confirmPassword = 'Las contraseñas no coinciden'
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBackendError('')
    if (!validate()) return

    // Contrato exacto: POST /auth/registro -> { run, nombre, apellidos, correo, password, idComuna, direccion, fechaNacimiento }
    const payload = {
      run: formData.run.trim(),
      nombre: formData.nombre.trim(),
      apellidos: formData.apellidos.trim(),
      correo: formData.correo.trim(),
      password: formData.password,
      idComuna: Number(formData.idComuna),
      direccion: formData.direccion.trim(),
      fechaNacimiento: formData.fechaNacimiento
    }

    try {
      setLoadingSubmit(true)
      const res = await onRegisterUser(payload)
      if (res?.success) {
        setSuccessMsg('¡Usuario registrado con éxito! Ya puedes iniciar sesión con tus credenciales.')
        setTimeout(() => {
          onNavigate('login')
        }, 1800)
      } else {
        setBackendError(res?.message || 'Error al registrar la cuenta. Verifica que el RUN o correo no existan.')
      }
    } catch (err) {
      setBackendError(err.message || 'Error inesperado al conectar con el servidor.')
    } finally {
      setLoadingSubmit(false)
    }
  }

  return (
    <div className="section min-vh-70">
      <div className="container container-max-750">
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

          {backendError && (
            <div className="notification is-danger is-light mb-4">
              {backendError}
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
                    disabled={loadingSubmit}
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
                    disabled={loadingSubmit}
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
                    disabled={loadingSubmit}
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
                    disabled={loadingSubmit}
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
                    disabled={loadingSubmit}
                  />
                </FormField>
              </div>
            </div>

            <div className="columns">
              <div className="column is-6">
                <div className="field">
                  <label className="label">Región *</label>
                  <div className="control">
                    <div className={`select is-fullwidth ${loadingLocations ? 'is-loading' : ''}`}>
                      <select
                        name="region"
                        value={selectedRegionId}
                        onChange={handleRegionChange}
                        disabled={loadingSubmit || loadingLocations}
                      >
                        {regiones.map(r => {
                          const id = r.idRegion || r.id
                          const name = r.nombreRegion || r.nombre || r.region
                          return (
                            <option key={id} value={id}>
                              {name}
                            </option>
                          )
                        })}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="column is-6">
                <div className="field">
                  <label className="label">Comuna *</label>
                  <div className="control">
                    <div className={`select is-fullwidth ${loadingLocations ? 'is-loading' : ''}`}>
                      <select
                        name="idComuna"
                        value={formData.idComuna}
                        onChange={handleChange}
                        disabled={loadingSubmit || loadingLocations || comunas.length === 0}
                      >
                        {comunas.map(c => {
                          const id = c.idComuna || c.id
                          const name = c.nombreComuna || c.nombre || c.comuna
                          return (
                            <option key={id} value={id}>
                              {name}
                            </option>
                          )
                        })}
                      </select>
                    </div>
                  </div>
                  {errors.idComuna && <p className="help is-danger">{errors.idComuna}</p>}
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
                disabled={loadingSubmit}
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
                    disabled={loadingSubmit}
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
                    disabled={loadingSubmit}
                  />
                </FormField>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className={`is-fullwidth mt-4 ${loadingSubmit ? 'is-loading' : ''}`}
              disabled={loadingSubmit}
            >
              {loadingSubmit ? 'Registrando cuenta...' : 'Registrar Cuenta'}
            </Button>
          </form>

          <hr />

          <div className="has-text-centered">
            <span className="is-size-7 has-text-grey mr-2">¿Ya estás registrado?</span>
            <Button
              variant="light"
              size="small"
              onClick={() => onNavigate('login')}
              disabled={loadingSubmit}
            >
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterView
