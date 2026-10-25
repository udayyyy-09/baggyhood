import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { handleJoinDroplist, handleExportDroplist } from './controllers/droplistController.js'

// Load environment variables from backend/.env
dotenv.config({ path: path.join(process.cwd(), '.env') })

const app = express()
const PORT = process.env.PORT || 5050

// Middlewares
app.use(cors({
  origin: '*', // Allow frontend requests
  methods: ['GET', 'POST', 'OPTIONS'],
}))
app.use(express.json())

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'baggyHood Droplist Backend',
    time: new Date().toISOString(),
  })
})

// Droplist submission endpoint
app.post('/api/droplist', handleJoinDroplist)

// Export droplist as CSV
app.get('/api/droplist/export', handleExportDroplist)

app.listen(PORT, () => {
  console.log(`\n=================================================`)
  console.log(`🔥 baggyHood Backend running on http://localhost:${PORT}`)
  console.log(`🔒 Destination Admin Email: ${process.env.ADMIN_EMAIL || 'udaychaudhary419@gmail.com'} (HIDDEN FROM USERS)`)
  console.log(`📬 Primary SMTP: ${process.env.SMTP_USER ? 'Configured' : 'Not set (using Brevo/fallback)'}`)
  console.log(`🚀 Brevo HTTP API: ${process.env.BREVO_API_KEY ? 'Configured' : 'Not set'}`)
  console.log(`💬 WhatsApp Welcome Bot: ${process.env.ENABLE_WHATSAPP_WELCOME === 'true' ? 'Enabled' : 'Disabled'}`)
  console.log(`=================================================\n`)
})
