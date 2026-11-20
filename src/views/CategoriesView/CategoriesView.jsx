import { useState } from 'react'
import { ProductCard } from '../../components/molecules/ProductCard/ProductCard.jsx'

export function CategoriesView({
  products = [],
  onSelectProduct,
  onAddToCart
}) {
  const [activeCategory, setActiveCategory] = useState('Selecciones Nacionales')

  const uniqueCats = Array.from(new Set(products.map(p => p.categoria).filter(Boolean)))
  const categoriesList = uniqueCats.length > 0 ? uniqueCats : ['Selecciones Nacionales', 'Clubes Chilenos']

  const categories = categoriesList.map(cat => ({
    id: cat,
    title: cat,
    count: products.filter(p => p.categoria === cat).length
  }))

  const effectiveActiveCategory = categories.some(c => c.id === activeCategory)
    ? activeCategory
    : (categories[0]?.id || 'Selecciones Nacionales')

  const categoryProducts = products.filter(p => p.categoria === effectiveActiveCategory)

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
                className={`box has-text-centered p-5 category-box-selectable ${effectiveActiveCategory === cat.id ? 'is-active has-background-primary-light has-border-primary' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <h3 className="title is-4 mb-2">{cat.title}</h3>
                <p className="subtitle is-6 has-text-grey">
                  {cat.count} modelos disponibles
                </p>
                <span className={`button is-small ${effectiveActiveCategory === cat.id ? 'is-primary' : 'is-light'}`}>
                  {effectiveActiveCategory === cat.id ? 'Categoría Activa' : 'Ver Productos'}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <h2 className="title is-4">{effectiveActiveCategory}</h2>
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
