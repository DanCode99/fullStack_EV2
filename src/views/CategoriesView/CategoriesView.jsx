import { useState } from 'react'
import { ProductCard } from '../../components/molecules/ProductCard/ProductCard.jsx'

export function CategoriesView({
  products = [],
  onSelectProduct,
  onAddToCart
}) {
  const [activeCategory, setActiveCategory] = useState('Selecciones Nacionales')

  const categories = [
    { id: 'Selecciones Nacionales', title: 'Selecciones Nacionales', count: products.filter(p => p.categoria === 'Selecciones Nacionales').length },
    { id: 'Clubes Chilenos', title: 'Clubes Chilenos', count: products.filter(p => p.categoria === 'Clubes Chilenos').length }
  ]

  const categoryProducts = products.filter(p => p.categoria === activeCategory)

  return (
    <div className="section">
      <div className="container">
        <div className="has-text-centered mb-5">
          <h1 className="title is-2">Comprar por Categoría</h1>
          <p className="subtitle is-6 has-text-grey">
            Explora las colecciones exclusivas divididas por tipo de competición
          </p>
        </div>

        <div className="columns mb-6">
          {categories.map((cat) => (
            <div key={cat.id} className="column is-6">
              <div
                className={`box has-text-centered p-5 ${activeCategory === cat.id ? 'has-background-primary-light has-border-primary' : ''}`}
                style={{ cursor: 'pointer', transition: 'all 0.2s ease', border: activeCategory === cat.id ? '2px solid #00b89c' : '1px solid #e1e4e8' }}
                onClick={() => setActiveCategory(cat.id)}
              >
                <h3 className="title is-4 mb-2">{cat.title}</h3>
                <p className="subtitle is-6 has-text-grey">
                  {cat.count} modelos disponibles
                </p>
                <span className={`button is-small ${activeCategory === cat.id ? 'is-primary' : 'is-light'}`}>
                  {activeCategory === cat.id ? 'Categoría Activa' : 'Ver Productos'}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <h2 className="title is-4">{activeCategory}</h2>
          <hr />
        </div>

        <div className="columns is-multiline">
          {categoryProducts.map((prod) => (
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
