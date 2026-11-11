import { supabase } from './supabaseClient.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import crypto from 'crypto'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json')

// Local JSON fallback helpers
function ensureLocalFile() {
  const dir = path.dirname(USERS_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '[]', 'utf-8')
}

function readLocalUsers() {
  ensureLocalFile()
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'))
  } catch {
    return []
  }
}

function writeLocalUsers(users) {
  ensureLocalFile()
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8')
}

/**
 * Find user by Google ID
 */
export async function findByGoogleId(googleId) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('google_id', googleId)
        .maybeSingle()

      if (!error && data) {
        return {
          id: data.id,
          googleId: data.google_id,
          name: data.name,
          email: data.email,
          picture: data.picture,
          joinedAt: data.created_at,
          lastLoginAt: data.last_login_at,
        }
      }
    } catch (err) {
      console.warn('⚠️ Supabase findByGoogleId error, falling back to local file:', err.message)
    }
  }

  const users = readLocalUsers()
  return users.find((u) => u.googleId === googleId) || null
}

/**
 * Create or update a user from Google profile in Supabase (with disk backup).
 * Returns the upserted user object.
 */
export async function upsertUser({ googleId, name, email, picture }) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('users')
        .upsert(
          {
            google_id: googleId,
            name,
            email,
            picture,
            last_login_at: new Date().toISOString(),
          },
          { onConflict: 'google_id' }
        )
        .select()
        .single()

      if (!error && data) {
        console.log(`👤 User synced to Supabase: ${data.email} (${data.id})`)
        return {
          id: data.id,
          googleId: data.google_id,
          name: data.name,
          email: data.email,
          picture: data.picture,
          joinedAt: data.created_at,
          lastLoginAt: data.last_login_at,
        }
      } else if (error) {
        console.error('Supabase upsertUser error:', error.message)
      }
    } catch (err) {
      console.warn('⚠️ Supabase upsertUser exception, using local backup:', err.message)
    }
  }

  // Fallback to local JSON if Supabase unreachable
  const users = readLocalUsers()
  const idx = users.findIndex((u) => u.googleId === googleId)

  if (idx !== -1) {
    users[idx].name = name
    users[idx].email = email
    users[idx].picture = picture
    users[idx].lastLoginAt = new Date().toISOString()
    writeLocalUsers(users)
    return users[idx]
  }

  const newUser = {
    id: crypto.randomUUID(),
    googleId,
    name,
    email,
    picture,
    joinedAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  }
  users.push(newUser)
  writeLocalUsers(users)
  return newUser
}

/**
 * Find user by internal id (for JWT verification lookups)
 */
export async function findById(id) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .maybeSingle()

      if (!error && data) {
        return {
          id: data.id,
          googleId: data.google_id,
          name: data.name,
          email: data.email,
          picture: data.picture,
          joinedAt: data.created_at,
          lastLoginAt: data.last_login_at,
        }
      }
    } catch (err) {
      console.warn('⚠️ Supabase findById error:', err.message)
    }
  }

  const users = readLocalUsers()
  return users.find((u) => u.id === id) || null
}
