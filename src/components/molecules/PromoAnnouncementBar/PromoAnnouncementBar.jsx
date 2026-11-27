import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const promoAnnouncements = [
  {
    text: 'COLECCIÓN MUNDIAL 2026 | Envío gratis en compras sobre $60.000 + 6 Cuotas sin interés.',
    linkText: 'Ir a colección',
    linkUrl: '/productos'
  },
  {
    text: '¡Equípate para la cancha! Camisetas oficiales de selecciones y clubes chilenos.',
    linkText: 'Ver catálogo',
    linkUrl: '/productos'
  },
  {
    text: '15% OFF para nuevos miembros registrándote en nuestra tienda oficial.',
    linkText: 'Registrarse',
    linkUrl: '/registro'
  }
]

export function PromoAnnouncementBar({ onNavigate }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const timerRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev === promoAnnouncements.length - 1 ? 0 : prev + 1))
    }, 4000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const handlePrev = (e) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === 0 ? promoAnnouncements.length - 1 : prev - 1))
  }

  const handleNext = (e) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === promoAnnouncements.length - 1 ? 0 : prev + 1))
  }

  const currentPromo = promoAnnouncements[currentIndex]

  const handleLinkClick = (e, url) => {
    e.preventDefault()
    if (onNavigate) {
      onNavigate(url.replace(/^\//, ''))
    } else {
      navigate(url)
    }
  }

  return (
    <div className="promo-ticker-bar" role="region" aria-label="Anuncios y Promociones">
      <div className="container promo-ticker-container">
        <button
          type="button"
          className="promo-ticker-arrow prev"
          onClick={handlePrev}
          aria-label="Anuncio anterior"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="promo-ticker-content" key={currentIndex}>
          <span className="promo-ticker-text">{currentPromo.text}</span>
          <a
            href={currentPromo.linkUrl}
            className="promo-ticker-action-link"
            onClick={(e) => handleLinkClick(e, currentPromo.linkUrl)}
          >
            {currentPromo.linkText}
          </a>
        </div>

        <button
          type="button"
          className="promo-ticker-arrow next"
          onClick={handleNext}
          aria-label="Siguiente anuncio"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default PromoAnnouncementBar
