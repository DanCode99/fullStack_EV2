import { useMemo } from 'react'
import { Carousel } from '../../components/organisms/Carousel/Carousel.jsx'
import { ProductCard } from '../../components/molecules/ProductCard/ProductCard.jsx'
import { Button } from '../../components/atoms/Button/Button.jsx'
import { enrichProductWithDiscounts } from '../../context/cartHelpers.js'

export function HomeView({
  products = [],
  onSelectProduct,
  onAddToCart,
  onNavigate
}) {
  // 0. Enriquecer productos con descuentos oficiales y marcas
  const enrichedProducts = useMemo(() => {
    return (products || []).map(enrichProductWithDiscounts)
  }, [products])

  // 1. Carrusel principal (Hero Banner con autoplay funcional)
  const bannerProducts = useMemo(() => {
    if (!enrichedProducts || enrichedProducts.length === 0) return []
    return enrichedProducts.slice(0, 5)
  }, [enrichedProducts])

  // 2. Curación de 4 camisetas destacadas para la fila principal (products.slice(0, 4))
  const featuredProducts = useMemo(() => {
    if (!enrichedProducts || enrichedProducts.length === 0) return []
    return enrichedProducts.slice(0, 4)
  }, [enrichedProducts])

  // 3. Equipos y selecciones reales disponibles en nuestra base de datos
  const availableTeams = useMemo(() => [
    {
      id: 'brasil',
      name: 'Brasil',
      query: 'Brasil',
      img: '/assets/images/brasil/brasil1.jpeg'
    },
    {
      id: 'udechile',
      name: 'U. de Chile',
      query: 'Universidad de Chile',
      img: '/assets/images/u_de_chile/lau1.webp'
    },
    {
      id: 'francia',
      name: 'Francia',
      query: 'Francia',
      img: '/assets/images/francia/francia1.png'
    },
    {
      id: 'espana',
      name: 'España',
      query: 'España',
      img: '/assets/images/españa/españa2.jpg'
    },
    {
      id: 'argentina',
      name: 'Argentina',
      query: 'Argentina',
      img: '/assets/images/argentina/argentina1.jpg'
    },
    {
      id: 'colocolo',
      name: 'Colo-Colo',
      query: 'Colo-Colo',
      img: '/assets/images/zorras/zorra1.jpg'
    }
  ], [])

  const handleTeamClick = (team) => {
    if (onNavigate) {
      onNavigate(`productos?buscar=${encodeURIComponent(team.query)}`)
    }
  }

  return (
    <div className="home-view-wrapper">
      {/* 1. HERO BANNER / CARRUSEL PRINCIPAL */}
      <div className="container px-3 pt-4">
        <Carousel
          items={bannerProducts}
          onSelectItem={onSelectProduct}
        />
      </div>

      {/* 2. BARRA DE BENEFICIOS / CONFIANZA CON ICONOS VECTORIALES SVG MINIMALISTAS */}
      <section className="trust-badges-bar py-4 my-2" aria-label="Beneficios de la tienda">
        <div className="container">
          <div className="columns is-mobile is-multiline is-vcentered has-text-centered">
            {/* Envíos a todo Chile */}
            <div className="column is-6-mobile is-3-tablet">
              <div className="trust-badge-item">
                <span className="trust-badge-svg-wrap">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </span>
                <div className="trust-badge-text">
                  <strong className="is-size-7 is-uppercase">Envíos a todo Chile</strong>
                  <p className="is-size-7 has-text-grey">Rápido, seguro y con seguimiento</p>
                </div>
              </div>
            </div>

            {/* Camisetas 100% Oficiales */}
            <div className="column is-6-mobile is-3-tablet">
              <div className="trust-badge-item">
                <span className="trust-badge-svg-wrap">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </span>
                <div className="trust-badge-text">
                  <strong className="is-size-7 is-uppercase">Camisetas 100% Oficiales</strong>
                  <p className="is-size-7 has-text-grey">Calidad prémium garantizada</p>
                </div>
              </div>
            </div>

            {/* Pago Seguro */}
            <div className="column is-6-mobile is-3-tablet">
              <div className="trust-badge-item">
                <span className="trust-badge-svg-wrap">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <div className="trust-badge-text">
                  <strong className="is-size-7 is-uppercase">Pago Seguro</strong>
                  <p className="is-size-7 has-text-grey">Transbank Webpay Plus y Débito</p>
                </div>
              </div>
            </div>

            {/* Cambios y Devoluciones */}
            <div className="column is-6-mobile is-3-tablet">
              <div className="trust-badge-item">
                <span className="trust-badge-svg-wrap">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 4 23 10 17 10" />
                    <polyline points="1 20 1 14 7 14" />
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                  </svg>
                </span>
                <div className="trust-badge-text">
                  <strong className="is-size-7 is-uppercase">Cambios y Devoluciones</strong>
                  <p className="is-size-7 has-text-grey">Garantía de satisfacción 30 días</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECCIÓN "COLECCIÓN DESTACADA": 4 CAMISETAS EN UNA FILA DE 4 COLUMNAS */}
      <section className="section py-5 featured-collection-section">
        <div className="container">
          <div className="has-text-centered mb-5">
            <span className="editorial-kicker">TEMPORADA 2026</span>
            <h2 className="title is-2 mb-2 has-text-weight-bold">COLECCIÓN DESTACADA</h2>
            <p className="subtitle is-6 has-text-grey">
              Selección exclusiva de camisetas oficiales de selecciones y clubes del fútbol chileno.
            </p>
          </div>

          <div className="columns is-multiline">
            {featuredProducts.map((prod) => (
              <div key={prod.id} className="column is-12-mobile is-6-tablet is-3-desktop">
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
              VER TODO EL CATÁLOGO &rarr;
            </Button>
          </div>
        </div>
      </section>

      {/* 4. SECCIÓN "ENCUENTRA TU EQUIPO" (AL FINAL, ESTILO NIKE CON MINIATURAS LIMPIAS) */}
      <section className="section py-5 find-team-clean-section">
        <div className="container">
          <div className="has-text-centered mb-5">
            <span className="editorial-kicker">CATÁLOGO OFICIAL</span>
            <h2 className="title is-3 mb-2 has-text-weight-bold">ENCUENTRA TU EQUIPO</h2>
            <p className="subtitle is-6 has-text-grey">
              Elige tu equipo o selección para acceder de inmediato a sus camisetas disponibles
            </p>
          </div>

          <div className="nike-teams-grid">
            {availableTeams.map((team) => (
              <div
                key={team.id}
                className="nike-team-item cursor-pointer"
                onClick={() => handleTeamClick(team)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') handleTeamClick(team) }}
              >
                <div className="nike-team-img-wrap">
                  <img
                    src={team.img}
                    alt={team.name}
                    className="nike-team-img"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/85x85/FFFFFF/111827?text=' + team.name
                    }}
                  />
                </div>
                <span className="nike-team-name">{team.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomeView
