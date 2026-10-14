import { ProductCard } from '../../components/molecules/ProductCard/ProductCard.jsx'

export function OffersView({
  products = [],
  onSelectProduct,
  onAddToCart
}) {
  // Productos en oferta (precio menor a 45000 o seleccionados)
  const offersProducts = products.filter(p => p.precio <= 45000)

  return (
    <div className="section">
      <div className="container">
        <div className="has-text-centered mb-5">
          <span className="tag is-danger is-medium mb-3">PROMOCIONES EXCLUSIVAS</span>
          <h1 className="title is-2">Ofertas y Liquidación de Temporada</h1>
          <p className="subtitle is-6 has-text-grey">
            Precios rebajados en modelos seleccionados hasta agotar stock disponible.
          </p>
        </div>

        <div className="notification is-warning is-light has-text-centered mb-5">
          <strong>¡Aprovecha hasta un 25% de descuento!</strong> Stock limitado por talla.
        </div>

        <div className="columns is-multiline">
          {offersProducts.map((prod) => (
            <div key={prod.id} className="column is-12-mobile is-6-tablet is-4-desktop is-3-widescreen">
              <ProductCard
                product={prod}
                onSelect={onSelectProduct}
                onAddToCart={onAddToCart}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
