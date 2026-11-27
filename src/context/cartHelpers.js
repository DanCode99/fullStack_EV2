export const CART_STORAGE_KEY = 'carritoFutbol'
export const DISCOUNT_STORAGE_KEY = 'carritoDescuento'
export const FREE_SHIPPING_THRESHOLD = 60000

// Descuentos unificados reconocidos por el sistema
export const KNOWN_DISCOUNTS = {
  'Camiseta Universidad de Chile Local': { percent: 20, salePrice: 35992, originalPrice: 44990 },
  'Camiseta Colo-Colo Local 2026': { percent: 25, salePrice: 37493, originalPrice: 49990 }
}

export function enrichProductWithDiscounts(product) {
  if (!product) return product
  const title = (product.titulo || '').trim()
  const titleLower = title.toLowerCase()
  const isColoColo = titleLower.includes('colo-colo') || titleLower.includes('colocolo')
  const isUChile = titleLower.includes('universidad de chile') || titleLower.includes('u de chile')

  let brand = product.nombreMarca || product.marca
  // Colo-Colo se reasigna a Adidas para coincidir con la camiseta oficial en BD
  if (isColoColo || brand === 'Puma') {
    brand = 'Adidas'
  }

  if (isUChile) {
    const basePrice = Number(product.precioOriginal || (product.precio > 40000 ? product.precio : 44990))
    return {
      ...product,
      nombreMarca: 'Adidas',
      marca: 'Adidas',
      descuento: 20,
      precioOriginal: basePrice,
      precioFinal: 35992,
      precio: 35992
    }
  }

  if (isColoColo) {
    const basePrice = Number(product.precioOriginal || (product.precio > 40000 ? product.precio : 49990))
    return {
      ...product,
      nombreMarca: 'Adidas',
      marca: 'Adidas',
      descuento: 25,
      precioOriginal: basePrice,
      precioFinal: 37493,
      precio: 37493
    }
  }

  if (product.descuento && Number(product.descuento) > 0) {
    const d = Number(product.descuento)
    const basePrice = Number(product.precioOriginal || product.precio)
    const finalPrice = product.precioFinal ? Number(product.precioFinal) : Math.round(basePrice * (1 - d / 100))
    return {
      ...product,
      nombreMarca: brand,
      marca: brand,
      descuento: d,
      precioOriginal: basePrice,
      precioFinal: finalPrice,
      precio: finalPrice
    }
  }

  return {
    ...product,
    nombreMarca: brand,
    marca: brand
  }
}

export function resolveProductPricing(product) {
  if (!product) return { precioOriginal: 0, precioFinal: 0, descuento: 0 }
  const enriched = enrichProductWithDiscounts(product)
  return {
    precioOriginal: enriched.precioOriginal || enriched.precio,
    precioFinal: enriched.precioFinal || enriched.precio,
    descuento: enriched.descuento || 0
  }
}
