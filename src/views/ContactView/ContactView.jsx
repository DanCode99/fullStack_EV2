import { useState } from 'react'
import { FormField } from '../../components/molecules/FormField/FormField.jsx'
import { Input } from '../../components/atoms/Input/Input.jsx'
import { Button } from '../../components/atoms/Button/Button.jsx'

export function ContactView() {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    asunto: '',
    mensaje: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const err = {}
    if (!formData.nombre.trim()) err.nombre = 'El nombre es obligatorio'
    if (!formData.correo.trim() || !formData.correo.includes('@')) err.correo = 'Correo electrónico inválido'
    if (!formData.asunto.trim()) err.asunto = 'El asunto es obligatorio'
    if (!formData.mensaje.trim() || formData.mensaje.length < 10) err.mensaje = 'El mensaje debe tener al menos 10 caracteres'
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitted(true)
    setFormData({ nombre: '', correo: '', asunto: '', mensaje: '' })
  }

  return (
    <div className="section min-vh-70">
      <div className="container" style={{ maxWidth: '700px' }}>
        <div className="has-text-centered mb-5">
          <h1 className="title is-2">Contáctanos</h1>
          <p className="subtitle is-6 has-text-grey">
            ¿Tienes dudas sobre tallas, disponibilidad o despachos? Escríbenos directamente.
          </p>
        </div>

        {submitted && (
          <div className="notification is-success mb-5">
            <button className="delete" onClick={() => setSubmitted(false)}></button>
            ¡Tu mensaje ha sido enviado correctamente! Nos pondremos en contacto contigo dentro de las próximas 24 horas hábiles.
          </div>
        )}

        <div className="box p-5">
          <form onSubmit={handleSubmit}>
            <div className="columns">
              <div className="column is-6">
                <FormField label="Tu Nombre *" error={errors.nombre}>
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
                <FormField label="Correo Electrónico *" error={errors.correo}>
                  <Input
                    name="correo"
                    type="email"
                    value={formData.correo}
                    onChange={handleChange}
                    placeholder="Ej: daniel@duoc.cl"
                    hasError={!!errors.correo}
                  />
                </FormField>
              </div>
            </div>

            <FormField label="Asunto *" error={errors.asunto}>
              <Input
                name="asunto"
                value={formData.asunto}
                onChange={handleChange}
                placeholder="Ej: Consulta sobre talla de Camiseta Brasil"
                hasError={!!errors.asunto}
              />
            </FormField>

            <FormField label="Mensaje *" error={errors.mensaje}>
              <textarea
                className={`textarea ${errors.mensaje ? 'is-danger' : ''}`}
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                placeholder="Escribe tu consulta aquí con el mayor detalle posible..."
                rows="4"
              />
            </FormField>

            <Button
              type="submit"
              variant="primary"
              className="is-fullwidth mt-4"
            >
              Enviar Mensaje
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
