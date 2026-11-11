import { useState } from 'react'
import { useCart } from '../context/CartContext.jsx'

const DENIM_SIZES = ['28', '30', '32', '34', '36']
const APPAREL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

/**
 * AddToCartModal — size picker popup that appears when user clicks "Add to Cart"
 * on a product card.
 *
 * Props:
 *   product  — the product object
 *   onClose  — dismiss callback
 */
export default function AddToCartModal({ product, onClose }) {
  const { addItem } = useCart()
  const [selectedSize, setSelectedSize] = useState(null)
  const [added, setAdded] = useState(false)

  if (!product) return null

  const sizes = product.category === 'denim' ? DENIM_SIZES : APPAREL_SIZES
  const isDenim = product.category === 'denim'

  function handleAdd() {
    if (!selectedSize) return
    addItem(product, selectedSize)
    setAdded(true)
    setTimeout(onClose, 800) // Brief success flash then close
  }

  return (
    <div className="fixed inset-0 z-[9998] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div className="relative z-10 w-full max-w-sm mx-0 sm:mx-4 bg-[#0d0d0d] border border-white/10 rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/30 hover:text-white/70 transition text-lg leading-none"
        >✕</button>

        {/* Product info */}
        <div className="flex gap-4 mb-5">
          <div className="h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-white/5">
            <img src={product.image} alt={product.name} className="h-full w-full object-cover object-top" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#a9ad87]">{product.categoryLabel}</p>
            <p className="text-sm font-bold text-white leading-snug line-clamp-2">{product.name}</p>
            <p className="mt-1 text-sm font-black text-[#d8dcbe]">{product.price}</p>
          </div>
        </div>

        {/* Size label */}
        <p className="text-[10px] uppercase tracking-widest text-white/40 mb-3">
          {isDenim ? 'Select Waist Size' : 'Select Size'}
        </p>

        {/* Size grid */}
        <div className="grid grid-cols-5 gap-2 mb-5">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`rounded-xl border py-2.5 text-xs font-bold transition ${
                selectedSize === size
                  ? 'border-[#a9ad87] bg-[#a9ad87] text-ink'
                  : 'border-white/15 bg-white/5 text-white/70 hover:border-white/40 hover:text-white'
              }`}
            >
              {isDenim ? `${size}″` : size}
            </button>
          ))}
        </div>

        {/* Size note for denim */}
        {isDenim && (
          <p className="text-[10px] text-white/30 mb-4 -mt-2">
            Waist sizes 28–36. Jeans length: {product.jeansLength || '42″'} (deep sneaker stack)
          </p>
        )}

        {/* Add button */}
        <button
          onClick={handleAdd}
          disabled={!selectedSize || added}
          className={`w-full rounded-full py-3.5 text-sm font-black transition active:scale-[.98] ${
            added
              ? 'bg-green-500/20 border border-green-500/40 text-green-400 cursor-default'
              : selectedSize
              ? 'bg-[#a9ad87] text-ink hover:bg-[#b9bd98]'
              : 'bg-white/10 text-white/30 cursor-not-allowed'
          }`}
        >
          {added ? '✓ Added to Cart' : selectedSize ? `Add to Cart — ${product.price}` : 'Select a size'}
        </button>
      </div>
    </div>
  )
}

