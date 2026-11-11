import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import CheckoutPanel from './CheckoutPanel.jsx'

const DENIM_SIZES = ['28', '30', '32', '34', '36']
const APPAREL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

function getSizes(product) {
  return product.category === 'denim' ? DENIM_SIZES : APPAREL_SIZES
}

/**
 * CartDrawer — slides in from the right.
 * Phases: 'cart' → 'checkout' → 'success'
 */
export default function CartDrawer() {
  const { isLoggedIn, login } = useAuth()
  const { items, isOpen, closeCart, removeItem, updateQty, totalAmount, totalItems, clearCart, hasFreeShipping } = useCart()
  const [phase, setPhase] = useState('cart') // 'cart' | 'checkout' | 'success'
  const [lastOrder, setLastOrder] = useState(null)

  if (!isOpen) return null

  // ── "Continue" button handler ─────────────────────────────────────────────
  function handleContinue() {
    if (isLoggedIn) {
      setPhase('checkout')
    } else {
      // Trigger Google login; after success, auto-proceed to checkout
      login(() => setPhase('checkout'))
    }
  }

  function handleOrderSuccess(order) {
    clearCart()
    setLastOrder(order)
    setPhase('success')
  }

  function handleClose() {
    closeCart()
    // Reset phase after drawer closes so next open starts fresh
    setTimeout(() => setPhase('cart'), 300)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Drawer panel */}
      <div className="fixed inset-y-0 right-0 z-[1000] flex w-full max-w-md flex-col bg-[#0d0d0d] border-l border-white/10 shadow-2xl">

        {/* ── Header ── */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          {phase === 'cart' && (
            <>
              <div>
                <p className="text-[10px] uppercase tracking-[.3em] text-white/40">baggyHood</p>
                <h2 className="text-lg font-bold text-white">
                  Your Cart
                  {totalItems > 0 && (
                    <span className="ml-2 rounded-full bg-[#a9ad87] px-2 py-0.5 text-xs font-black text-ink">{totalItems}</span>
                  )}
                </h2>
              </div>
            </>
          )}
          {phase === 'checkout' && (
            <div>
              <p className="text-[10px] uppercase tracking-[.3em] text-white/40">baggyHood</p>
              <h2 className="text-lg font-bold text-white">Checkout</h2>
            </div>
          )}
          {phase === 'success' && (
            <div>
              <p className="text-[10px] uppercase tracking-[.3em] text-[#a9ad87]">Order Confirmed</p>
              <h2 className="text-lg font-bold text-white">You're all set 🎉</h2>
            </div>
          )}
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/50 transition hover:border-white/40 hover:text-white"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto">

          {/* PHASE: Cart */}
          {phase === 'cart' && (
            <>
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 py-20 text-center px-8">
                  <div className="text-5xl">🛍️</div>
                  <p className="text-white/50 text-sm">Your cart is empty.</p>
                  <p className="text-white/30 text-xs">Add something from the collection below.</p>
                  <button
                    onClick={handleClose}
                    className="mt-4 rounded-full border border-white/20 px-5 py-2 text-xs font-semibold text-white/70 transition hover:border-white/50 hover:text-white"
                  >
                    Browse Collection
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-white/[0.07] px-6">
                  {items.map(({ product, size, qty }) => {
                    const price = parseFloat(product.price.replace(/[^0-9.]/g, ''))
                    return (
                      <div key={`${product.id}-${size}`} className="flex gap-4 py-5">
                        {/* Product image */}
                        <div className="h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-white/5">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover object-top"
                          />
                        </div>
                        {/* Info */}
                        <div className="flex flex-1 flex-col gap-1 min-w-0">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#a9ad87]">{product.categoryLabel}</p>
                          <p className="text-sm font-bold text-white leading-snug truncate">{product.name}</p>
                          <p className="text-xs text-white/40">
                            {product.category === 'denim' ? `Waist ${size}″` : `Size ${size}`}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            {/* Qty stepper */}
                            <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-2 py-1">
                              <button
                                onClick={() => updateQty(product.id, size, qty - 1)}
                                className="h-5 w-5 flex items-center justify-center rounded-full text-white/60 hover:text-white transition text-sm font-bold"
                              >−</button>
                              <span className="w-4 text-center text-xs font-bold text-white">{qty}</span>
                              <button
                                onClick={() => updateQty(product.id, size, qty + 1)}
                                className="h-5 w-5 flex items-center justify-center rounded-full text-white/60 hover:text-white transition text-sm font-bold"
                              >+</button>
                            </div>
                            <p className="text-sm font-black text-[#d8dcbe]">₹{(price * qty).toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                        {/* Remove */}
                        <button
                          onClick={() => removeItem(product.id, size)}
                          className="self-start mt-1 text-white/20 transition hover:text-red-400 text-xs"
                          aria-label="Remove item"
                        >✕</button>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}

          {/* PHASE: Checkout */}
          {phase === 'checkout' && (
            <CheckoutPanel
              items={items}
              totalAmount={totalAmount}
              onSuccess={handleOrderSuccess}
              onBack={() => setPhase('cart')}
            />
          )}

          {/* PHASE: Success */}
          {phase === 'success' && (
            <div className="flex flex-col items-center justify-center h-full gap-6 px-8 py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#a9ad87] text-ink shadow-lg shadow-[#a9ad87]/30 text-2xl">✓</div>
              <div>
                <h3 className="text-xl font-bold text-white">Order placed!</h3>
                <p className="mt-2 text-sm text-white/60 leading-relaxed">
                  Your order <strong className="text-[#a9ad87]">{lastOrder?.orderId}</strong> has been confirmed. We'll WhatsApp you with shipping updates.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="mt-2 rounded-full bg-[#a9ad87] px-6 py-3 text-sm font-bold text-ink transition hover:bg-[#b9bd98]"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>

        {/* ── Footer — Cart phase only ── */}
        {phase === 'cart' && items.length > 0 && (
          <div className="border-t border-white/10 px-6 py-5 space-y-4">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
              <span className="text-base font-black text-white">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
            {hasFreeShipping ? (
              <p className="text-xs text-[#a9ad87] font-semibold flex items-center gap-1.5">
                <span>✦</span> Free Express Delivery unlocked for your bag!
              </p>
            ) : (
              <p className="text-xs text-white/30">Shipping calculated at checkout</p>
            )}
            {/* Continue button */}
            <button
              onClick={handleContinue}
              className="w-full rounded-full bg-[#a9ad87] py-3.5 text-sm font-bold text-ink transition hover:bg-[#b9bd98] active:scale-[.98]"
            >
              {isLoggedIn ? 'Continue to Checkout →' : 'Sign in & Continue →'}
            </button>
          </div>
        )}
      </div>
    </>
  )
}

