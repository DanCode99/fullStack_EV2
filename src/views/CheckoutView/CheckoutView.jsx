import { useState, useEffect } from 'react'
import { FormField } from '../../components/molecules/FormField/FormField.jsx'
import { Input } from '../../components/atoms/Input/Input.jsx'
import { Button } from '../../components/atoms/Button/Button.jsx'
import { userService } from '../../services/userService.js'

export function CheckoutView({
  cart = [],
  loggedUser,
  onSubmitOrder,
  onNavigate
}) {
  const [regiones, setRegiones] = useState([])
  const [selectedRegionId, setSelectedRegionId] = useState('')
  const [comunas, setComunas] = useState([])
  const [loadingLocations, setLoadingLocations] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const [formData, setFormData] = useState({
    nombre: loggedUser?.nombre || '',
    apellidos: loggedUser?.apellidos || '',
    correo: loggedUser?.correo || '',
    calle: loggedUser?.direccion || '',
    depto: '',
    idComuna: loggedUser?.idComuna || '',
    indicaciones: '',
    metodoPago: 'WEBPAY',
    simularError: false
  })

  const [errors, setErrors] = useState({})

  const total = cart.reduce((acc, item) => acc + (Number(item.precio) * Number(item.cantidad)), 0)

  // Cargar regiones para opciones de despacho
  useEffect(() => {
    let isMounted = true
    const fetchRegiones = async () => {
      try {
        setLoadingLocations(true)
        const data = await userService.getRegiones()
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setRegiones(data)
          setSelectedRegionId(data[0].idRegion || data[0].id)
        }
      } catch (err) {
        console.warn('Ubicaciones fallback:', err)
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
    fetchRegiones()
    return () => { isMounted = false }
  }, [])

  // Cargar comunas asociadas a la región seleccionada
  useEffect(() => {
    if (!selectedRegionId) return
    let isMounted = true
    const fetchComunas = async () => {
      try {
        setLoadingLocations(true)
        const data = await userService.getComunasByRegion(selectedRegionId)
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setComunas(data)
          setFormData(prev => ({ ...prev, idComuna: data[0].idComuna || data[0].id }))
        }
      } catch (err) {
        console.warn('Comunas fallback:', err)
        const fallbackComunas = [
          { idComuna: 1, nombreComuna: 'Santiago Centro', idRegion: 1 },
          { idComuna: 2, nombreComuna: 'Providencia', idRegion: 1 }
        ]
        if (isMounted) {
          setComunas(fallbackComunas)
          setFormData(prev => ({ ...prev, idComuna: fallbackComunas[0].idComuna }))
        }
      } finally {
        if (isMounted) setLoadingLocations(false)
      }
    }
    fetchComunas()
    return () => { isMounted = false }
  }, [selectedRegionId])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    if (errorMessage) setErrorMessage('')
  }

  const handleRegionChange = (e) => {
    setSelectedRegionId(e.target.value)
  }

  const validate = () => {
    const err = {}
    if (!loggedUser && !formData.correo.trim()) err.correo = 'Debes iniciar sesión para realizar la compra'
    if (!formData.nombre.trim()) err.nombre = 'El nombre es obligatorio'
    if (!formData.apellidos.trim()) err.apellidos = 'Los apellidos son obligatorios'
    if (!formData.calle.trim()) err.calle = 'La dirección de entrega es obligatoria'
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (!loggedUser) {
      setErrorMessage('Debes iniciar sesión con tu cuenta para procesar el pedido con tu token de autorización.')
      return
    }

    if (!validate()) return

    // Simulación de error de pago solicitada en pauta
    if (formData.simularError) {
      onSubmitOrder({
        success: false,
        error: 'Transacción rechazada por la pasarela de pago (Simulación de fallo).',
        order: { items: cart, total, customer: formData }
      })
      return
    }

    // Contrato exacto Spring Boot: POST /ordenes (Bearer CLIENTE/ADMIN)
    // Payload: { userRun, metodoPago, total, items: [{ idProducto, cantidad, precio, talla }] }
    const orderPayload = {
      userRun: loggedUser.run,
      metodoPago: formData.metodoPago || 'WEBPAY',
      total: total,
      items: cart.map(it => ({
        idProducto: Number(it.id),
        cantidad: Number(it.cantidad),
        precio: Number(it.precio),
        talla: it.talla || 'M'
      }))
    }

    try {
      setIsSubmitting(true)
      await onSubmitOrder({
        success: true,
        orderData: orderPayload,
        customer: formData,
        items: cart,
        total
      })
    } catch (err) {
      setErrorMessage(err.message || 'Error al emitir la orden de compra.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="section min-vh-70">
        <div className="container has-text-centered py-6">
          <p className="is-size-5 mb-4">No hay productos en el carrito para procesar una compra.</p>
          <Button variant="dark" onClick={() => onNavigate('productos')}>Ir a la Tienda</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="section">
      <div className="container container-max-960">
        <div className="has-text-centered mb-5">
          <h1 className="title is-2">Finalizar Compra (Checkout)</h1>
          <p className="subtitle is-6 has-text-grey">
            {loggedUser
              ? `Sesión activa como ${loggedUser.nombre} ${loggedUser.apellidos || ''} (RUN: ${loggedUser.run})`
              : 'Atención: Debes iniciar sesión para completar la compra.'}
          </p>
        </div>

        {!loggedUser && (
          <div className="notification is-warning is-light mb-5 is-flex is-justify-content-space-between is-align-items-center">
            <div>
              <strong>Inicia sesión antes de pagar:</strong> El sistema requiere token de autenticación para emitir tu orden.
            </div>
            <Button variant="primary" size="small" onClick={() => onNavigate('login')}>
              Iniciar Sesión
            </Button>
          </div>
        )}

        {errorMessage && (
          <div className="notification is-danger is-light mb-4">
            {errorMessage}
          </div>
        )}

        {/* Resumen de Productos */}
        <div className="box mb-5">
          <h2 className="title is-5 mb-3">Resumen de Productos</h2>
          <div className="table-container">
            <table className="table is-fullwidth is-striped">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((it, idx) => (
                  <tr key={idx}>
                    <td>
                      <img
                        src={it.img}
                        alt={it.titulo}
                        className="thumb-40"
                      />
                    </td>
                    <td><strong>{it.titulo}</strong> {it.talla && `(${it.talla})`}</td>
                    <td>${Number(it.precio).toLocaleString('es-CL')}</td>
                    <td>{it.cantidad}</td>
                    <td>${Number(it.precio * it.cantidad).toLocaleString('es-CL')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="has-text-right">
            <span className="tag is-info is-large">
              Total a pagar: ${Number(total).toLocaleString('es-CL')}
            </span>
          </div>
        </div>

        {/* Formulario de Checkout */}
        <form onSubmit={handleSubmit} className="box p-5">
          <h2 className="title is-5 mb-4">Información del Cliente y Despacho</h2>
          <div className="columns">
            <div className="column is-6">
              <FormField label="Nombre *" error={errors.nombre}>
                <Input
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Daniel"
                  hasError={!!errors.nombre}
                  disabled={isSubmitting}
                />
              </FormField>
            </div>
            <div className="column is-6">
              <FormField label="Apellidos *" error={errors.apellidos}>
                <Input
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  placeholder="Ej: Pérez"
                  hasError={!!errors.apellidos}
                  disabled={isSubmitting}
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
                  placeholder="Ej: correo@ejemplo.com"
                  hasError={!!errors.correo}
                  disabled={isSubmitting}
                />
              </FormField>
            </div>
            <div className="column is-6">
              <div className="field">
                <label className="label">Método de Pago</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select
                      name="metodoPago"
                      value={formData.metodoPago}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    >
                      <option value="WEBPAY">Webpay Plus (Débito / Crédito)</option>
                      <option value="TRANSFERENCIA">Transferencia Bancaria</option>
                      <option value="EFECTIVO">Efectivo contra Entrega</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h2 className="title is-5 mt-5 mb-4">Dirección de Entrega</h2>
          <div className="columns">
            <div className="column is-8">
              <FormField label="Calle y Número *" error={errors.calle}>
                <Input
                  name="calle"
                  value={formData.calle}
                  onChange={handleChange}
                  placeholder="Ej: Av. Providencia 1234"
                  hasError={!!errors.calle}
                  disabled={isSubmitting}
                />
              </FormField>
            </div>
            <div className="column is-4">
              <FormField label="Depto / Casa (Opcional)">
                <Input
                  name="depto"
                  value={formData.depto}
                  onChange={handleChange}
                  placeholder="Ej: Depto 502"
                  disabled={isSubmitting}
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
                      value={selectedRegionId}
                      onChange={handleRegionChange}
                      disabled={isSubmitting || loadingLocations}
                    >
                      {regiones.map(r => {
                        const id = r.idRegion || r.id
                        const name = r.nombreRegion || r.nombre || r.region
                        return (
                          <option key={id} value={id}>{name}</option>
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
                      disabled={isSubmitting || loadingLocations || comunas.length === 0}
                    >
                      {comunas.map(c => {
                        const id = c.idComuna || c.id
                        const name = c.nombreComuna || c.nombre || c.comuna
                        return (
                          <option key={id} value={id}>{name}</option>
                        )
                      })}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <FormField label="Indicaciones para la entrega (Opcional)">
            <textarea
              className="textarea"
              name="indicaciones"
              value={formData.indicaciones}
              onChange={handleChange}
              placeholder="Ej: Dejar con conserjería si no hay nadie"
              rows="2"
              disabled={isSubmitting}
            />
          </FormField>

          {/* Opción para probar el caso de error de pasarela de pago */}
          <div className="field mt-4 p-3 has-background-white-ter rounded-6">
            <label className="checkbox">
              <input
                type="checkbox"
                name="simularError"
                checked={formData.simularError}
                onChange={handleChange}
                className="mr-2"
                disabled={isSubmitting}
              />
              <span className="is-size-7 has-text-grey-dark">
                <strong>Simular fallo de pasarela de pago</strong> (Para evaluar vista de error según la pauta)
              </span>
            </label>
          </div>

          <div className="mt-5">
            <Button
              type="submit"
              variant="primary"
              size="medium"
              className={`is-fullwidth ${isSubmitting ? 'is-loading' : ''}`}
              disabled={isSubmitting || !loggedUser}
            >
              {isSubmitting ? 'Procesando pago seguro...' : `Pagar ahora $${Number(total).toLocaleString('es-CL')}`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CheckoutView
