import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Chandigarh', 'Puducherry',
]

/**
 * CheckoutPanel — shown inside CartDrawer when phase === 'checkout'
 * Handles: address form → Razorpay payment → verification → success callback
 */
export default function CheckoutPanel({ items, totalAmount, onSuccess, onBack }) {
  const { user } = useAuth()
  const { shippingFee, hasFreeShipping, grandTotal } = useCart()

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [paymentError, setPaymentError] = useState('')

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Full name is required'
    if (!/^\d{10}$/.test(form.phone.trim())) e.phone = 'Enter a valid 10-digit phone number'
    if (!form.addressLine1.trim()) e.addressLine1 = 'Address is required'
    if (!form.city.trim()) e.city = 'City is required'
    if (!form.state) e.state = 'Select a state'
    if (!/^\d{6}$/.test(form.pincode.trim())) e.pincode = 'Enter a valid 6-digit pincode'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handlePayNow() {
    if (!validate()) return
    setLoading(true)
    setPaymentError('')

    try {
      // Step 1: Create Razorpay order on backend
      const createRes = await fetch(`${API_BASE}/api/orders/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          items: items.map(({ product, size, qty }) => ({
            productId: product.id,
            name: product.name,
            size,
            qty,
            price: parseFloat(product.price.replace(/[^0-9.]/g, '')),
          })),
          shippingAddress: form,
          totalAmount: grandTotal,
        }),
      })

      if (!createRes.ok) {
        if (createRes.status === 401) {
          throw new Error('Please sign in with Google to proceed with checkout.')
        }
        let errMessage = 'Failed to create order'
        try {
          const err = await createRes.json()
          errMessage = err.error || errMessage
        } catch {
          const raw = await createRes.text().catch(() => '')
          errMessage = raw ? `Server error: ${raw.slice(0, 150)}` : `Request failed (${createRes.status})`
        }
        throw new Error(errMessage)
      }

      const { razorpayOrderId, amount, currency, keyId } = await createRes.json()

      // Step 2: Open Razorpay checkout
      await openRazorpay({ razorpayOrderId, amount, currency, keyId })
    } catch (err) {
      setPaymentError(err.message || 'Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function openRazorpay({ razorpayOrderId, amount, currency, keyId }) {
    return new Promise((resolve, reject) => {
      if (!window.Razorpay) {
        return reject(new Error('Razorpay SDK not loaded. Please refresh the page.'))
      }

      const options = {
        key: keyId,
        amount,
        currency,
        name: 'baggyHood',
        description: `Drop #01 — UPI QR Payment`,
        order_id: razorpayOrderId,
        prefill: {
          name: form.name,
          contact: `+91${form.phone}`,
          email: user?.email || '',
        },
        theme: { color: '#a9ad87' },
        config: {
          display: {
            blocks: {
              qr: {
                name: 'Scan & Pay with UPI QR',
                instruments: [
                  {
                    method: 'upi',
                    flows: ['qr'],
                  },
                ],
              },
            },
            sequence: ['block.qr'],
            preferences: {
              show_default_blocks: false,
            },
          },
        },
        modal: {
          ondismiss: () => reject(new Error('Payment cancelled')),
        },
        handler: async (response) => {
          try {
            // Step 3: Verify signature on backend
            const verifyRes = await fetch(`${API_BASE}/api/orders/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            })

            if (!verifyRes.ok) {
              const err = await verifyRes.json()
              throw new Error(err.error || 'Payment verification failed')
            }

            const data = await verifyRes.json()
            resolve(data)
            onSuccess(data) // Trigger success phase in CartDrawer
          } catch (err) {
            reject(err)
            setPaymentError(err.message)
          }
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', (response) => {
        reject(new Error(response.error?.description || 'Payment failed'))
        setPaymentError(response.error?.description || 'Payment failed')
      })
      rzp.open()
    })
  }

  const inputClass = (field) =>
    `w-full rounded-xl border px-4 py-3 text-sm text-white bg-white/5 placeholder-white/30 outline-none transition focus:ring-1 ${
      errors[field]
        ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/30'
        : 'border-white/10 focus:border-[#a9ad87]/60 focus:ring-[#a9ad87]/20'
    }`

  return (
    <div className="px-6 py-5 space-y-6">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition"
      >
        ← Back to cart
      </button>

      {/* Order summary */}
      <div className="rounded-xl border border-white/10 bg-white/[.03] p-4 space-y-2">
        <p className="text-[10px] uppercase tracking-wider text-white/40 mb-3">Order Summary</p>
        {items.map(({ product, size, qty }) => {
          const price = parseFloat(product.price.replace(/[^0-9.]/g, ''))
          return (
            <div key={`${product.id}-${size}`} className="flex justify-between text-xs">
              <span className="text-white/70 truncate max-w-[200px]">
                {product.name} ({product.category === 'denim' ? `W${size}` : size}) ×{qty}
              </span>
              <span className="font-semibold text-white shrink-0 ml-2">₹{(price * qty).toLocaleString('en-IN')}</span>
            </div>
          )
        })}
        <div className="border-t border-white/10 mt-3 pt-3 space-y-1">
          <div className="flex justify-between text-xs text-white/50">
            <span>Subtotal</span><span>₹{totalAmount.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-xs text-white/50">
            <span>Shipping</span>
            {hasFreeShipping || shippingFee === 0 ? (
              <span className="font-bold text-[#a9ad87] flex items-center gap-1">
                FREE <span className="line-through text-white/30 text-[10px]">₹99</span>
              </span>
            ) : (
              <span>₹{shippingFee}</span>
            )}
          </div>
          <div className="flex justify-between text-sm font-black text-white pt-1">
            <span>Total</span><span>₹{grandTotal.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="space-y-3">
        <p className="text-[10px] uppercase tracking-wider text-white/40">Shipping Address</p>

        {/* Name */}
        <div>
          <input
            type="text"
            placeholder="Full name"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            className={inputClass('name')}
          />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
        </div>

        {/* Phone */}
        <div>
          <div className="flex gap-2">
            <span className="flex items-center rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white/50">+91</span>
            <input
              type="tel"
              placeholder="10-digit mobile number"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
              className={`flex-1 ${inputClass('phone')}`}
            />
          </div>
          {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
        </div>

        {/* Address Line 1 */}
        <div>
          <input
            type="text"
            placeholder="Address line 1 (House no., Street)"
            value={form.addressLine1}
            onChange={(e) => set('addressLine1', e.target.value)}
            className={inputClass('addressLine1')}
          />
          {errors.addressLine1 && <p className="mt-1 text-xs text-red-400">{errors.addressLine1}</p>}
        </div>

        {/* Address Line 2 */}
        <input
          type="text"
          placeholder="Address line 2 (Area, Landmark — optional)"
          value={form.addressLine2}
          onChange={(e) => set('addressLine2', e.target.value)}
          className={inputClass('addressLine2')}
        />

        {/* City + Pincode */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <input
              type="text"
              placeholder="City"
              value={form.city}
              onChange={(e) => set('city', e.target.value)}
              className={inputClass('city')}
            />
            {errors.city && <p className="mt-1 text-xs text-red-400">{errors.city}</p>}
          </div>
          <div>
            <input
              type="text"
              placeholder="Pincode"
              value={form.pincode}
              onChange={(e) => set('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
              className={inputClass('pincode')}
            />
            {errors.pincode && <p className="mt-1 text-xs text-red-400">{errors.pincode}</p>}
          </div>
        </div>

        {/* State */}
        <div>
          <select
            value={form.state}
            onChange={(e) => set('state', e.target.value)}
            className={`${inputClass('state')} cursor-pointer`}
          >
            <option value="" disabled>Select state</option>
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s} className="bg-[#111] text-white">{s}</option>
            ))}
          </select>
          {errors.state && <p className="mt-1 text-xs text-red-400">{errors.state}</p>}
        </div>
      </div>

      {/* Payment error */}
      {paymentError && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-400">
          ⚠️ {paymentError}
        </div>
      )}

      {/* Pay button */}
      <button
        onClick={handlePayNow}
        disabled={loading}
        className="w-full rounded-full bg-[#a9ad87] py-4 text-sm font-black text-ink transition hover:bg-[#b9bd98] active:scale-[.98] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            Generating QR…
          </span>
        ) : (
          `Pay ₹${grandTotal.toLocaleString('en-IN')} via UPI QR`
        )}
      </button>

      <p className="text-center text-[10px] text-white/30 leading-relaxed pb-4">
        🔒 Scan & Pay instantly with any UPI app (GPay, PhonePe, Paytm, BHIM)
      </p>
    </div>
  )
}

