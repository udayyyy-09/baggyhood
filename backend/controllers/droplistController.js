import fs from 'fs'
import path from 'path'
import { sendLeadNotificationToAdmin, sendCustomerWelcomeEmail } from '../services/emailService.js'

const DATA_DIR = path.join(process.cwd(), 'data')
const JSON_FILE = path.join(DATA_DIR, 'droplist.json')
const CSV_FILE = path.join(DATA_DIR, 'droplist.csv')

/**
 * Persist lead safely to local JSON and CSV files
 */
function persistLeadLocally(lead) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }

    // 1. Append to JSON
    let list = []
    if (fs.existsSync(JSON_FILE)) {
      try {
        list = JSON.parse(fs.readFileSync(JSON_FILE, 'utf-8'))
      } catch {
        list = []
      }
    }
    list.push(lead)
    fs.writeFileSync(JSON_FILE, JSON.stringify(list, null, 2))

    // 2. Append to CSV
    const csvExists = fs.existsSync(CSV_FILE)
    const header = 'Timestamp,Email,Size,Shade,IP\n'
    const row = `"${lead.timestamp}","${lead.email}","${lead.size}","${lead.shade}","${lead.ip}"\n`
    if (!csvExists) {
      fs.writeFileSync(CSV_FILE, header + row)
    } else {
      fs.appendFileSync(CSV_FILE, row)
    }
  } catch (err) {
    console.error('Failed to save lead to local disk backup:', err.message)
  }
}

/**
 * Handle POST /api/droplist
 */
export async function handleJoinDroplist(req, res) {
  try {
    const rawEmail = req.body.email || req.body.whatsapp
    const { size, shade } = req.body

    if (!rawEmail || typeof rawEmail !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address.',
      })
    }

    const email = rawEmail.trim().toLowerCase()
    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid email address (e.g., name@gmail.com).',
      })
    }

    const lead = {
      id: Date.now().toString(),
      email,
      size: size || 'Unspecified',
      shade: shade || 'Unspecified',
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown',
    }

    console.log(`\n📥 [Droplist] New Entry: ${lead.email} | Size: ${lead.size} | Shade: ${lead.shade}`)

    // 1. Immediately persist to disk backup
    persistLeadLocally(lead)

    // 2. Dispatch async emails (Admin Alert + Customer Welcome Confirmation)
    Promise.allSettled([
      sendLeadNotificationToAdmin(lead),
      sendCustomerWelcomeEmail(lead),
    ]).then((results) => {
      console.log('📬 [Droplist] Email dispatch cycle completed for', lead.email)
    })

    return res.status(200).json({
      success: true,
      message: "You're officially on the baggyHood VIP droplist! Check your inbox for confirmation.",
    })
  } catch (err) {
    console.error('Droplist controller error:', err)
    return res.status(500).json({
      success: false,
      error: 'An internal server error occurred. Please try again.',
    })
  }
}

/**
 * Handle GET /api/droplist/export (CSV export)
 */
export function handleExportDroplist(req, res) {
  if (fs.existsSync(CSV_FILE)) {
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename="baggyhood_droplist.csv"')
    return res.sendFile(CSV_FILE)
  }
  return res.status(404).json({ error: 'No droplist entries yet.' })
}
