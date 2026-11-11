import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'

import { handleJoinDroplist, handleExportDroplist } from './controllers/droplistController.js'
import { handleGoogleCallback, getMe, handleLogout } from './controllers/authController.js'
import { requireAuth } from './middleware/requireAuth.js'
import { findByGoogleId, upsertUser } from './services/userService.js'
import { createRazorpayOrder, verifyPayment, getMyOrders, adminGetAllOrders } from './controllers/orderController.js'

// Load environment variables from backend/.env
dotenv.config({ path: path.join(process.cwd(), '.env') })

const app = express()
const PORT = process.env.PORT || 5050

// Enable trust proxy for cloud deployment (Render & Vercel load balancers)
app.set('trust proxy', 1)

// ─── CORS ────────────────────────────────────────────────────────────────────
const defaultAllowedOrigins = [
  'https://www.baggyhood.in',
  'https://baggyhood.in',
  'https://baggyhood.onrender.com',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5050',
  'http://localhost:4173',
]

const envOrigins = [
  process.env.FRONTEND_URL,
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : []),
]
  .filter(Boolean)
  .map((o) => o.trim())

const allowedOrigins = [...new Set([...defaultAllowedOrigins, ...envOrigins])]

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (such as server-to-server health checks, curl, or mobile webviews)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }
      // In development mode, allow any localhost/127.0.0.1 port
      if (process.env.NODE_ENV !== 'production') {
        if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
          return callback(null, true)
        }
      }
      console.warn(`[CORS] Blocked unauthorized origin: ${origin}`)
      return callback(new Error(`CORS blocked request from unauthorized origin: ${origin}`))
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Required for cookies to be sent cross-origin
  })
)

app.use(express.json())
app.use(cookieParser()) // Parse HttpOnly cookies

// ─── PASSPORT: Google OAuth Strategy ─────────────────────────────────────────
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Pass raw Google profile to controller via req.user
        done(null, profile)
      } catch (err) {
        done(err, null)
      }
    }
  )
)

// Minimal serialize/deserialize (stateless JWT — no session storage needed)
passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))

app.use(passport.initialize())

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────
const healthCheckHandler = (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'baggyHood Backend',
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    auth: {
      google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      jwt: Boolean(process.env.JWT_SECRET),
    },
    email: {
      smtp: Boolean(process.env.SMTP_USER),
      resend: Boolean(process.env.RESEND_API_KEY),
      brevo: Boolean(process.env.BREVO_API_KEY),
    },
  })
}

app.get('/health', healthCheckHandler)
app.get('/api/health', healthCheckHandler)
app.get('/', healthCheckHandler)

// ─── AUTH ROUTES ──────────────────────────────────────────────────────────────

// Step 1: Redirect user to Google consent screen
app.get(
  '/api/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
)

// Step 2: Google redirects back here with auth code
app.get(
  '/api/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/?auth=error`,
    session: false,
  }),
  handleGoogleCallback
)

// GET /api/auth/me — returns current user from cookie (used on frontend mount)
app.get('/api/auth/me', requireAuth, getMe)

// POST /api/auth/logout — clears cookie
app.post('/api/auth/logout', handleLogout)

// ─── DROPLIST ROUTES ──────────────────────────────────────────────────────────
app.post('/api/droplist', handleJoinDroplist)
app.get('/api/droplist/export', handleExportDroplist)

// ─── ORDER / PAYMENT ROUTES ───────────────────────────────────────────────────
app.post('/api/orders/create', requireAuth, createRazorpayOrder)   // Create Razorpay order
app.post('/api/orders/verify', requireAuth, verifyPayment)         // Verify payment signature
app.get('/api/orders/my', requireAuth, getMyOrders)                // User's own orders
app.get('/api/orders/all', requireAuth, adminGetAllOrders)         // Admin: all orders

// ─── ERROR HANDLER ────────────────────────────────────────────────────────────
// Ensures any error (including CORS or route errors) returns JSON, never HTML
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.message || err)
  res.status(err.status || 403).json({
    error: err.message || 'Access denied or server error',
  })
})

// ─── START SERVER ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n=================================================`)
  console.log(`🔥 baggyHood Backend running on http://localhost:${PORT}`)
  console.log(`🔒 Admin Email: ${process.env.ADMIN_EMAIL || 'not set'} (HIDDEN FROM USERS)`)
  console.log(`🛡️ Allowed CORS Origins: ${allowedOrigins.join(', ')}`)
  console.log(`🔑 Google OAuth: ${process.env.GOOGLE_CLIENT_ID ? '✅ Configured' : '❌ Not set'}`)
  console.log(`🔐 JWT Secret: ${process.env.JWT_SECRET ? '✅ Configured' : '❌ Not set'}`)
  console.log(`🚀 Resend HTTP API: ${process.env.RESEND_API_KEY ? '✅ Configured' : 'Not set'}`)
  console.log(`📬 Brevo HTTP API: ${process.env.BREVO_API_KEY ? '✅ Configured' : 'Not set'}`)
  console.log(`✉️ Primary SMTP: ${process.env.SMTP_USER ? '✅ Configured' : 'Not set'}`)
  console.log(`=================================================\n`)
})
