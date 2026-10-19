import { Button } from '../../components/atoms/Button/Button.jsx'

export function PaymentErrorView({ order, onRetry, onNavigate }) {
  const { orderNumber = '20240705', items = [], total = 0, customer = {} } = order || {}

  return (
    <div className="section">
      <div className="container container-max-850">
        <div className="box p-6 has-background-white">
          <div className="has-text-centered mb-5">
            <span className="icon has-text-danger is-large mb-3">
              <svg className="icon-svg-48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </span>
            <h1 className="title is-3 mb-1">No se pudo realizar el pago</h1>
            <p className="subtitle is-6 has-text-grey">
              Nro de transacción: <strong>#{orderNumber}</strong>
            </p>
          </div>

          <div className="notification is-danger is-light mb-5 has-text-centered">
            <p className="mb-3">
              Hubo un problema al procesar tu tarjeta o medio de pago. Tus productos continúan reservados en el carrito.
            </p>
            <Button
              variant="success"
              onClick={onRetry}
            >
              VOLVER A REALIZAR EL PAGO
            </Button>
          </div>

          <div className="notification is-light mb-5">
            <h2 className="title is-6 mb-2">Detalle del cliente ingresado</h2>
            <div className="columns is-multiline is-mobile is-size-7">
              <div className="column is-6">
                <strong>Nombre:</strong> {customer.nombre || '-'} {customer.apellidos || '-'}
              </div>
              <div className="column is-6">
                <strong>Correo:</strong> {customer.correo || '-'}
              </div>
              <div className="column is-12">
                <strong>Dirección:</strong> {customer.calle || '-'} {customer.depto ? `(${customer.depto})` : ''}, {customer.comuna || '-'}, {customer.region || '-'}
              </div>
            </div>
          </div>

          <h2 className="title is-6 mb-3">Detalle de la compra pendiente</h2>
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
              Total pendiente: <span className="has-text-danger">${Number(total).toLocaleString('es-CL')}</span>
            </span>
          </div>

          <div className="buttons is-centered">
            <Button
              variant="dark"
              onClick={() => onNavigate('carrito')}
            >
              Modificar Carrito
            </Button>
            <Button
              variant="light"
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
