import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../../context/useCart.js'
import { resolveProductPricing } from '../../../context/cartHelpers.js'

export function CartDrawer({ catalogProducts = [], onNavigate }) {
  const {
    cart = [],
    isCartOpen,
    closeCart,
    incrementCart,
    decrementCart,
    removeFromCart,
    addToCart,
    cartTotal = 0,
    subtotal = 0,
    totalCartCount = 0,
    discountCode = '',
    discountPercent = 0,
    discountAmount = 0,
    couponFeedback = {},
    applyDiscountCode,
    removeDiscountCode,
    hasFreeShipping,
    remainingForFreeShipping = 0,
    freeShippingProgress = 0
  } = useCart()

  const navigate = useNavigate()
  const [couponInput, setCouponInput] = useState('')

  // Cerrar con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isCartOpen, closeCart])

  // Prevenir scroll en body cuando el drawer está abierto
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isCartOpen])

  // Camisetas sugeridas para "Completa tu equipación" (que no estén en el carrito)
  const suggestedProducts = useMemo(() => {
    if (!catalogProducts || catalogProducts.length === 0) return []
    const cartIds = new Set(cart.map(item => String(item.id)))
    return catalogProducts
      .filter(p => !cartIds.has(String(p.id)))
      .slice(0, 3)
  }, [catalogProducts, cart])

  const handleApplyCoupon = (e) => {
    e.preventDefault()
    if (couponInput.trim()) {
      applyDiscountCode(couponInput)
      setCouponInput('')
    }
  }

  const handleGoToCart = () => {
    closeCart()
    if (onNavigate) {
      onNavigate('carrito')
    } else {
      navigate('/carrito')
    }
  }

  const handleGoToCheckout = () => {
    closeCart()
    if (onNavigate) {
      onNavigate('checkout')
    } else {
      navigate('/checkout')
    }
  }

  if (!isCartOpen) return null

  return (
    <div className="cart-drawer-backdrop" onClick={closeCart} role="dialog" aria-modal="true" aria-label="Carrito de compras">
      <aside
        className="cart-drawer-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado del Drawer */}
        <div className="cart-drawer-header">
          <div className="cart-drawer-header-left">
            <span className="cart-drawer-title">Tu Carrito</span>
            <span className="cart-drawer-count-badge">({totalCartCount})</span>
          </div>
          <button
            type="button"
            className="cart-drawer-close-btn"
            onClick={closeCart}
            aria-label="Cerrar carrito"
            title="Cerrar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* 1. Barra superior de Envío Gratis (Estilo Nike) */}
        <div className={`cart-drawer-shipping-banner ${hasFreeShipping ? 'is-free' : ''}`}>
          <div className="shipping-banner-text">
            {hasFreeShipping ? (
              <span className="shipping-text-success">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                ¡Tienes Envío Gratis!
              </span>
            ) : (
              <span>
                ¡Te faltan <strong>${remainingForFreeShipping.toLocaleString('es-CL')}</strong> para Envío Gratis!
              </span>
            )}
          </div>
          <div className="shipping-progress-track">
            <div
              className="shipping-progress-bar"
              style={{ width: `${freeShippingProgress}%` }}
              role="progressbar"
              aria-valuenow={freeShippingProgress}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
        </div>

        {/* 2. Lista de ítems agregados (Cuerpo scrollable) */}
        <div className="cart-drawer-body">
          {cart.length === 0 ? (
            <div className="cart-drawer-empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <p className="cart-empty-title">Tu carrito está vacío</p>
              <p className="cart-empty-subtitle">Agrega tus camisetas favoritas para comenzar</p>
              <button
                type="button"
                className="cart-empty-btn"
                onClick={() => {
                  closeCart()
                  if (onNavigate) onNavigate('productos')
                  else navigate('/productos')
                }}
              >
                Explorar Catálogo
              </button>
            </div>
          ) : (
            <div className="cart-drawer-items-list">
              {cart.map((item, index) => {
                const hasDiscount = Boolean(item.descuento || (item.precioOriginal && item.precioOriginal > item.precio))
                const unitPrice = Number(item.precio || 0)
                const origPrice = Number(item.precioOriginal || unitPrice)

                return (
                  <div key={`${item.id}-${item.talla}-${index}`} className="cart-drawer-item">
                    <div className="cart-item-thumb-wrap">
                      <img
                        src={item.img || 'https://placehold.co/120x150/1e293b/FFFFFF?text=Camiseta'}
                        alt={item.titulo}
                        className="cart-item-thumb"
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/120x150/1e293b/FFFFFF?text=Camiseta'
                        }}
                      />
                    </div>

                    <div className="cart-item-details">
                      <div className="cart-item-row-top">
                        <h4 className="cart-item-title" title={item.titulo}>{item.titulo}</h4>
                        <button
                          type="button"
                          className="cart-item-remove-btn"
                          onClick={() => removeFromCart(index)}
                          aria-label={`Eliminar ${item.titulo}`}
                          title="Eliminar producto"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </div>

                      <div className="cart-item-meta">
                        <span className="cart-item-talla">Talla: <strong>{item.talla || 'M'}</strong></span>
                        {item.categoria && <span className="cart-item-cat">• {item.categoria}</span>}
                      </div>

                      <div className="cart-item-row-bottom">
                        {/* Control de Cantidad */}
                        <div className="cart-quantity-selector">
                          <button
                            type="button"
                            className="cart-qty-btn"
                            onClick={() => decrementCart(index)}
                            aria-label="Disminuir cantidad"
                          >
                            -
                          </button>
                          <span className="cart-qty-value">{item.cantidad}</span>
                          <button
                            type="button"
                            className="cart-qty-btn"
                            onClick={() => incrementCart(index)}
                            aria-label="Aumentar cantidad"
                          >
                            +
                          </button>
                        </div>

                        {/* Precio con Descuento Tachado */}
                        <div className="cart-item-pricing">
                          {hasDiscount ? (
                            <>
                              <span className="cart-price-original">
                                ${origPrice.toLocaleString('es-CL')}
                              </span>
                              <span className="cart-price-current has-discount">
                                ${unitPrice.toLocaleString('es-CL')}
                              </span>
                            </>
                          ) : (
                            <span className="cart-price-current">
                              ${unitPrice.toLocaleString('es-CL')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* 3. Sección "Completa tu equipación" (Mini Carrusel Horizontal) */}
          {suggestedProducts.length > 0 && (
            <div className="cart-drawer-equipment-section">
              <div className="equipment-header">
                <span className="equipment-title">Completa tu equipación</span>
                <span className="equipment-subtitle">Recomendado para ti</span>
              </div>
              <div className="equipment-carousel">
                {suggestedProducts.map((prod) => {
                  const pricing = resolveProductPricing(prod)
                  return (
                    <div key={prod.id} className="equipment-card">
                      <div className="equipment-card-thumb-wrap">
                        <img
                          src={prod.img || 'https://placehold.co/100x120/1e293b/FFFFFF?text=Camiseta'}
                          alt={prod.titulo}
                          className="equipment-card-thumb"
                          onError={(e) => {
                            e.target.src = 'https://placehold.co/100x120/1e293b/FFFFFF?text=Camiseta'
                          }}
                        />
                      </div>
                      <div className="equipment-card-info">
                        <p className="equipment-card-title" title={prod.titulo}>{prod.titulo}</p>
                        <div className="equipment-card-price-row">
                          <span className="equipment-card-price">
                            ${pricing.precioFinal.toLocaleString('es-CL')}
                          </span>
                          <button
                            type="button"
                            className="equipment-add-btn"
                            onClick={() => addToCart(prod, 1)}
                            title="Agregar rápidamente"
                            aria-label={`Agregar ${prod.titulo} al carrito`}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="12" y1="5" x2="12" y2="19"></line>
                              <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            <span>Agregar</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* 4. Pie fijo inferior */}
        <div className="cart-drawer-footer">
          {/* Input de Código de Descuento */}
          <form className="cart-coupon-form" onSubmit={handleApplyCoupon}>
            <div className="cart-coupon-input-wrap">
              <input
                type="text"
                className="cart-coupon-input"
                placeholder="Código de descuento (ej. FUTBOL10)"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
              />
              <button type="submit" className="cart-coupon-btn">
                Aplicar
              </button>
            </div>
            {couponFeedback.message && (
              <p className={`cart-coupon-feedback is-${couponFeedback.type}`}>
                {couponFeedback.message}
                {discountCode && (
                  <button
                    type="button"
                    className="cart-coupon-remove"
                    onClick={removeDiscountCode}
                    title="Quitar cupón"
                  >
                    (quitar)
                  </button>
                )}
              </p>
            )}
          </form>

          {/* Desglose de Totales */}
          <div className="cart-drawer-summary">
            {discountPercent > 0 && (
              <>
                <div className="summary-row">
                  <span className="summary-label">Subtotal</span>
                  <span className="summary-val">${subtotal.toLocaleString('es-CL')}</span>
                </div>
                <div className="summary-row is-discount">
                  <span className="summary-label">Descuento ({discountPercent}%)</span>
                  <span className="summary-val">-${discountAmount.toLocaleString('es-CL')}</span>
                </div>
              </>
            )}
            <div className="summary-row is-total">
              <span className="summary-label">Total</span>
              <span className="summary-val total-amount">${cartTotal.toLocaleString('es-CL')} CLP</span>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="cart-drawer-actions">
            <button
              type="button"
              className="cart-btn-view-cart"
              onClick={handleGoToCart}
              disabled={cart.length === 0}
            >
              Ver Carrito
            </button>
            <button
              type="button"
              className="cart-btn-checkout"
              onClick={handleGoToCheckout}
              disabled={cart.length === 0}
            >
              Comprar
            </button>
          </div>
        </div>
      </aside>
    </div>
  )
}

export default CartDrawer
