# baggyHood — Droplist Backend & Notification Architecture
**Implementation Plan: Zero-Loss Droplist Lead Pipeline with Multi-Tier Failover**

---

## 1. Executive Summary & Objective

Connect the baggyHood landing page droplist form to **udaychaudhary419@gmail.com** while strictly ensuring:
1. **Zero Client-Side Exposure**: `udaychaudhary419@gmail.com` and all API keys exist exclusively in server-side environment variables (`.env`).
2. **Cloud-Resilient Dual Email Delivery**: Primary **Nodemailer (SMTP)** with automatic fallback to **Brevo (formerly Sendinblue) HTTP REST API** (Render-safe over port 443).
3. **Guaranteed Lead Persistence**: Immediate local JSON/CSV backup (`data/droplist.json`) before any network calls, ensuring 0% lead loss.
4. **Automated WhatsApp Welcome Message**: Instant confirmation message sent to customer via WhatsApp Business API / Twilio.
5. **One-Tap Admin Response**: Direct `wa.me` quick-action links inside the notification email sent to Uday.

---

## 2. Separate Directory Architecture

```
baggyhood-landing-react-tailwind/
├── backend/                       # Isolated Node/Express Backend
│   ├── .env                       # Private secrets (ADMIN_EMAIL, SMTP, Brevo API)
│   ├── .env.example               # Template for environment configuration
│   ├── package.json               # Backend dependencies (express, cors, dotenv, nodemailer)
│   ├── server.js                  # Express application & API entry point (Port 5050)
│   ├── controllers/
│   │   └── droplistController.js  # Request validation, disk backup, and dispatch trigger
│   ├── services/
│   │   ├── emailService.js        # Nodemailer (Primary) + Brevo REST API (Render fallback)
│   │   └── whatsappService.js     # Automated customer WhatsApp welcome bot
│   ├── utils/
│   │   └── emailTemplate.js       # Formatted HTML lead email with 1-tap wa.me link
│   └── data/
│       ├── droplist.json          # Persistent JSON lead database
│       └── droplist.csv           # Direct exportable CSV for WhatsApp broadcast
│
├── src/                           # Frontend React Application
│   ├── App.jsx                    # Connected to /api/droplist with async state
│   ├── styles.css                 # Custom styling & animations
│   └── main.jsx
├── public/                        # High-res denim assets & rotating model video
├── vite.config.js                 # Development proxy configured (/api -> localhost:5050)
├── package.json                   # Frontend dependencies & scripts
└── IMPLEMENTATION_PLAN.md         # Architecture blueprint & documentation
```

---

## 3. System Flow Diagram

```
                 [ User Submits Waitlist Form ]
                  { whatsapp, size, shade }
                               │
                               ▼  POST /api/droplist
                 ┌─────────────────────────────┐
                 │    Express Backend Server   │
                 │      (Local / Render)       │
                 └──────────────┬──────────────┘
                                │
             ┌──────────────────┼──────────────────┐
             ▼                  ▼                  ▼
    [1. Persistent Disk] [2. Email Dispatch] [3. WhatsApp Welcome]
      data/droplist.json         │             Twilio / Meta API
                                 ▼                     │
                        ┌──────────────────┐           ▼
                        │ Primary: SMTP    │     [ Customer Phone ]
                        │ (Nodemailer)     │    "You're on the list!
                        └────────┬─────────┘     Size reserved..."
                                 │ Fail?
                                 ▼
                        ┌──────────────────┐
                        │ Fallback: Brevo  │
                        │ (REST API :443)  │
                        └────────┬─────────┘
                                 │
                                 ▼
                     [ udaychaudhary419@gmail.com ]
                      🔥 New Drop Lead Notification
```

---

## 3. Multi-Tier Failover Strategy

### Tier 1: Local Data Store (Always Executes First)
* Before attempting any network transmission, the server saves the payload to `data/droplist.json` and `data/droplist.csv`.
* **Why**: Even if internet drops or email APIs hit rate limits, your customer list is safely stored on disk for CSV export.

### Tier 2: Primary Email Delivery via Nodemailer (SMTP)
* Connects via standard SMTP (Gmail App Password or custom domain SMTP).
* Sends a rich HTML email with the customer's phone number, requested size, denim shade, and timestamp.

### Tier 3: Cloud Fallback via Brevo REST API (Render-Proof)
* **Problem on Render / Cloud Hosts**: Hosting providers like Render, AWS, and DigitalOcean frequently block or throttle outbound SMTP ports (25, 465, 587) to curb spam, causing Nodemailer to timeout with `ETIMEDOUT` or `ECONNREFUSED`.
* **Solution**: If Nodemailer throws an error, the backend catch-block automatically switches to **Brevo Transactional Email REST API** (`POST https://api.brevo.com/v3/smtp/email`) over standard HTTPS port 443 (which is never blocked).

---

## 4. Automated WhatsApp Welcome Confirmation (Customer-Facing)

When a customer joins the droplist, an automated welcome text is sent directly to their phone:

