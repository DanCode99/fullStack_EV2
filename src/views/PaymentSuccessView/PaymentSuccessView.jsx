import { Button } from '../../components/atoms/Button/Button.jsx'

export function PaymentSuccessView({ order, onNavigate }) {
  if (!order) {
    return (
      <div className="section min-vh-70">
        <div className="container has-text-centered py-6">
          <p className="is-size-5 mb-4">No se registra orden reciente.</p>
          <Button variant="dark" onClick={() => onNavigate('home')}>Ir al Inicio</Button>
        </div>
      </div>
    )
  }

  const { orderNumber, items = [], total = 0, customer = {} } = order

  return (
    <div className="section">
      <div className="container container-max-850">
        <div className="box p-6 has-background-white">
          <div className="has-text-centered mb-5">
            <span className="icon has-text-success is-large mb-3">
              <svg className="icon-svg-48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 12l2 2 4-4"></path>
              </svg>
            </span>
            <h1 className="title is-3 mb-1">Se ha realizado la compra</h1>
            <p className="subtitle is-6 has-text-grey">
              Código de orden: <strong>#ORD-{orderNumber}</strong>
            </p>
          </div>

          <div className="notification is-light mb-5">
            <h2 className="title is-6 mb-2">Información del Cliente y Despacho</h2>
            <div className="columns is-multiline is-mobile is-size-7">
              <div className="column is-6">
                <strong>Nombre:</strong> {customer.nombre} {customer.apellidos}
              </div>
              <div className="column is-6">
                <strong>Correo:</strong> {customer.correo}
              </div>
              <div className="column is-12">
                <strong>Dirección:</strong> {customer.calle} {customer.depto ? `(${customer.depto})` : ''}, {customer.comuna}, {customer.region}
              </div>
              {customer.indicaciones && (
                <div className="column is-12">
                  <strong>Indicaciones:</strong> {customer.indicaciones}
                </div>
              )}
            </div>
          </div>

          <h2 className="title is-6 mb-3">Detalle del Pedido</h2>
          <div className="table-container mb-4">
            <table className="table is-fullwidth is-striped is-narrow">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Cant.</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => (
                  <tr key={idx}>
                    <td>
                      <img
                        src={it.img}
                        alt={it.titulo}
                        className="thumb-35"
                      />
                    </td>
                    <td>{it.titulo} {it.talla && `(${it.talla})`}</td>
                    <td>${Number(it.precio).toLocaleString('es-CL')}</td>
                    <td>{it.cantidad}</td>
                    <td>${Number(it.precio * it.cantidad).toLocaleString('es-CL')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="has-text-right mb-6">
            <span className="is-size-5 has-text-weight-bold">
              Total pagado: <span className="has-text-primary">${Number(total).toLocaleString('es-CL')}</span>
            </span>
          </div>

          <div className="buttons is-centered">
            <Button
              variant="primary"
              onClick={() => {}}
              className="cursor-not-allowed"
            >
              Imprimir boleta en PDF
            </Button>
            <Button
              variant="dark"
              onClick={() => onNavigate('home')}
            >
              Volver a la Tienda
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
