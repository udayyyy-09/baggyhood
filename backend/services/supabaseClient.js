import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env') })

const supabaseUrl = process.env.SUPABASE_URL
// Use service role key on backend to bypass Row-Level Security (RLS) for server operations
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY

let supabase = null

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
} else {
  console.warn('⚠️ Supabase credentials missing (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).')
}

export { supabase }

