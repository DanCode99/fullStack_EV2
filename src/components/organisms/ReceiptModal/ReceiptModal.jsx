import { useState, useEffect } from 'react'
import { Button } from '../../atoms/Button/Button.jsx'

export function ReceiptModal({ order, isOpen, onClose }) {
  const [simulatedSent, setSimulatedSent] = useState(false)

  // Agregar clase en body cuando el modal está abierto para controlar estilos de impresión
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('has-receipt-modal-open')
    } else {
      document.body.classList.remove('has-receipt-modal-open')
    }
    return () => {
      document.body.classList.remove('has-receipt-modal-open')
    }
  }, [isOpen])

  if (!isOpen || !order) return null

  // Cálculo de valores netos e impuestos chilenos (IVA 19%)
  const total = Number(order.total) || 0
  const neto = Math.round(total / 1.19)
  const iva = total - neto

  const items = order.items || []
  const customerName = order.customerName || (order.customer ? `${order.customer.nombre} ${order.customer.apellidos}` : 'Cliente Registrado')
  const customerEmail = order.customer?.correo || order.correo || `${order.userRun || 'cliente'}@correo.cl`
  const customerAddress = order.customer?.direccion || order.direccion || 'Despacho a Domicilio'
  const customerCity = order.customer?.comuna || order.comuna || 'Santiago, Chile'

  const handleSendEmail = () => {
    setSimulatedSent(true)
    setTimeout(() => {
      setSimulatedSent(false)
    }, 3500)
  }

  return (
    <div className="modal is-active" id="receipt-modal">
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card" style={{ width: '92%', maxWidth: '720px', borderRadius: '12px' }}>
        <header className="modal-card-head has-background-dark py-3 px-5">
          <div className="is-flex is-align-items-center">
            <p className="modal-card-title has-text-white is-size-5 mb-0 has-text-weight-bold">
              Detalle de Boleta Electrónica
            </p>
          </div>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>

        <section className="modal-card-body p-5" id="printable-receipt">
          {/* Header Boleta */}
          <div className="columns is-mobile is-vcentered mb-4 pb-3" style={{ borderBottom: '2px dashed #dbdbdb' }}>
            <div className="column is-7">
              <h2 className="title is-4 mb-1 has-text-primary has-text-weight-bold">
                TIENDA DE FÚTBOL
              </h2>
              <p className="is-size-7 has-text-grey mb-1">Tienda Oficial de Indumentaria Deportiva</p>
              <p className="is-size-7 has-text-grey mb-0">RUT: 76.892.410-K &bull; Santiago, Chile</p>
            </div>
            <div className="column is-5 has-text-right">
              <div className="box p-3 has-background-light has-text-centered" style={{ border: '2px solid #00b89c' }}>
                <p className="is-size-7 has-text-weight-bold has-text-grey-dark mb-1">BOLETA ELECTRÓNICA</p>
                <p className="is-size-5 has-text-weight-bold has-text-primary mb-1">
                  N° {order.id?.replace('ORD-', '') || order.id}
                </p>
                <span className="tag is-success is-light is-size-7">
                  {order.estado || 'Completado'}
                </span>
              </div>
            </div>
          </div>

          {/* Información del Cliente */}
          <div className="box p-3 mb-4 has-background-white-bis" style={{ border: '1px solid #e2e8f0' }}>
            <div className="columns is-multiline is-mobile is-size-7">
              <div className="column is-6 py-1">
                <strong>Cliente:</strong> {customerName}
              </div>
              <div className="column is-6 py-1">
                <strong>RUN:</strong> <code>{order.userRun || 'N/A'}</code>
              </div>
              <div className="column is-6 py-1">
                <strong>Correo:</strong> {customerEmail}
              </div>
              <div className="column is-6 py-1">
                <strong>Fecha Emisión:</strong> {order.fecha}
              </div>
              <div className="column is-12 py-1">
                <strong>Dirección / Entrega:</strong> {customerAddress}, {customerCity}
              </div>
            </div>
          </div>

          {/* Tabla de Productos */}
          <h3 className="title is-6 mb-2 has-text-weight-bold">Detalle de Productos Adquiridos</h3>
          <div className="table-container mb-4">
            <table className="table is-fullwidth is-striped is-narrow is-hoverable" style={{ fontSize: '0.875rem' }}>
              <thead>
                <tr className="has-background-light">
                  <th style={{ width: '40px' }}>Ítem</th>
                  <th>Descripción</th>
                  <th className="has-text-centered" style={{ width: '60px' }}>Talla</th>
                  <th className="has-text-centered" style={{ width: '60px' }}>Cant.</th>
                  <th className="has-text-right" style={{ width: '100px', whiteSpace: 'nowrap' }}>Precio Unit.</th>
                  <th className="has-text-right" style={{ width: '110px', whiteSpace: 'nowrap' }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => {
                  const unitPrice = Number(it.precio) || 0
                  const qty = Number(it.cantidad) || 1
                  const subtotal = unitPrice * qty
                  return (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>
                        <strong>{it.titulo}</strong>
                      </td>
                      <td className="has-text-centered">
                        <span className="tag is-info is-light is-small">
                          {it.talla || 'M'}
                        </span>
                      </td>
                      <td className="has-text-centered">{qty}</td>
                      <td className="has-text-right" style={{ whiteSpace: 'nowrap' }}>${unitPrice.toLocaleString('es-CL')}</td>
                      <td className="has-text-right has-text-weight-semibold" style={{ whiteSpace: 'nowrap' }}>
                        ${subtotal.toLocaleString('es-CL')}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Resumen Monetario con protección contra salto de línea */}
          <div className="columns is-mobile is-vcentered mb-3">
            <div className="column is-6">
              <div className="notification is-light p-3 is-size-7 mb-0">
                <p className="mb-1"><strong>Medio de Pago:</strong> Webpay Plus (Transbank)</p>
                <p className="mb-0"><strong>Documento:</strong> Válido como Comprobante Tributario Electrónico</p>
              </div>
            </div>
            <div className="column is-6">
              <table className="table is-fullwidth is-narrow has-background-white mb-0" style={{ fontSize: '0.875rem' }}>
                <tbody>
                  <tr>
                    <td className="has-text-grey" style={{ whiteSpace: 'nowrap', width: '55%' }}>Subtotal Neto:</td>
                    <td className="has-text-right" style={{ whiteSpace: 'nowrap' }}>${neto.toLocaleString('es-CL')}</td>
                  </tr>
                  <tr>
                    <td className="has-text-grey" style={{ whiteSpace: 'nowrap' }}>IVA (19%):</td>
                    <td className="has-text-right" style={{ whiteSpace: 'nowrap' }}>${iva.toLocaleString('es-CL')}</td>
                  </tr>
                  <tr className="has-background-white-ter">
                    <td className="has-text-weight-bold is-size-6" style={{ whiteSpace: 'nowrap' }}>TOTAL:</td>
                    <td className="has-text-right has-text-weight-bold is-size-5 has-text-primary" style={{ whiteSpace: 'nowrap' }}>
                      ${total.toLocaleString('es-CL')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {simulatedSent && (
            <div className="notification is-success is-light p-3 mb-0">
              <p className="is-size-7 has-text-weight-semibold">
                Boleta enviada satisfactoriamente a: <strong>{customerEmail}</strong>
              </p>
            </div>
          )}
        </section>

        <footer className="modal-card-foot is-justify-content-space-between py-3 px-5">
          <div className="buttons">
            <Button
              variant="primary"
              size="small"
              id="btn-print-receipt"
              onClick={() => {}}
              style={{ cursor: 'not-allowed' }}
            >
              Imprimir Boleta
            </Button>
            <Button
              variant="info"
              size="small"
              onClick={handleSendEmail}
              id="btn-send-receipt"
            >
              Enviar por Email
            </Button>
          </div>
          <Button
            variant="light"
            size="small"
            onClick={onClose}
            id="btn-close-receipt"
          >
            Cerrar
          </Button>
        </footer>
      </div>
    </div>
  )
}

export default ReceiptModal