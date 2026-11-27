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

  const categoryImages = {
    'Selecciones Nacionales': '/assets/images/brasil/brasil1.jpeg',
    'Clubes Chilenos': '/assets/images/u_de_chile/lau1.webp'
  }

  const categories = categoriesList.map(cat => ({
    id: cat,
    title: cat,
    img: categoryImages[cat] || (products.find(p => p.categoria === cat)?.img || '/assets/images/logo/logo.png'),
    count: products.filter(p => p.categoria === cat).length
  }))

  const effectiveActiveCategory = categories.some(c => c.id === activeCategory)
    ? activeCategory
    : (categories[0]?.id || 'Selecciones Nacionales')

  const categoryProducts = products.filter(p => p.categoria === effectiveActiveCategory)

  return (
    <div className="section pro-categories-section py-5">
      <div className="container">
        <div className="has-text-centered mb-5">
          <span className="editorial-kicker">COLECCIÓN 2026</span>
          <h1 className="title is-2 mb-2 has-text-weight-bold">Comprar por Categoría</h1>
          <p className="subtitle is-6 has-text-grey">
            Explora las colecciones exclusivas divididas por tipo de competición
          </p>
        </div>

        {/* Grilla limpia de categorías estilo Nike */}
        <div className="nike-teams-grid mb-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`nike-team-item cursor-pointer ${effectiveActiveCategory === cat.id ? 'is-selected' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') setActiveCategory(cat.id) }}
            >
              <div className="nike-team-img-wrap">
                <img
                  src={cat.img}
                  alt={cat.title}
                  className="nike-team-img"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/85x85/FFFFFF/111827?text=' + cat.title
                  }}
                />
              </div>
              <span className="nike-team-name">{cat.title}</span>
              <span className="is-size-7 has-text-grey mt-1">({cat.count} modelos)</span>
            </div>
          ))}
        </div>

        <div className="mb-4 is-flex is-justify-content-space-between is-align-items-center border-bottom-subtle pb-2">
          <h2 className="title is-4 mb-0 has-text-weight-bold">{effectiveActiveCategory}</h2>
          <span className="tag is-dark is-rounded">{categoryProducts.length} camisetas</span>
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

export default CategoriesView
