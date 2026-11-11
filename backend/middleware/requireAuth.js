import jwt from 'jsonwebtoken'

/**
 * requireAuth — Express middleware
 * Reads JWT from the `bh_token` HttpOnly cookie.
 * Attaches decoded user payload to req.user, or returns 401.
 */
export function requireAuth(req, res, next) {
  const token = req.cookies?.bh_token

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session. Please sign in again.' })
  }
}

