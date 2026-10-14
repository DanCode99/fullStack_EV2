import { CartItem } from '../../components/molecules/CartItem/CartItem.jsx'
import { Button } from '../../components/atoms/Button/Button.jsx'

export function CartView({
  cart = [],
  onIncrement,
  onDecrement,
  onRemove,
  onClear,
  onNavigate
}) {
  const total = cart.reduce((acc, item) => acc + (item.precio * item.cantidad), 0)

  if (cart.length === 0) {
    return (
      <div className="section min-vh-70">
        <div className="container has-text-centered py-6">
          <div className="notification is-warning is-light p-6">
            <h2 className="title is-4 mb-3">Tu carrito está actualmente vacío</h2>
            <p className="subtitle is-6 mb-5">
              ¡Aún no has agregado ninguna camiseta oficial! Explora nuestro catálogo y encuentra la de tu equipo preferido.
            </p>
            <Button
              variant="dark"
              onClick={() => onNavigate('productos')}
            >
              Ir a la Tienda
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="section">
      <div className="container">
        <div className="has-text-centered mb-5">
          <h1 className="title is-2">Carrito de Compras</h1>
          <p className="subtitle is-6 has-text-grey">
            Revisa los artículos seleccionados antes de proceder al checkout
          </p>
        </div>

        <div className="columns is-variable is-6">
          <div className="column is-12-mobile is-8-tablet">
            <div className="is-flex is-justify-content-space-between is-align-items-center mb-3">
              <span className="has-text-weight-bold">{cart.length} artículos en lista</span>
              <Button
                variant="light"
                size="small"
                onClick={onClear}
              >
                Vaciar Carrito
              </Button>
            </div>

            {cart.map((item, idx) => (
              <CartItem
                key={`${item.id}-${item.talla || 'std'}-${idx}`}
                item={item}
                index={idx}
                onIncrement={onIncrement}
                onDecrement={onDecrement}
                onRemove={onRemove}
              />
            ))}
          </div>

          <div className="column is-12-mobile is-4-tablet">
            <div className="box p-5" style={{ position: 'sticky', top: '2rem' }}>
              <h2 className="title is-5 mb-4">Resumen del Pedido</h2>
              
              <div className="is-flex is-justify-content-space-between mb-3">
                <span className="has-text-grey">Subtotal:</span>
                <span className="has-text-weight-semibold">${Number(total).toLocaleString('es-CL')}</span>
              </div>
              <div className="is-flex is-justify-content-space-between mb-4">
                <span className="has-text-grey">Envío:</span>
                <span className="has-text-success has-text-weight-semibold">Gratis</span>
              </div>

              <hr />

              <div className="is-flex is-justify-content-space-between mb-5">
                <span className="is-size-5 has-text-weight-bold">Total:</span>
                <span className="is-size-4 has-text-primary has-text-weight-bold">
                  ${Number(total).toLocaleString('es-CL')}
                </span>
              </div>

              <Button
                variant="primary"
                size="medium"
                className="is-fullwidth mb-3"
                onClick={() => onNavigate('checkout')}
              >
                Proceder al Pago &rarr;
              </Button>

              <Button
                variant="light"
                size="small"
                className="is-fullwidth"
                onClick={() => onNavigate('productos')}
              >
                Seguir Comprando
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
