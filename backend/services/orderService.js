import { supabase } from './supabaseClient.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import crypto from 'crypto'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ORDERS_FILE = path.join(__dirname, '..', 'data', 'orders.json')

function ensureFile() {
  const dir = path.dirname(ORDERS_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  if (!fs.existsSync(ORDERS_FILE)) fs.writeFileSync(ORDERS_FILE, '[]', 'utf-8')
}

function readOrders() {
  ensureFile()
  try {
    return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf-8'))
  } catch {
    return []
  }
}

function writeOrders(orders) {
  ensureFile()
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8')
}

/**
 * createOrder
 * Inserts order into Supabase: orders, order_items, and shipping_addresses.
 * Also keeps local JSON backup.
 */
export async function createOrder(orderData) {
  const orderCode = `BH-${Date.now()}`
  let createdOrder = null

  if (supabase) {
    try {
      // 1. Insert into orders table
      const { data: dbOrder, error: oErr } = await supabase
        .from('orders')
        .insert({
          order_code: orderCode,
          user_id: orderData.userId || null,
          user_email: orderData.userEmail,
          user_name: orderData.userName,
          razorpay_order_id: orderData.razorpayOrderId,
          total_amount: orderData.totalAmount,
          currency: orderData.currency || 'INR',
          status: 'pending',
        })
        .select()
        .single()

      if (oErr) {
        console.error('⚠️ Supabase insert order error:', oErr.message)
      } else if (dbOrder) {
        const orderId = dbOrder.id

        // 2. Insert items
        if (orderData.items && orderData.items.length > 0) {
          const itemsToInsert = orderData.items.map((item) => ({
            order_id: orderId,
            product_id: item.productId || item.id || 'custom',
            name: item.name,
            size: item.size || 'Standard',
            qty: item.qty || 1,
            price: item.price,
          }))

          const { error: iErr } = await supabase.from('order_items').insert(itemsToInsert)
          if (iErr) console.error('⚠️ Supabase insert order_items error:', iErr.message)
        }

        // 3. Insert shipping address
        if (orderData.shippingAddress) {
          const addr = orderData.shippingAddress
          const { error: aErr } = await supabase.from('shipping_addresses').insert({
            order_id: orderId,
            name: addr.name || orderData.userName || '',
            phone: addr.phone || '',
            address_line1: addr.addressLine1 || addr.address || '',
            address_line2: addr.addressLine2 || '',
            city: addr.city || '',
            state: addr.state || '',
            pincode: addr.pincode || '',
          })
          if (aErr) console.error('⚠️ Supabase insert shipping_addresses error:', aErr.message)
        }

        createdOrder = {
          id: dbOrder.id,
          orderId: dbOrder.order_code,
          orderCode: dbOrder.order_code,
          ...orderData,
          status: dbOrder.status,
          createdAt: dbOrder.created_at,
        }
        console.log(`📦 Order created in Supabase: ${createdOrder.orderId} (ID: ${createdOrder.id})`)
      }
    } catch (err) {
      console.warn('⚠️ Supabase createOrder exception, falling back to disk:', err.message)
    }
  }

  // Backup to local file
  const fallbackOrder = createdOrder || {
    id: crypto.randomUUID(),
    orderId: orderCode,
    orderCode,
    ...orderData,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }

  const orders = readOrders()
  orders.push(fallbackOrder)
  writeOrders(orders)

  return fallbackOrder
}

/**
 * updateOrder
 * Updates order status (e.g. 'paid') and payment details.
 */
export async function updateOrder(razorpayOrderId, updates) {
  if (supabase) {
    try {
      const dbUpdates = {
        updated_at: new Date().toISOString(),
      }
      if (updates.status) dbUpdates.status = updates.status
      if (updates.razorpayPaymentId) dbUpdates.razorpay_payment_id = updates.razorpayPaymentId
      if (updates.razorpaySignature) dbUpdates.razorpay_signature = updates.razorpaySignature

      const { data, error } = await supabase
        .from('orders')
        .update(dbUpdates)
        .eq('razorpay_order_id', razorpayOrderId)
        .select()
        .maybeSingle()

      if (!error && data) {
        console.log(`✅ Supabase order ${data.order_code} marked as ${data.status}`)
      } else if (error) {
        console.error('⚠️ Supabase updateOrder error:', error.message)
      }
    } catch (err) {
      console.warn('⚠️ Supabase updateOrder exception:', err.message)
    }
  }

  // Also update local file
  const orders = readOrders()
  const idx = orders.findIndex((o) => o.razorpayOrderId === razorpayOrderId || o.id === razorpayOrderId)
  if (idx === -1) return null

  orders[idx] = { ...orders[idx], ...updates, updatedAt: new Date().toISOString() }
  writeOrders(orders)
  return orders[idx]
}

/**
 * findOrderByRazorpayId
 */
export async function findOrderByRazorpayId(razorpayOrderId) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*),
          shipping_addresses (*)
        `)
        .eq('razorpay_order_id', razorpayOrderId)
        .maybeSingle()

      if (!error && data) {
        return {
          id: data.id,
          orderId: data.order_code,
          ...data,
          items: data.order_items,
          shippingAddress: data.shipping_addresses?.[0] || null,
        }
      }
    } catch (err) {
      console.warn('⚠️ Supabase findOrderByRazorpayId exception:', err.message)
    }
  }

  const orders = readOrders()
  return orders.find((o) => o.razorpayOrderId === razorpayOrderId) || null
}

/**
 * getOrdersByUser
 */
export async function getOrdersByUser(userId) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*),
          shipping_addresses (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (!error && data) {
        return data.map((d) => ({
          id: d.id,
          orderId: d.order_code,
          ...d,
          items: d.order_items,
          shippingAddress: d.shipping_addresses?.[0] || null,
        }))
      }
    } catch (err) {
      console.warn('⚠️ Supabase getOrdersByUser exception:', err.message)
    }
  }

  const orders = readOrders()
  return orders.filter((o) => o.userId === userId)
}

/**
 * getAllOrders
 */
export async function getAllOrders() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*),
          shipping_addresses (*)
        `)
        .order('created_at', { ascending: false })

      if (!error && data) {
        return data.map((d) => ({
          id: d.id,
          orderId: d.order_code,
          ...d,
          items: d.order_items,
          shippingAddress: d.shipping_addresses?.[0] || null,
        }))
      }
    } catch (err) {
      console.warn('⚠️ Supabase getAllOrders exception:', err.message)
    }
  }

  return readOrders()
}