### Message Copy:
> **baggyHood Drop #01 // VIP Confirmed** 🔥
> 
> You're officially locked into the exclusive Drop #01 early access list.
> 
> • **Reserved Size:** {{size}} (Deep Sneaker Stack Outseam)
> • **Selected Colorway:** {{shade}}
> • **Perk:** Private order link unlocked 2 hours before public announcement.
> 
> *More room. Better fits. Bigger vibes.*
> — The baggyHood Team

### Provider Options:
1. **Twilio WhatsApp API**: Easiest sandbox setup, robust Node SDK (`twilio` package).
2. **Meta WhatsApp Business Cloud API**: Official WhatsApp Cloud API (free 1,000 service conversations per month).

---

## 5. Environment Variables Configuration (`.env`)

```env
# Server
PORT=5000
NODE_ENV=production

# Lead Recipient (Hidden from client)
ADMIN_EMAIL=udaychaudhary419@gmail.com

# Primary: Nodemailer SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your_sender_account@gmail.com
SMTP_PASS=your_16_char_google_app_password

# Fallback: Brevo (Sendinblue) REST API (Render safe)
BREVO_API_KEY=xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
BREVO_SENDER_EMAIL=drops@baggyhood.com
BREVO_SENDER_NAME=baggyHood Drops

# Automated Customer WhatsApp Welcome
ENABLE_WHATSAPP_WELCOME=true
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=+14155238886
```

---

## 6. Implementation Code Specifications

### 6.1 Backend Controller (`server/controllers/droplist.js`)

```javascript
import fs from 'fs'
import path from 'path'
import nodemailer from 'nodemailer'

const DATA_FILE = path.join(process.cwd(), 'data', 'droplist.json')

// Helper: Ensure backup directory exists
function saveLeadToDisk(lead) {
  if (!fs.existsSync(path.dirname(DATA_FILE))) {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true })
  }
  const existing = fs.existsSync(DATA_FILE) ? JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')) : []
  existing.push(lead)
  fs.writeFileSync(DATA_FILE, JSON.stringify(existing, null, 2))
}

// 1. Primary: Nodemailer Transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE !== 'false',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 5000, // 5s timeout before failover to Brevo
})

// 2. Fallback: Brevo REST API over HTTPS
async function sendViaBrevo(lead) {
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { name: process.env.BREVO_SENDER_NAME || 'baggyHood Droplist', email: process.env.BREVO_SENDER_EMAIL || 'alerts@baggyhood.com' },
      to: [{ email: process.env.ADMIN_EMAIL, name: 'Uday Chaudhary' }],
      subject: `🔥 New Droplist Entry: ${lead.whatsapp} (Size ${lead.size})`,
      htmlContent: buildEmailHTML(lead),
    }),
  })
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Brevo API failed: ${errorText}`)
  }
}

// 3. Customer WhatsApp Confirmation
async function sendCustomerWhatsApp(phone, size, shade) {
  if (process.env.ENABLE_WHATSAPP_WELCOME !== 'true') return
  const twilio = (await import('twilio')).default
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

  const cleanPhone = phone.replace(/[^\d+]/g, '')
  await client.messages.create({
    from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
    to: `whatsapp:${cleanPhone}`,
    body: `🔥 baggyHood Drop #01 // VIP Confirmed\n\nYou're on the list for Drop #01!\n• Size: ${size}\n• Colorway: ${shade}\n\nYou will receive your private early access link before public launch.\nMore room. Better fits. Bigger vibes.`,
  })
}
```

---

## 7. Email Template Specification (Sent to Uday)

* **Subject**: `🔥 [NEW LEAD] baggyHood Drop #01 — +91 98765 43210 (Size 32)`
* **Content**:
  - Direct 1-Tap WhatsApp chat button: `https://wa.me/<customer_phone>?text=Hey!%20Saw%20you%20joined%20baggyHood%20Drop%20%2301%20Waitlist...`
  - Customer WhatsApp Number
  - Requested Size & Inseam Calibrated Length
  - Selected Colorway / Shade
  - Timestamp & Referral / Device Info
  - Delivery Route badge: `[Delivered via: Primary SMTP]` or `[Delivered via: Brevo API Fallback]`

---

## 8. Step-by-Step Execution Plan

| Phase | Task | Details |
| :--- | :--- | :--- |
| **Phase 1** | Server Initialization | Create `server/index.js`, install `express`, `cors`, `dotenv`, `nodemailer` |
| **Phase 2** | Multi-Tier Email Service | Implement Nodemailer with automatic `try/catch` failover to Brevo REST API |
| **Phase 3** | Data Persistence | Add JSON & CSV append logger in `data/droplist.json` |
| **Phase 4** | WhatsApp Welcome Bot | Integrate Twilio / WhatsApp Cloud webhook trigger for instant customer greeting |
| **Phase 5** | Frontend API Wiring | Connect `joinWaitlist` form in `src/App.jsx` with loading states & toast feedback |
| **Phase 6** | Render Deployment Ready | Add `render.yaml` and unified `npm start` scripts |

---

*Document created for baggyHood Landing Page codebase.*
