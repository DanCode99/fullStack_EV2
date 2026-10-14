import { useState } from 'react'
import { ProductCard } from '../../components/molecules/ProductCard/ProductCard.jsx'
import { Button } from '../../components/atoms/Button/Button.jsx'

export function ProductsView({
  products = [],
  onSelectProduct,
  onAddToCart
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todas')
  const [sortOrder, setSortOrder] = useState('default')

  const categories = ['Todas', 'Selecciones Nacionales', 'Clubes Chilenos']

  let filtered = products.filter(p => {
    const matchesSearch = p.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'Todas' || p.categoria === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (sortOrder === 'asc') {
    filtered = [...filtered].sort((a, b) => a.precio - b.precio)
  } else if (sortOrder === 'desc') {
    filtered = [...filtered].sort((a, b) => b.precio - a.precio)
  }

  return (
    <div className="section">
      <div className="container">
        <div className="has-text-centered mb-5">
          <h1 className="title is-2">Catálogo Completo</h1>
          <p className="subtitle is-6 has-text-grey">
            Encuentra las mejores camisetas de fútbol con despacho a todo Chile
          </p>
        </div>

        <div className="box mb-5">
          <div className="columns is-vcentered">
            <div className="column is-5">
              <div className="field">
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    placeholder="Buscar por equipo o país..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="column is-4">
              <div className="field">
                <div className="control">
                  <div className="select is-fullwidth">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="column is-3">
              <div className="field">
                <div className="control">
                  <div className="select is-fullwidth">
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                    >
                      <option value="default">Ordenar por...</option>
                      <option value="asc">Precio: Menor a Mayor</option>
                      <option value="desc">Precio: Mayor a Menor</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="notification is-light has-text-centered my-6">
            <p className="is-size-5">No encontramos productos que coincidan con tu búsqueda.</p>
            <Button
              variant="dark"
              size="small"
              className="mt-3"
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('Todas')
                setSortOrder('default')
              }}
            >
              Restablecer filtros
            </Button>
          </div>
        ) : (
          <div className="columns is-multiline">
            {filtered.map((prod) => (
              <div key={prod.id} className="column is-12-mobile is-6-tablet is-4-desktop is-3-widescreen">
                <ProductCard
                  product={prod}
                  onSelect={onSelectProduct}
                  onAddToCart={onAddToCart}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
