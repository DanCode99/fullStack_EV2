import { useContext } from 'react'
import { CartContext } from './cartContextInstance.js'

export function useCart() {
  const context = useContext(CartContext)
  return context || {}
}

export default useCart
