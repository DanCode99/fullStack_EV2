import { useNavigate } from 'react-router-dom'
import { Button } from '../../atoms/Button/Button.jsx'

export function ProductCard({
  product,
  onSelect,
  onAddToCart
}) {
  const navigate = useNavigate()
  const isOutOfStock = product.stock <= 0

  const handleSelect = () => {
    if (onSelect) {
      onSelect(product)
    } else {
      navigate(`/products/${product.id}`)
    }
  }

  const brandOrCategory = product.nombreMarca || product.categoria || 'Fútbol Oficial'
  const isClub = product.categoria === 'Clubes Chilenos'

  return (
    <div className="card h-100 pro-sport-card">
      <div
        className="card-image cursor-pointer pro-card-image-wrap"
        onClick={handleSelect}
      >
        {/* Badges superiores flotantes */}
        <div className="pro-card-badges">
          {product.descuento ? (
            <span className="pro-badge-discount">-{product.descuento}% OFF</span>
          ) : isClub ? (
            <span className="pro-badge-tag pro-badge-club">FÚTBOL CHILENO</span>
          ) : (
            <span className="pro-badge-tag pro-badge-intl">SELECCIÓN</span>
          )}

          {isOutOfStock ? (
            <span className="pro-badge-stock is-danger">AGOTADO</span>
          ) : product.stock <= 5 ? (
            <span className="pro-badge-stock is-warning">ÚLTIMAS {product.stock} UNID.</span>
          ) : null}
        </div>

        <figure className="image pro-card-figure">
          <img
            src={product.img}
            alt={product.titulo}
            className="pro-product-img"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://placehold.co/400x500/1e293b/FFFFFF?text=Camiseta+Oficial'
            }}
          />
        </figure>
      </div>

      <div className="card-content pro-card-content">
        <div className="pro-card-header">
          <div className="pro-card-meta">
            <span className="pro-card-category">{product.categoria}</span>
            <span className="pro-card-brand">{brandOrCategory}</span>
          </div>

          <h3
            className="title is-6 pro-card-title cursor-pointer"
            onClick={handleSelect}
            title={product.titulo}
          >
            {product.titulo}
          </h3>

          <div className="pro-card-pricing">
            {product.descuento ? (
              <div className="pro-price-discount-wrap">
                <span className="is-size-7 has-text-grey line-through mr-2">
                  ${Number(product.precioOriginal || product.precio).toLocaleString('es-CL')}
                </span>
                <span className="pro-price-current has-text-danger">
                  ${Number(product.precioFinal || Math.round(product.precio * (1 - product.descuento / 100))).toLocaleString('es-CL')}
                </span>
              </div>
            ) : (
              <p className="pro-price-current has-text-dark">
                ${Number(product.precio).toLocaleString('es-CL')}
              </p>
            )}
          </div>
        </div>

        <div className="pro-card-actions mt-3">
          <Button
            variant="primary"
            size="small"
            className="is-fullwidth pro-btn-cart mb-2"
            disabled={isOutOfStock}
            onClick={() => onAddToCart && onAddToCart(product)}
          >
            {isOutOfStock ? 'Sin Stock Disponible' : 'Agregar al Carrito'}
          </Button>

          <Button
            variant="light"
            size="small"
            className="is-fullwidth pro-btn-details"
            onClick={handleSelect}
          >
            Ver detalles
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
