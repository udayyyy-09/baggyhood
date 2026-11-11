import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const CartContext = createContext(null)
const CART_STORAGE_KEY = 'baggyhood_cart_items'

export function CartProvider({ children }) {
  // Load initial cart from localStorage so items never disappear on page reload
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch (e) {
      console.warn('Could not load cart from localStorage:', e)
      return []
    }
  })
  const [isOpen, setIsOpen] = useState(false)

  // Sync to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch (e) {
      console.warn('Could not save cart to localStorage:', e)
    }
  }, [items])

  // ── Add item — if same product+size exists, increment qty ─────────────────
  const addItem = useCallback((product, size) => {
    setItems((prev) => {
      const existing = prev.findIndex(
        (i) => i.product.id === product.id && i.size === size
      )
      if (existing !== -1) {
        const next = [...prev]
        next[existing] = { ...next[existing], qty: next[existing].qty + 1 }
        return next
      }
      return [...prev, { product, size, qty: 1 }]
    })
    setIsOpen(true) // Open cart drawer when item added
  }, [])

  const removeItem = useCallback((productId, size) => {
    setItems((prev) => prev.filter(
      (i) => !(i.product.id === productId && i.size === size)
    ))
  }, [])

  const updateQty = useCallback((productId, size, qty) => {
    if (qty < 1) return removeItem(productId, size)
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId && i.size === size ? { ...i, qty } : i
      )
    )
  }, [removeItem])

  const clearCart = useCallback(() => {
    setItems([])
    try {
      localStorage.removeItem(CART_STORAGE_KEY)
    } catch (e) {}
  }, [])

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  // Derived values
  const totalItems = items.reduce((acc, i) => acc + i.qty, 0)
  const totalAmount = items.reduce((acc, i) => {
    const price = parseFloat(i.product.price.replace(/[^0-9.]/g, ''))
    return acc + price * i.qty
  }, 0)

  // Free shipping check: if any product in cart has free shipping, shipping is ₹0!
  const hasFreeShipping = items.length > 0 && items.some((i) => i.product.freeShipping)
  const shippingFee = items.length === 0 ? 0 : (hasFreeShipping ? 0 : 99)
  const grandTotal = totalAmount + shippingFee

  return (
    <CartContext.Provider value={{
      items,
      isOpen,
      totalItems,
      totalAmount,
      shippingFee,
      hasFreeShipping,
      grandTotal,
      addItem,
      removeItem,
      updateQty,
      clearCart,
      openCart,
      closeCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
