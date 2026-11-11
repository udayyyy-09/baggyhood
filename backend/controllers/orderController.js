import Razorpay from 'razorpay'
import crypto from 'crypto'
import { createOrder, updateOrder, findOrderByRazorpayId, getOrdersByUser, getAllOrders } from '../services/orderService.js'

// Lazily initialise Razorpay so missing keys don't crash server startup
function getRazorpay() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay keys not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env')
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  })
}

/**
 * POST /api/orders/create
 * Creates a Razorpay order and persists a pending order record.
 * Body: { items, shippingAddress, totalAmount }
 * Requires: requireAuth middleware
 */
export async function createRazorpayOrder(req, res) {
  try {
    const { items, shippingAddress, totalAmount } = req.body

    // Basic validation
    if (!items?.length || !shippingAddress || !totalAmount) {
      return res.status(400).json({ error: 'items, shippingAddress and totalAmount are required' })
    }

    if (totalAmount < 1) {
      return res.status(400).json({ error: 'Invalid total amount' })
    }

    const razorpay = getRazorpay()

    // Create Razorpay order (amount is in paise — multiply ₹ by 100)
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100), // paise
      currency: 'INR',
      receipt: `bh_${Date.now()}`,
      notes: {
        customerName: req.user.name,
        customerEmail: req.user.email,
      },
    })

    // Persist order to database and disk before payment (so we never lose orders)
    const order = await createOrder({
      userId: req.user.userId,
      userEmail: req.user.email,
      userName: req.user.name,
      razorpayOrderId: razorpayOrder.id,
      items,
      shippingAddress,
      totalAmount,
      currency: 'INR',
    })

    res.json({
      orderId: order.id,            // our internal order ID
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount, // in paise
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    })
  } catch (err) {
    console.error('[Orders] Create order error:', err)
    const errorMsg =
      err?.error?.description ||
      err?.message ||
      (err?.statusCode === 401 ? 'Razorpay authentication failed. Please check your RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend/.env' : 'Failed to create order')
    res.status(err.statusCode || 500).json({ error: errorMsg })
  }
}

/**
 * POST /api/orders/verify
 * Verifies Razorpay payment signature and marks order as paid.
 * Body: { razorpayOrderId, razorpayPaymentId, razorpaySignature }
 * Requires: requireAuth middleware
 */
export async function verifyPayment(req, res) {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ error: 'Missing payment verification fields' })
    }

    // Verify HMAC-SHA256 signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex')

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ error: 'Payment signature verification failed' })
    }

    // Mark order as paid
    const order = await updateOrder(razorpayOrderId, {
      status: 'paid',
      razorpayPaymentId,
      razorpaySignature,
      paidAt: new Date().toISOString(),
    })

    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    console.log(`✅ Payment verified: Order ${order.orderId} — ₹${order.totalAmount} by ${order.userEmail}`)

    res.json({
      success: true,
      orderId: order.orderId,
      message: 'Payment verified successfully',
    })
  } catch (err) {
    console.error('[Orders] Verify payment error:', err)
    res.status(500).json({ error: 'Payment verification failed' })
  }
}

/**
 * GET /api/orders/my
 * Returns all orders for the logged-in user.
 */
export async function getMyOrders(req, res) {
  try {
    const orders = await getOrdersByUser(req.user.userId)
    res.json({ orders })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
}

/**
 * GET /api/orders/all  (admin)
 * Returns all orders — only usable with a valid JWT (any logged-in user for now;
 * you can add an admin role check later).
 */
export async function adminGetAllOrders(req, res) {
  try {
    const orders = await getAllOrders()
    res.json({ orders, total: orders.length })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
}

