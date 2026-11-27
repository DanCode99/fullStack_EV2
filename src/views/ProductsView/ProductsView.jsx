import { useState, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { ProductCard } from '../../components/molecules/ProductCard/ProductCard.jsx'
import { Button } from '../../components/atoms/Button/Button.jsx'
import { enrichProductWithDiscounts } from '../../context/cartHelpers.js'

export function ProductsView({
  products = [],
  onSelectProduct,
  onAddToCart
}) {
  const location = useLocation()

  // 0. Enriquecer productos con descuentos unificados y marcas oficiales (Colo-Colo -> Adidas, cero Puma)
  const enrichedProducts = useMemo(() => {
    return (products || []).map(enrichProductWithDiscounts)
  }, [products])

  // 1. Extraer query params de URL inicial
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search])
  const initialSearch = queryParams.get('buscar') || ''
  const initialCategory = queryParams.get('categoria')
  const initialBrand = queryParams.get('marca')

  // 2. Extraer dinámicamente precios extremos del catálogo
  const { minCatalogPrice, maxCatalogPrice } = useMemo(() => {
    if (!enrichedProducts || enrichedProducts.length === 0) {
      return { minCatalogPrice: 0, maxCatalogPrice: 100000 }
    }
    const prices = enrichedProducts.map(p => Number(p.precio) || 0)
    return {
      minCatalogPrice: Math.min(...prices),
      maxCatalogPrice: Math.max(...prices)
    }
  }, [enrichedProducts])

  // 3. Estados de filtros con inicialización perezosa / default
  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const [selectedCategories, setSelectedCategories] = useState(initialCategory ? [initialCategory] : [])
  const [selectedBrands, setSelectedBrands] = useState(initialBrand ? [initialBrand] : [])
  const [sortOrder, setSortOrder] = useState('default')
  const [userMinPrice, setUserMinPrice] = useState(null)
  const [userMaxPrice, setUserMaxPrice] = useState(null)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  // Sincronizar reactivamente cuando cambia location.search (ej. navegación desde Mega-Menú)
  const [prevSearch, setPrevSearch] = useState(location.search)
  if (prevSearch !== location.search) {
    setPrevSearch(location.search)
    setSearchTerm(initialSearch)
    if (initialCategory) setSelectedCategories([initialCategory])
    else if (location.search === '') setSelectedCategories([])
    if (initialBrand) setSelectedBrands([initialBrand])
    else if (location.search === '') setSelectedBrands([])
  }

  // Precios efectivos
  const minPrice = userMinPrice !== null ? userMinPrice : minCatalogPrice
  const maxPrice = userMaxPrice !== null ? userMaxPrice : maxCatalogPrice

  // 4. Lista dinámica de categorías con conteo real en BD
  const categoryStats = useMemo(() => {
    const counts = {}
    enrichedProducts.forEach(p => {
      if (p.categoria) {
        counts[p.categoria] = (counts[p.categoria] || 0) + 1
      }
    })

    const knownKeys = ['Selecciones Nacionales', 'Clubes Chilenos']
    const allKeys = Array.from(new Set([...knownKeys, ...Object.keys(counts)]))

    return allKeys.map(cat => ({
      name: cat,
      count: counts[cat] || 0
    }))
  }, [enrichedProducts])

  // 5. Lista dinámica de marcas oficiales (únicamente Nike y Adidas, sin Puma)
  const brandStats = useMemo(() => {
    const counts = { Nike: 0, Adidas: 0 }
    enrichedProducts.forEach(p => {
      const b = p.nombreMarca || p.marca
      if (b && counts[b] !== undefined) {
        counts[b] += 1
      } else if (b) {
        if (b.toLowerCase().includes('adidas')) counts.Adidas += 1
        else if (b.toLowerCase().includes('nike')) counts.Nike += 1
      }
    })

    return Object.entries(counts).map(([brand, count]) => ({
      name: brand,
      count
    }))
  }, [enrichedProducts])

  // 6. Toggle de categorías
  const handleCategoryToggle = (categoryName) => {
    if (categoryName === 'Todas') {
      setSelectedCategories([])
      return
    }

    setSelectedCategories(prev => {
      if (prev.includes(categoryName)) {
        return prev.filter(c => c !== categoryName)
      } else {
        return [...prev, categoryName]
      }
    })
  }

  // 7. Toggle de marcas
  const handleBrandToggle = (brandName) => {
    setSelectedBrands(prev => {
      if (prev.includes(brandName)) {
        return prev.filter(b => b !== brandName)
      } else {
        return [...prev, brandName]
      }
    })
  }

  // 8. Botón Limpiar Filtros
  const handleResetFilters = () => {
    setSearchTerm('')
    setSelectedCategories([])
    setSelectedBrands([])
    setUserMinPrice(null)
    setUserMaxPrice(null)
    setSortOrder('default')
  }

  // 9. Filtrado reactivo en tiempo real combinando todos los criterios
  const filteredProducts = useMemo(() => {
    let result = enrichedProducts.filter(p => {
      // Búsqueda por texto (título, descripción, marca, categoría)
      const term = searchTerm.trim().toLowerCase()
      if (term) {
        const titleMatch = (p.titulo || '').toLowerCase().includes(term)
        const descMatch = (p.descripcion || '').toLowerCase().includes(term)
        const brandMatch = (p.nombreMarca || '').toLowerCase().includes(term)
        const catMatch = (p.categoria || '').toLowerCase().includes(term)
        if (!titleMatch && !descMatch && !brandMatch && !catMatch) return false
      }

      // Filtro por categorías seleccionadas
      if (selectedCategories.length > 0) {
        if (!selectedCategories.includes(p.categoria)) return false
      }

      // Filtro por marcas seleccionadas (Nike / Adidas)
      if (selectedBrands.length > 0) {
        const b = p.nombreMarca || p.marca
        if (!selectedBrands.includes(b)) return false
      }

      // Filtro por rango de precio
      const price = Number(p.precio) || 0
      if (price < minPrice || price > maxPrice) return false

      return true
    })

    // Ordenamiento
    if (sortOrder === 'asc') {
      result.sort((a, b) => Number(a.precio) - Number(b.precio))
    } else if (sortOrder === 'desc') {
      result.sort((a, b) => Number(b.precio) - Number(a.precio))
    } else if (sortOrder === 'alpha') {
      result.sort((a, b) => (a.titulo || '').localeCompare(b.titulo || ''))
    }

    return result
  }, [enrichedProducts, searchTerm, selectedCategories, selectedBrands, minPrice, maxPrice, sortOrder])

  // Controles del slider sincronizados
  const handleMinSliderChange = (e) => {
    const val = Math.min(Number(e.target.value), maxPrice)
    setUserMinPrice(val)
  }

  const handleMaxSliderChange = (e) => {
    const val = Math.max(Number(e.target.value), minPrice)
    setUserMaxPrice(val)
  }

  const isFiltered = searchTerm !== '' ||
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    minPrice > minCatalogPrice ||
    maxPrice < maxCatalogPrice

  return (
    <div className="section pro-catalog-section py-5">
      <div className="container">
        {/* Encabezado Editorial del Catálogo */}
        <div className="catalog-hero-header mb-5">
          <div className="is-flex is-justify-content-space-between is-align-items-center is-flex-wrap-wrap gap-2">
            <div>
              <span className="editorial-kicker">TIENDA OFICIAL</span>
              <h1 className="title is-2 mb-1 has-text-weight-bold">CATÁLOGO DE PRODUCTOS</h1>
              <p className="subtitle is-6 has-text-grey mb-0">
                Camisetas originales con los mejores estándares deportivos y despacho a todo Chile
              </p>
            </div>

            {/* Botón flotante para abrir filtros en móviles */}
            <div className="is-hidden-tablet">
              <button
                type="button"
                className="button is-dark is-rounded pro-mobile-filter-btn"
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <line x1="4" y1="21" x2="4" y2="14" />
                  <line x1="4" y1="10" x2="4" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12" y2="3" />
                  <line x1="20" y1="21" x2="20" y2="16" />
                  <line x1="20" y1="12" x2="20" y2="3" />
                  <line x1="1" y1="14" x2="7" y2="14" />
                  <line x1="9" y1="8" x2="15" y2="8" />
                  <line x1="17" y1="16" x2="23" y2="16" />
                </svg>
                <span>{isMobileFilterOpen ? 'Ocultar filtros' : 'Filtrar productos'}</span>
                {isFiltered && <span className="tag is-primary is-rounded ml-2">!</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Layout de 2 Columnas: Sidebar a la izquierda + Catálogo a la derecha */}
        <div className="columns is-variable is-5">
          {/* ======================================================== */}
          {/* SIDEBAR LATERAL IZQUIERDO DE FILTROS                    */}
          {/* ======================================================== */}
          <aside className={`column is-3-desktop is-4-tablet catalog-sidebar-col ${isMobileFilterOpen ? 'is-mobile-open' : ''}`}>
            <div className="box catalog-filters-sidebar">
              <div className="is-flex is-justify-content-space-between is-align-items-center mb-4 pb-2 border-bottom-subtle">
                <h3 className="title is-5 mb-0 has-text-weight-bold is-flex is-align-items-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00b89c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                  FILTROS
                </h3>

                {isFiltered && (
                  <button
                    type="button"
                    className="button is-text is-small has-text-danger p-0"
                    onClick={handleResetFilters}
                  >
                    Limpiar todo
                  </button>
                )}
              </div>

              {/* 1. FILTRO POR CATEGORÍA */}
              <div className="filter-group mb-5">
                <h4 className="filter-group-title">CATEGORÍA / TIPO</h4>
                <div className="filter-options-list">
                  <label className="checkbox filter-checkbox-item">
                    <input
                      type="checkbox"
                      checked={selectedCategories.length === 0}
                      onChange={() => handleCategoryToggle('Todas')}
                    />
                    <span className="filter-checkbox-label">Todas las camisetas</span>
                    <span className="filter-item-count">({products.length})</span>
                  </label>

                  {categoryStats.map(cat => (
                    <label key={cat.name} className="checkbox filter-checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.name)}
                        onChange={() => handleCategoryToggle(cat.name)}
                      />
                      <span className="filter-checkbox-label">{cat.name}</span>
                      <span className="filter-item-count">({cat.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 2. FILTRO POR MARCA */}
              <div className="filter-group mb-5">
                <h4 className="filter-group-title">MARCA DEPORTIVA</h4>
                <div className="filter-options-list">
                  {brandStats.map(brand => (
                    <label key={brand.name} className="checkbox filter-checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand.name)}
                        onChange={() => handleBrandToggle(brand.name)}
                      />
                      <span className="filter-checkbox-label">{brand.name}</span>
                      <span className="filter-item-count">({brand.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 3. FILTRO DE RANGO DE PRECIO ($) TOTALMENTE FUNCIONAL */}
              <div className="filter-group mb-5">
                <div className="is-flex is-justify-content-space-between is-align-items-center mb-2">
                  <h4 className="filter-group-title mb-0">RANGO DE PRECIO</h4>
                  <span className="is-size-7 has-text-primary has-text-weight-bold">
                    ${minPrice.toLocaleString('es-CL')} - ${maxPrice.toLocaleString('es-CL')}
                  </span>
                </div>

                {/* Slider interactivo */}
                <div className="range-slider-wrapper my-3">
                  <div className="range-inputs-dual">
                    <input
                      type="range"
                      min={minCatalogPrice}
                      max={maxCatalogPrice}
                      step="1000"
                      value={minPrice}
                      onChange={handleMinSliderChange}
                      className="slider-input min-slider"
                      aria-label="Precio Mínimo"
                    />
                    <input
                      type="range"
                      min={minCatalogPrice}
                      max={maxCatalogPrice}
                      step="1000"
                      value={maxPrice}
                      onChange={handleMaxSliderChange}
                      className="slider-input max-slider"
                      aria-label="Precio Máximo"
                    />
                  </div>

                  <div className="is-flex is-justify-content-space-between is-size-7 has-text-grey mt-1">
                    <span>${minCatalogPrice.toLocaleString('es-CL')}</span>
                    <span>${maxCatalogPrice.toLocaleString('es-CL')}</span>
                  </div>
                </div>

                {/* Inputs numéricos manuales */}
                <div className="columns is-mobile is-variable is-1 mt-2">
                  <div className="column is-6">
                    <div className="field">
                      <label className="label is-size-7 mb-1">Mínimo ($)</label>
                      <div className="control">
                        <input
                          type="number"
                          className="input is-small has-text-weight-semibold"
                          value={minPrice}
                          min={minCatalogPrice}
                          max={maxPrice}
                          step="1000"
                          onChange={(e) => {
                            const val = Number(e.target.value) || minCatalogPrice
                            setUserMinPrice(Math.min(val, maxPrice))
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="column is-6">
                    <div className="field">
                      <label className="label is-size-7 mb-1">Máximo ($)</label>
                      <div className="control">
                        <input
                          type="number"
                          className="input is-small has-text-weight-semibold"
                          value={maxPrice}
                          min={minPrice}
                          max={maxCatalogPrice}
                          step="1000"
                          onChange={(e) => {
                            const val = Number(e.target.value) || maxCatalogPrice
                            setUserMaxPrice(Math.max(val, minPrice))
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón de reset */}
              <button
                type="button"
                className="button is-dark is-fullwidth is-small is-outlined is-rounded mt-4"
                onClick={handleResetFilters}
              >
                Restablecer todos los filtros
              </button>
            </div>
          </aside>

          {/* ======================================================== */}
          {/* GRILLA DERECHA: BÚSQUEDA, ORDEN Y PRODUCTOS             */}
          {/* ======================================================== */}
          <main className="column is-9-desktop is-8-tablet catalog-main-col">
            {/* Barra superior de Búsqueda y Ordenamiento */}
            <div className="box catalog-toolbar-box mb-4 p-4">
              <div className="columns is-vcentered">
                {/* Buscador en tiempo real */}
                <div className="column is-7">
                  <div className="field mb-0">
                    <div className="control has-icons-left">
                      <input
                        className="input is-rounded search-catalog-input"
                        type="text"
                        placeholder="Buscar por equipo, país, descripción o marca..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <span className="icon is-small is-left has-text-grey">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Selector de ordenamiento */}
                <div className="column is-5">
                  <div className="field is-horizontal is-justify-content-flex-end mb-0">
                    <div className="field-body is-flex is-align-items-center">
                      <label className="label is-size-7 mr-2 mb-0 is-hidden-mobile nowrap">Ordenar por:</label>
                      <div className="select is-rounded is-fullwidth is-small">
                        <select
                          value={sortOrder}
                          onChange={(e) => setSortOrder(e.target.value)}
                          aria-label="Criterio de ordenamiento"
                        >
                          <option value="default">Relevancia / Destacados</option>
                          <option value="asc">Precio: Menor a Mayor</option>
                          <option value="desc">Precio: Mayor a Menor</option>
                          <option value="alpha">Nombre: A - Z</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chips de filtros activos */}
              {isFiltered && (
                <div className="active-filters-bar mt-3 pt-2 border-top-subtle is-flex is-align-items-center is-flex-wrap-wrap gap-2">
                  <span className="is-size-7 has-text-weight-bold has-text-grey mr-1">Filtros activos:</span>

                  {searchTerm && (
                    <span className="tag is-info is-light is-rounded">
                      Texto: &quot;{searchTerm}&quot;
                      <button
                        type="button"
                        className="delete is-small"
                        onClick={() => setSearchTerm('')}
                        aria-label="Quitar filtro de búsqueda"
                      />
                    </span>
                  )}

                  {selectedCategories.map(cat => (
                    <span key={cat} className="tag is-primary is-light is-rounded">
                      {cat}
                      <button
                        type="button"
                        className="delete is-small"
                        onClick={() => handleCategoryToggle(cat)}
                        aria-label={`Quitar filtro ${cat}`}
                      />
                    </span>
                  ))}

                  {selectedBrands.map(brand => (
                    <span key={brand} className="tag is-link is-light is-rounded">
                      Marca: {brand}
                      <button
                        type="button"
                        className="delete is-small"
                        onClick={() => handleBrandToggle(brand)}
                        aria-label={`Quitar filtro ${brand}`}
                      />
                    </span>
                  ))}

                  {(minPrice > minCatalogPrice || maxPrice < maxCatalogPrice) && (
                    <span className="tag is-warning is-light is-rounded">
                      ${minPrice.toLocaleString('es-CL')} - ${maxPrice.toLocaleString('es-CL')}
                      <button
                        type="button"
                        className="delete is-small"
                        onClick={() => {
                          setUserMinPrice(null)
                          setUserMaxPrice(null)
                        }}
                        aria-label="Restablecer rango de precio"
                      />
                    </span>
                  )}

                  <button
                    type="button"
                    className="button is-text is-small has-text-grey p-0 ml-2"
                    onClick={handleResetFilters}
                  >
                    Limpiar filtros
                  </button>
                </div>
              )}
            </div>

            {/* Contador de resultados */}
            <div className="is-flex is-justify-content-space-between is-align-items-center mb-4 px-1">
              <span className="is-size-7 has-text-grey">
                Mostrando <strong>{filteredProducts.length}</strong> de {products.length} productos
              </span>
            </div>

            {/* Grilla de productos o Estado Vacío */}
            {filteredProducts.length === 0 ? (
              <div className="box catalog-empty-state has-text-centered py-6 px-4">
                <div className="empty-state-svg-wrap mb-3">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                  </svg>
                </div>
                <h3 className="title is-4 mb-2 has-text-weight-bold">No se encontraron productos</h3>
                <p className="subtitle is-6 has-text-grey mb-4">
                  No hay camisetas que coincidan con los filtros de búsqueda o rango de precio seleccionados.
                </p>
                <Button
                  variant="dark"
                  size="small"
                  className="is-rounded px-4"
                  onClick={handleResetFilters}
                >
                  Restablecer todos los filtros
                </Button>
              </div>
            ) : (
              <div className="columns is-multiline">
                {filteredProducts.map((prod) => (
                  <div key={prod.id} className="column is-12-mobile is-6-tablet is-4-desktop">
                    <ProductCard
                      product={prod}
                      onSelect={onSelectProduct}
                      onAddToCart={onAddToCart}
                    />
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default ProductsView
