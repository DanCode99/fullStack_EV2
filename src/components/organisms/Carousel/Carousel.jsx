import { useState } from 'react'

export function Carousel({ items = [], onSelectItem }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!items || items.length === 0) return null

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1))
  }

  const currentItem = items[currentIndex]

  return (
    <div id="caja-banner" className="mb-6">
      <button
        id="btn-izq-banner"
        className="button is-dark is-rounded"
        onClick={handlePrev}
        aria-label="Anterior"
      >
        &#10094;
      </button>

      <div
        className="carrusel-slide-link"
        onClick={() => onSelectItem && onSelectItem(currentItem)}
        style={{ cursor: 'pointer' }}
      >
        <img
          src={currentItem.img}
          alt={currentItem.titulo}
          className="carrusel-slide-img"
          onError={(e) => {
            e.target.src = 'https://placehold.co/1200x400?text=Fútbol+Store'
          }}
        />
        <div className="carrusel-slide-info">
          <h2 className="has-text-white is-size-4 has-text-weight-bold">
            {currentItem.titulo}
          </h2>
          <p className="has-text-primary is-size-5 has-text-weight-semibold">
            ${Number(currentItem.precio).toLocaleString('es-CL')}
          </p>
        </div>
      </div>

      <button
        id="btn-der-banner"
        className="button is-dark is-rounded"
        onClick={handleNext}
        aria-label="Siguiente"
      >
        &#10095;
      </button>
    </div>
  )
}
