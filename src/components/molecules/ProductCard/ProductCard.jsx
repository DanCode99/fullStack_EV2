import { Button } from '../../atoms/Button/Button.jsx'
import { Badge } from '../../atoms/Badge/Badge.jsx'

export function ProductCard({
  product,
  onSelect,
  onAddToCart
}) {
  const isOutOfStock = product.stock <= 0
  const isCriticalStock = product.stock > 0 && product.stock <= (product.stockCritico || 5)

  return (
    <div className="card h-100">
      <div
        className="card-image"
        onClick={() => onSelect && onSelect(product)}
        style={{ cursor: 'pointer' }}
      >
        <figure className="image">
          <img
            src={product.img}
            alt={product.titulo}
            onError={(e) => {
              e.target.src = 'https://placehold.co/400x300?text=Camiseta'
            }}
          />
        </figure>
      </div>

      <div className="card-content">
        <div>
          <div className="is-flex is-justify-content-space-between is-align-items-center mb-2">
            <span className="is-size-7 has-text-grey">{product.categoria}</span>
            {isOutOfStock ? (
              <Badge variant="danger">Agotado</Badge>
            ) : isCriticalStock ? (
              <Badge variant="warning">¡Últimas unidades!</Badge>
            ) : (
              <Badge variant="success">Stock: {product.stock}</Badge>
            )}
          </div>

          <h3
            className="title is-6 mb-2"
            onClick={() => onSelect && onSelect(product)}
            style={{ cursor: 'pointer' }}
          >
            {product.titulo}
          </h3>

          <p className="subtitle is-5 has-text-primary has-text-weight-bold">
            ${Number(product.precio).toLocaleString('es-CL')}
          </p>
        </div>

        <div className="buttons mt-3">
          <Button
            variant="light"
            size="small"
            className="is-fullwidth mb-1"
            onClick={() => onSelect && onSelect(product)}
          >
            Ver Detalle
          </Button>
          <Button
            variant="primary"
            size="small"
            className="is-fullwidth"
            disabled={isOutOfStock}
            onClick={() => onAddToCart && onAddToCart(product)}
          >
            {isOutOfStock ? 'Sin Stock' : 'Agregar al Carrito'}
          </Button>
        </div>
      </div>
    </div>
  )
}
