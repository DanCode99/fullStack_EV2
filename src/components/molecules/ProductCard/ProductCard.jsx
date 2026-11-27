import { useNavigate } from 'react-router-dom'

export function ProductCard({
  product,
  onSelect,
  onAddToCart
}) {
  const navigate = useNavigate()
  const isOutOfStock = (product.stock || 0) <= 0

  const handleSelect = () => {
    if (onSelect) {
      onSelect(product)
    } else {
      navigate(`/products/${product.id}`)
    }
  }

  const brandOrCategory = product.nombreMarca || product.marca || 'Fútbol Oficial'
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

        {/* Barra flotante animada al hover en la base de la imagen */}
        <div
          className="pro-card-hover-actions"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="pro-hover-btn-cart"
            disabled={isOutOfStock}
            onClick={(e) => {
              e.stopPropagation()
              if (!isOutOfStock && onAddToCart) {
                onAddToCart(product)
              }
            }}
            title={isOutOfStock ? 'Agotado' : 'Agregar al carrito'}
            aria-label={`Agregar ${product.titulo} al carrito`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span>{isOutOfStock ? 'Agotado' : 'Agregar al carrito'}</span>
          </button>

          <button
            type="button"
            className="btn-primary pro-hover-btn-details"
            onClick={(e) => {
              e.stopPropagation()
              handleSelect()
            }}
            title="Ver detalles"
            aria-label={`Ver detalles de ${product.titulo}`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            </svg>
            <span>Ver detalles</span>
          </button>
        </div>
      </div>

      {/* Parte inferior minimalista: Categoría y Marca, Título y Precio */}
      <div className="card-content pro-card-content">
        <div className="pro-card-header">
          <div className="pro-card-meta">
            <span className="pro-card-category">{product.categoria}</span>
            <span className="pro-card-brand">• {brandOrCategory}</span>
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
      </div>
    </div>
  )
}

export default ProductCard
