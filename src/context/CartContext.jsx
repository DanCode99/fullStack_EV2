import { useState, useMemo, useCallback } from 'react'
import { CartContext } from './cartContextInstance.js'
import {
  CART_STORAGE_KEY,
  DISCOUNT_STORAGE_KEY,
  FREE_SHIPPING_THRESHOLD,
  resolveProductPricing
} from './cartHelpers.js'

export function CartProvider({ children, catalogProducts = [] }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [isCartOpen, setIsCartOpen] = useState(false)
  const [discountCode, setDiscountCode] = useState(() => {
    try {
      return localStorage.getItem(DISCOUNT_STORAGE_KEY) || ''
    } catch {
      return ''
    }
  })
  const [discountPercent, setDiscountPercent] = useState(() => {
    const saved = localStorage.getItem(DISCOUNT_STORAGE_KEY)
    if (saved) {
      const code = saved.trim().toUpperCase()
      if (code === 'FUTBOL10' || code === 'DESCUENTO10') return 10
      if (code === 'FUTBOL20' || code === 'PROMO20') return 20
      if (code === 'NIKE2026' || code === 'ADIDAS2026') return 15
    }
    return 0
  })
  const [couponFeedback, setCouponFeedback] = useState({ type: '', message: '' })

  const updateCart = useCallback((newCart) => {
    setCart(newCart)
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart))
    } catch (e) {
      console.warn('Error saving cart to localStorage:', e)
    }
  }, [])

  const openCart = useCallback(() => setIsCartOpen(true), [])
  const closeCart = useCallback(() => setIsCartOpen(false), [])
  const toggleCart = useCallback(() => setIsCartOpen(prev => !prev), [])

  const addToCart = useCallback((product, quantity = 1) => {
    if (!product) return

    const { precioOriginal, precioFinal, descuento } = resolveProductPricing(product)
    const selectedTalla = product.talla || 'M'

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(
        item => item.id === product.id && item.talla === selectedTalla
      )

      let updated
      if (existingIndex > -1) {
        updated = [...prevCart]
        updated[existingIndex] = {
          ...updated[existingIndex],
          cantidad: updated[existingIndex].cantidad + quantity
        }
      } else {
        const newItem = {
          id: product.id,
          titulo: product.titulo,
          precio: precioFinal,
          precioOriginal: descuento > 0 ? precioOriginal : null,
          descuento: descuento > 0 ? descuento : null,
          img: product.img || product.urlImagen || '',
          talla: selectedTalla,
          cantidad: quantity,
          categoria: product.categoria || '',
          nombreMarca: product.nombreMarca || product.marca || ''
        }
        updated = [...prevCart, newItem]
      }

      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated))
      } catch (e) {
        console.warn('Error saving cart:', e)
      }
      return updated
    })

    setIsCartOpen(true)
  }, [])

  const incrementCart = useCallback((index) => {
    setCart(prevCart => {
      const updated = [...prevCart]
      if (updated[index]) {
        updated[index] = { ...updated[index], cantidad: updated[index].cantidad + 1 }
        updateCart(updated)
      }
      return updated
    })
  }, [updateCart])

  const decrementCart = useCallback((index) => {
    setCart(prevCart => {
      const updated = [...prevCart]
      if (updated[index]) {
        if (updated[index].cantidad > 1) {
          updated[index] = { ...updated[index], cantidad: updated[index].cantidad - 1 }
          updateCart(updated)
          return updated
        } else {
          const filtered = prevCart.filter((_, i) => i !== index)
          updateCart(filtered)
          return filtered
        }
      }
      return prevCart
    })
  }, [updateCart])

  const removeFromCart = useCallback((index) => {
    setCart(prevCart => {
      const updated = prevCart.filter((_, i) => i !== index)
      updateCart(updated)
      return updated
    })
  }, [updateCart])

  const clearCart = useCallback(() => {
    updateCart([])
  }, [updateCart])

  const applyDiscountCode = useCallback((codeRaw) => {
    const code = (codeRaw || '').trim().toUpperCase()
    if (!code) {
      setCouponFeedback({ type: 'error', message: 'Ingresa un código de descuento' })
      return false
    }

    let percent = 0
    if (code === 'FUTBOL10' || code === 'DESCUENTO10' || code === 'CHILE10') {
      percent = 10
    } else if (code === 'FUTBOL20' || code === 'PROMO20' || code === 'COPA20') {
      percent = 20
    } else if (code === 'NIKE2026' || code === 'ADIDAS2026' || code === 'RETAIL15') {
      percent = 15
    } else if (code === 'ENVIOGRATIS') {
      percent = 5
    }

    if (percent > 0) {
      setDiscountCode(code)
      setDiscountPercent(percent)
      localStorage.setItem(DISCOUNT_STORAGE_KEY, code)
      setCouponFeedback({
        type: 'success',
        message: `¡Cupón ${code} aplicado! ${percent}% de descuento adicional.`
      })
      return true
    } else {
      setCouponFeedback({
        type: 'error',
        message: 'Código de descuento inválido o expirado'
      })
      return false
    }
  }, [])

  const removeDiscountCode = useCallback(() => {
    setDiscountCode('')
    setDiscountPercent(0)
    setCouponFeedback({ type: '', message: '' })
    localStorage.removeItem(DISCOUNT_STORAGE_KEY)
  }, [])

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + (Number(item.precio || 0) * Number(item.cantidad || 1)), 0)
  }, [cart])

  const totalCartCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + Number(item.cantidad || 0), 0)
  }, [cart])

  const discountAmount = useMemo(() => {
    if (discountPercent > 0 && subtotal > 0) {
      return Math.round(subtotal * (discountPercent / 100))
    }
    return 0
  }, [subtotal, discountPercent])

  const cartTotal = useMemo(() => {
    return Math.max(0, subtotal - discountAmount)
  }, [subtotal, discountAmount])

  const hasFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100))

  const value = {
    cart,
    isCartOpen,
    openCart,
    closeCart,
    toggleCart,
    addToCart,
    incrementCart,
    decrementCart,
    removeFromCart,
    clearCart,
    updateCart,
    discountCode,
    discountPercent,
    discountAmount,
    couponFeedback,
    applyDiscountCode,
    removeDiscountCode,
    subtotal,
    cartTotal,
    totalCartCount,
    hasFreeShipping,
    remainingForFreeShipping,
    freeShippingProgress,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    catalogProducts
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export default CartProvider
