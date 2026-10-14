import { useState } from 'react'
import { FormField } from '../../components/molecules/FormField/FormField.jsx'
import { Input } from '../../components/atoms/Input/Input.jsx'
import { Button } from '../../components/atoms/Button/Button.jsx'
import { regionesYcomunas } from '../../data/regiones.js'

export function CheckoutView({
  cart = [],
  loggedUser,
  onSubmitOrder,
  onNavigate
}) {
  const [formData, setFormData] = useState({
    nombre: loggedUser?.nombre || '',
    apellidos: loggedUser?.apellidos || '',
    correo: loggedUser?.correo || '',
    calle: loggedUser?.direccion || '',
    depto: '',
    region: loggedUser?.region || regionesYcomunas[0]?.region || '',
    comuna: loggedUser?.comuna || '',
    indicaciones: '',
    simularError: false
  })

  const [errors, setErrors] = useState({})

  const total = cart.reduce((acc, item) => acc + (item.precio * item.cantidad), 0)

  // Obtener comunas según la región seleccionada
  const selectedRegionObj = regionesYcomunas.find(r => r.region === formData.region)
  const availableComunas = selectedRegionObj ? selectedRegionObj.comunas : []

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleRegionChange = (e) => {
    const newRegion = e.target.value
    const rObj = regionesYcomunas.find(r => r.region === newRegion)
    setFormData(prev => ({
      ...prev,
      region: newRegion,
      comuna: rObj?.comunas[0] || ''
    }))
  }

  const validate = () => {
    const err = {}
    if (!formData.nombre.trim()) err.nombre = 'El nombre es obligatorio'
    if (!formData.apellidos.trim()) err.apellidos = 'Los apellidos son obligatorios'
    if (!formData.correo.trim() || !formData.correo.includes('@')) err.correo = 'Correo electrónico inválido'
    if (!formData.calle.trim()) err.calle = 'La dirección de entrega es obligatoria'
    if (!formData.region) err.region = 'Debes seleccionar una región'
    if (!formData.comuna) err.comuna = 'Debes seleccionar una comuna'
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const orderNumber = Math.floor(100000 + Math.random() * 900000)
    const orderData = {
      orderNumber,
      items: cart,
      total,
      customer: formData,
      date: new Date().toISOString()
    }

    if (formData.simularError) {
      onSubmitOrder({ success: false, order: orderData })
    } else {
      onSubmitOrder({ success: true, order: orderData })
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
      <div className="container" style={{ maxWidth: '960px' }}>
        <div className="has-text-centered mb-5">
          <h1 className="title is-2">Finalizar Compra (Checkout)</h1>
          <p className="subtitle is-6 has-text-grey">
            {loggedUser
              ? 'Tus datos de cuenta fueron precargados automáticamente.'
              : 'Completa los datos de despacho para recibir tus camisetas.'}
          </p>
        </div>

        {/* Tabla resumen de productos en checkout (conforme a Figura 6 del PDF) */}
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
                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
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
          <h2 className="title is-5 mb-4">Información del Cliente</h2>
          <div className="columns">
            <div className="column is-6">
              <FormField label="Nombre *" error={errors.nombre}>
                <Input
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Daniel"
                  hasError={!!errors.nombre}
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
                />
              </FormField>
            </div>
          </div>

          <FormField label="Correo Electrónico *" error={errors.correo}>
            <Input
              name="correo"
              type="email"
              value={formData.correo}
              onChange={handleChange}
              placeholder="Ej: correo@ejemplo.com"
              hasError={!!errors.correo}
            />
          </FormField>

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
                      <option value="">Selecciona comuna</option>
                      {availableComunas.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {errors.comuna && <p className="help is-danger">{errors.comuna}</p>}
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
            />
          </FormField>

          {/* Opción para probar el caso de error estipulado en la rúbrica */}
          <div className="field mt-4 p-3 has-background-white-ter" style={{ borderRadius: '6px' }}>
            <label className="checkbox">
              <input
                type="checkbox"
                name="simularError"
                checked={formData.simularError}
                onChange={handleChange}
                className="mr-2"
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
              className="is-fullwidth"
            >
              Pagar ahora ${Number(total).toLocaleString('es-CL')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
