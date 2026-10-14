import { useState } from 'react'
import { Carousel } from '../../components/organisms/Carousel/Carousel.jsx'
import { ProductCard } from '../../components/molecules/ProductCard/ProductCard.jsx'
import { Button } from '../../components/atoms/Button/Button.jsx'

export function HomeView({
  products = [],
  onSelectProduct,
  onAddToCart,
  onNavigate
}) {
  const [activeFilter, setActiveFilter] = useState('Todas')
  const bannerProducts = products.slice(0, 3)

  const categories = ['Todas', 'Selecciones Nacionales', 'Clubes Chilenos']

  const filteredProducts = activeFilter === 'Todas'
    ? products
    : products.filter(p => p.categoria === activeFilter)

  return (
    <div className="section pt-4">
      <div className="container">
        <Carousel
          items={bannerProducts}
          onSelectItem={onSelectProduct}
        />

        <div className="has-text-centered mb-5">
          <h1 className="title is-2 mb-2">Colección Destacada 2026</h1>
          <p className="subtitle is-6 has-text-grey">
            Camisetas oficiales de selecciones mundiales y clubes del fútbol chileno.
          </p>

          <div className="buttons is-centered mt-4">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={activeFilter === cat ? 'primary' : 'light'}
                size="small"
                onClick={() => setActiveFilter(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        <div className="columns is-multiline">
          {filteredProducts.map((prod) => (
            <div key={prod.id} className="column is-12-mobile is-6-tablet is-4-desktop is-3-widescreen">
              <ProductCard
                product={prod}
                onSelect={onSelectProduct}
                onAddToCart={onAddToCart}
              />
            </div>
          ))}
        </div>

        <div className="has-text-centered mt-6">
          <Button
            variant="dark"
            onClick={() => onNavigate('productos')}
          >
            Explorar Todo el Catálogo &rarr;
          </Button>
        </div>
      </div>
    </div>
  )
}
