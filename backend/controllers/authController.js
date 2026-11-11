import jwt from 'jsonwebtoken'
import { upsertUser } from '../services/userService.js'

const COOKIE_NAME = 'bh_token'
const COOKIE_OPTIONS = {
  httpOnly: true,                                          // Not accessible via JS — XSS safe
  secure: process.env.NODE_ENV === 'production',           // HTTPS only in prod
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // cross-site cookie for Render + baggyhood.in
  maxAge: 7 * 24 * 60 * 60 * 1000,                       // 7 days in ms
}

/**
 * Called by Passport after successful Google login.
 * Signs a JWT, sets it as an HttpOnly cookie, redirects to frontend.
 */
export async function handleGoogleCallback(req, res) {
  try {
    const { id, displayName, emails, photos } = req.user

    const user = await upsertUser({
      googleId: id,
      name: displayName,
      email: emails?.[0]?.value || '',
      picture: photos?.[0]?.value || '',
    })

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS)

    // Redirect to frontend — cart will auto-resume via AuthContext
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
    res.redirect(`${frontendUrl}/?auth=success`)
  } catch (err) {
    console.error('[Auth] Google callback error:', err)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
    res.redirect(`${frontendUrl}/?auth=error`)
  }
}

/**
 * GET /api/auth/me
 * Returns the currently logged-in user from cookie, or 401.
 */
export function getMe(req, res) {
  // req.user is set by requireAuth middleware
  res.json({
    id: req.user.userId,
    name: req.user.name,
    email: req.user.email,
    picture: req.user.picture,
  })
}

/**
 * POST /api/auth/logout
 * Clears the session cookie.
 */
export function handleLogout(req, res) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  })
  res.json({ success: true, message: 'Logged out successfully' })
}

