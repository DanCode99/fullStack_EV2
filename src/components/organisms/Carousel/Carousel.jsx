import { useState, useEffect, useRef } from 'react'

export function Carousel({ items = [], onSelectItem }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef(null)

  const hasItems = Array.isArray(items) && items.length > 0

  useEffect(() => {
    if (!hasItems || isPaused || items.length <= 1) return

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1))
    }, 4500)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [hasItems, isPaused, items.length])

  if (!hasItems) return null

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1))
  }

  const currentItem = items[currentIndex] || items[0]

  return (
    <div
      id="caja-banner"
      className="hero-editorial-carousel mb-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Carrusel de Colección Destacada"
    >
      <button
        id="btn-izq-banner"
        className="carousel-nav-btn prev-btn button is-dark is-rounded"
        onClick={handlePrev}
        aria-label="Anterior"
        type="button"
      >
        &#10094;
      </button>

      <div
        className="carrusel-slide-link cursor-pointer hero-slide"
        onClick={() => onSelectItem && onSelectItem(currentItem)}
      >
        <div className="hero-slide-bg-overlay"></div>
        <img
          src={currentItem.img}
          alt={currentItem.titulo}
          className="carrusel-slide-img hero-slide-img"
          onError={(e) => {
            e.target.src = 'https://placehold.co/1400x560/111827/FFFFFF?text=F%C3%9ATBOL+STORE+2026'
          }}
        />

        <div className="carrusel-slide-info hero-editorial-content">
          <div className="hero-badge">
            <span className="hero-tag-season">COLECCIÓN OFICIAL 2026</span>
            {currentItem.categoria && (
              <span className="hero-tag-category">{currentItem.categoria}</span>
            )}
          </div>

          <h2 className="hero-title has-text-white">
            {currentItem.titulo}
          </h2>

          <p className="hero-subtitle has-text-grey-lighter">
            {currentItem.descripcion || 'Indumentaria oficial con tecnología transpirable de alto rendimiento.'}
          </p>

          <div className="hero-price-action">
            <div className="hero-price-wrap">
              <span className="hero-price-label">PRECIO EXCLUSIVO</span>
              <span className="hero-price-value has-text-primary">
                ${Number(currentItem.precio).toLocaleString('es-CL')}
              </span>
            </div>

            <button
              type="button"
              className="button is-primary is-medium hero-cta-btn"
              onClick={(e) => {
                e.stopPropagation()
                if (onSelectItem) onSelectItem(currentItem)
              }}
            >
              COMPRAR AHORA &rarr;
            </button>
          </div>
        </div>
      </div>

      <button
        id="btn-der-banner"
        className="carousel-nav-btn next-btn button is-dark is-rounded"
        onClick={handleNext}
        aria-label="Siguiente"
        type="button"
      >
        &#10095;
      </button>

      {/* Indicadores inferiores (Dots) */}
      {items.length > 1 && (
        <div className="carousel-dots-container" role="tablist">
          {items.map((item, idx) => (
            <button
              key={item.id || idx}
              type="button"
              className={`carousel-dot ${idx === currentIndex ? 'is-active' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                setCurrentIndex(idx)
              }}
              aria-label={`Ir al slide ${idx + 1}`}
              role="tab"
              aria-selected={idx === currentIndex}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Carousel
