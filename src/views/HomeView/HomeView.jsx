import { useState, useMemo } from 'react'
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
  const [teamCategoryFilter, setTeamCategoryFilter] = useState('Todas')

  // Carrusel con los productos más destacados (hasta 5)
  const bannerProducts = useMemo(() => {
    if (!products || products.length === 0) return []
    return products.slice(0, 5)
  }, [products])

  const dynamicCategories = useMemo(() => {
    return Array.from(new Set(products.map(p => p.categoria).filter(Boolean)))
  }, [products])

  const categories = useMemo(() => {
    return ['Todas', ...(dynamicCategories.length > 0 ? dynamicCategories : ['Selecciones Nacionales', 'Clubes Chilenos'])]
  }, [dynamicCategories])

  const filteredProducts = useMemo(() => {
    if (activeFilter === 'Todas') return products
    return products.filter(p => p.categoria === activeFilter)
  }, [products, activeFilter])

  // Equipos y selecciones reconocidas para la sección "ENCUENTRA TU EQUIPO"
  const knownTeams = useMemo(() => [
    {
      id: 'brasil',
      name: 'Brasil',
      query: 'Brasil',
      category: 'Selecciones Nacionales',
      subtitle: 'Pentacampeón',
      flag: '🇧🇷',
      bgColor: '#105B38',
      textColor: '#FFE11F'
    },
    {
      id: 'udechile',
      name: 'U. de Chile',
      query: 'Universidad de Chile',
      category: 'Clubes Chilenos',
      subtitle: 'El Romántico Viajero',
      flag: '🇨🇱',
      bgColor: '#002B7F',
      textColor: '#D6001C'
    },
    {
      id: 'francia',
      name: 'Francia',
      query: 'Francia',
      category: 'Selecciones Nacionales',
      subtitle: 'Les Bleus',
      flag: '🇫🇷',
      bgColor: '#002654',
      textColor: '#CE1126'
    },
    {
      id: 'colocolo',
      name: 'Colo-Colo',
      query: 'Colo-Colo',
      category: 'Clubes Chilenos',
      subtitle: 'El Eterno Campeón',
      flag: '🇨🇱',
      bgColor: '#111827',
      textColor: '#FFFFFF'
    },
    {
      id: 'argentina',
      name: 'Argentina',
      query: 'Argentina',
      category: 'Selecciones Nacionales',
      subtitle: 'Tres Estrellas',
      flag: '🇦🇷',
      bgColor: '#75AADB',
      textColor: '#FFFFFF'
    },
    {
      id: 'catolica',
      name: 'U. Católica',
      query: 'Católica',
      category: 'Clubes Chilenos',
      subtitle: 'Los Cruzados',
      flag: '🇨🇱',
      bgColor: '#003366',
      textColor: '#FFFFFF'
    },
    {
      id: 'espana',
      name: 'España',
      query: 'España',
      category: 'Selecciones Nacionales',
      subtitle: 'La Roja Europea',
      flag: '🇪🇸',
      bgColor: '#AA151B',
      textColor: '#F1BF00'
    },
    {
      id: 'palestino',
      name: 'Palestino',
      query: 'Palestino',
      category: 'Clubes Chilenos',
      subtitle: 'Tricolor Árabe',
      flag: '🇵🇸',
      bgColor: '#007A3D',
      textColor: '#FFFFFF'
    }
  ], [])

  // Filtrar tarjetas de equipos según pestaña de categoría
  const displayedTeams = useMemo(() => {
    if (teamCategoryFilter === 'Todas') return knownTeams
    return knownTeams.filter(t => t.category === teamCategoryFilter)
  }, [knownTeams, teamCategoryFilter])

  const handleTeamClick = (team) => {
    if (onNavigate) {
      onNavigate(`productos?buscar=${encodeURIComponent(team.query)}`)
    }
  }

  return (
    <div className="home-view-wrapper">
      {/* 1. HERO CAROUSEL EDITORIAL */}
      <div className="container px-3 pt-3">
        <Carousel
          items={bannerProducts}
          onSelectItem={onSelectProduct}
        />
      </div>

      {/* 2. FRANJA DE BENEFICIOS / CONFIANZA */}
      <section className="trust-badges-bar py-4 my-2" aria-label="Beneficios de la tienda">
        <div className="container">
          <div className="columns is-mobile is-multiline is-vcentered has-text-centered">
            <div className="column is-6-mobile is-3-tablet">
              <div className="trust-badge-item">
                <span className="trust-badge-icon">🚚</span>
                <div className="trust-badge-text">
                  <strong className="is-size-7 is-uppercase">Envíos a todo Chile</strong>
                  <p className="is-size-7 has-text-grey">Rápido, seguro y con seguimiento</p>
                </div>
              </div>
            </div>

            <div className="column is-6-mobile is-3-tablet">
              <div className="trust-badge-item">
                <span className="trust-badge-icon">⭐</span>
                <div className="trust-badge-text">
                  <strong className="is-size-7 is-uppercase">100% Oficiales</strong>
                  <p className="is-size-7 has-text-grey">Calidad prémium garantizada</p>
                </div>
              </div>
            </div>

            <div className="column is-6-mobile is-3-tablet">
              <div className="trust-badge-item">
                <span className="trust-badge-icon">🔒</span>
                <div className="trust-badge-text">
                  <strong className="is-size-7 is-uppercase">Pago 100% Seguro</strong>
                  <p className="is-size-7 has-text-grey">Transbank Webpay Plus y Débito</p>
                </div>
              </div>
            </div>

            <div className="column is-6-mobile is-3-tablet">
              <div className="trust-badge-item">
                <span className="trust-badge-icon">🔄</span>
                <div className="trust-badge-text">
                  <strong className="is-size-7 is-uppercase">Cambios y Devoluciones</strong>
                  <p className="is-size-7 has-text-grey">Garantía de satisfacción 30 días</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECCIÓN "ENCUENTRA TU EQUIPO" */}
      <section className="section py-5 find-team-section">
        <div className="container">
          <div className="section-editorial-header mb-4">
            <div className="is-flex is-justify-content-space-between is-align-items-flex-end is-flex-wrap-wrap gap-2">
              <div>
                <span className="editorial-kicker">SELECCIÓN PERSONALIZADA</span>
                <h2 className="title is-3 mb-1 has-text-weight-bold">ENCUENTRA TU EQUIPO</h2>
                <p className="subtitle is-6 has-text-grey mb-0">
                  Explora las camisetas de tus clubes chilenos y selecciones internacionales favoritas
                </p>
              </div>

              {/* Filtros rápidos de categoría para equipos */}
              <div className="buttons are-small team-filter-tabs mb-0">
                {['Todas', 'Selecciones Nacionales', 'Clubes Chilenos'].map((tabCat) => (
                  <button
                    key={tabCat}
                    type="button"
                    className={`button is-rounded ${teamCategoryFilter === tabCat ? 'is-dark' : 'is-light'}`}
                    onClick={() => setTeamCategoryFilter(tabCat)}
                  >
                    {tabCat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="columns is-mobile is-multiline teams-grid">
            {displayedTeams.map((team) => {
              // Contar productos reales existentes en el catálogo
              const teamProductCount = products.filter(p =>
                (p.titulo || '').toLowerCase().includes(team.query.toLowerCase())
              ).length

              return (
                <div key={team.id} className="column is-6-mobile is-3-tablet is-3-desktop">
                  <div
                    className="team-quick-card cursor-pointer"
                    onClick={() => handleTeamClick(team)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleTeamClick(team) }}
                  >
                    <div className="team-quick-card-badge" style={{ backgroundColor: team.bgColor, color: team.textColor }}>
                      <span className="team-flag">{team.flag}</span>
                    </div>

                    <div className="team-quick-card-info">
                      <h4 className="team-name">{team.name}</h4>
                      <p className="team-subtitle">{team.subtitle}</p>
                      <span className="team-products-count">
                        {teamProductCount > 0 ? `${teamProductCount} disponibles` : 'Ver catálogo'} &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 4. GRILLA "COLECCIÓN DESTACADA 2026" */}
      <section className="section py-5 featured-collection-section">
        <div className="container">
          <div className="has-text-centered mb-5">
            <span className="editorial-kicker">TEMPORADA 2026</span>
            <h2 className="title is-2 mb-2 has-text-weight-bold">COLECCIÓN DESTACADA</h2>
            <p className="subtitle is-6 has-text-grey">
              Camisetas oficiales de selecciones mundiales y clubes del fútbol chileno.
            </p>

            <div className="buttons is-centered mt-4">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={activeFilter === cat ? 'primary' : 'light'}
                  size="small"
                  className="is-rounded px-4"
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
              size="medium"
              className="px-5 has-text-weight-bold is-rounded"
              onClick={() => onNavigate && onNavigate('productos')}
            >
              EXPLORAR TODO EL CATÁLOGO &rarr;
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomeView
