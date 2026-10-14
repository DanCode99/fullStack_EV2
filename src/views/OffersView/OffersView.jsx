import { ProductCard } from '../../components/molecules/ProductCard/ProductCard.jsx'

export function OffersView({
  products = [],
  onSelectProduct,
  onAddToCart
}) {
  // Productos seleccionados para la sección de ofertas
  // Con precio original, porcentaje de descuento y precio rebajado
  const discountsMap = {
    7: 25,  // Palestino
    8: 20,  // Audax Italiano
    10: 30, // Colo-Colo
    12: 15, // Venezuela
    2: 20,  // U de Chile
    6: 25   // USA
  }

  const offersProducts = products
    .filter(p => discountsMap[p.id] || p.precio <= 45000)
    .map(p => {
      const discountPercent = discountsMap[p.id] || 20
      const precioOriginal = p.precio
      const precioFinal = Math.round(precioOriginal * (1 - discountPercent / 100))
      return {
        ...p,
        descuento: discountPercent,
        precioOriginal,
        precioFinal
      }
    })

  const handleAddDiscounted = (product) => {
    // Al agregar al carrito desde ofertas, se agrega con el precio con descuento aplicado
    onAddToCart({
      ...product,
      precio: product.precioFinal || product.precio
    })
  }

  return (
    <div className="section">
      <div className="container">
        <div className="has-text-centered mb-5">
          <span className="tag is-danger is-medium mb-3">PROMOCIONES EXCLUSIVAS</span>
          <h1 className="title is-2">Ofertas y Liquidación de Temporada</h1>
          <p className="subtitle is-6 has-text-grey">
            Precios rebajados en modelos seleccionados con hasta un 30% de descuento.
          </p>
        </div>

        <div className="notification is-danger is-light has-text-centered mb-5">
          <strong>¡Liquidación por tiempo limitado!</strong> El descuento se aplica automáticamente al añadir al carrito.
        </div>

        <div className="columns is-multiline">
          {offersProducts.map((prod) => (
            <div key={prod.id} className="column is-12-mobile is-6-tablet is-4-desktop is-3-widescreen">
              <ProductCard
                product={prod}
                onSelect={onSelectProduct}
                onAddToCart={handleAddDiscounted}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

