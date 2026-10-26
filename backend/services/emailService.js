import nodemailer from 'nodemailer'
import { buildAdminLeadEmailHTML, buildCustomerWelcomeEmailHTML } from '../utils/emailTemplate.js'

/**
 * Clean email address from strings like 'Name <email@example.com>'
 */
function extractEmail(str) {
  if (!str) return 'udaychaudhary419@gmail.com'
  const match = str.match(/<([^>]+)>/)
  return match ? match[1].trim() : str.trim()
}

/**
 * Dispatch an email with multi-tier failover:
 * Tier 1: Nodemailer (SMTP / Gmail App Password)
 * Tier 2: Brevo HTTP REST API (Render-safe port 443)
 */
/**
 * Send email via Brevo REST API (over HTTPS port 443 — guaranteed to work on cloud hosts like Render)
 */
/**
 * Send email via Brevo REST API (over HTTPS port 443 — guaranteed to work on cloud hosts like Render)
 * Note: Brevo STRICTLY requires the sender email to be an active verified sender in your Brevo account.
 */
async function sendViaBrevo({ to, subject, html, purpose }) {
  if (!process.env.BREVO_API_KEY) return null

  // Official brand sender: baggyhoodindia@gmail.com
  const brevoEmail = extractEmail(process.env.BREVO_SENDER_EMAIL || process.env.SMTP_USER || 'baggyhoodindia@gmail.com')
  const senderName = process.env.BREVO_SENDER_NAME || 'baggyHood Drops'

  try {
    console.log(`[Email] Attempting ${purpose} via Brevo HTTP API from official sender: ${brevoEmail}...`)
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY.trim(),
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: senderName,
          email: brevoEmail,
        },
        replyTo: {
          name: senderName,
          email: brevoEmail,
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
    })

    const resText = await response.text()
    let resJson = {}
    try {
      resJson = JSON.parse(resText)
    } catch {}

    if (!response.ok) {
      throw new Error(`Brevo HTTP API ${response.status}: ${resText}`)
    }

    console.log(`✅ [Email] ${purpose} accepted by Brevo API (MessageId: ${resJson.messageId || 'ok'}) to ${to}`)
    return { success: true, provider: 'brevo', messageId: resJson.messageId }
  } catch (err) {
    console.warn(`⚠️ [Email] Brevo API attempt failed for ${purpose}: ${err.message}`)
    return null
  }
}

/**
 * Send email via Primary Nodemailer SMTP (works locally, but ports 465/587 are blocked on Render free tier)
 */
async function sendViaSmtp({ to, subject, html, purpose }) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return null
  const smtpEmail = extractEmail(process.env.SMTP_USER)
  const senderName = process.env.BREVO_SENDER_NAME || 'baggyHood Drops'

  try {
    console.log(`[Email] Attempting ${purpose} via Primary SMTP from: ${smtpEmail}...`)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: process.env.SMTP_SECURE !== 'false',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS.replace(/\s+/g, ''),
      },
      connectionTimeout: 4000,
      greetingTimeout: 4000,
    })

    const info = await transporter.sendMail({
      from: `"${senderName}" <${smtpEmail}>`,
      to,
      subject,
      html,
    })

    console.log(`✅ [Email] ${purpose} sent via Primary SMTP to ${to} (MessageId: ${info.messageId})`)
    return { success: true, provider: 'smtp', messageId: info.messageId }
  } catch (smtpErr) {
    console.warn(`⚠️ [Email] SMTP attempt failed for ${purpose}: ${smtpErr.message}`)
    return null
  }
}

/**
 * Dispatch an email with intelligent multi-tier failover:
 * - On Render / Cloud: Prioritizes Brevo HTTP API (Port 443) for instant 300ms delivery without SMTP block timeouts
 * - Local / Self-hosted: Prioritizes SMTP with Brevo fallback
 */
async function dispatchEmail({ to, subject, html, purpose }) {
  const isCloudHost = Boolean(process.env.RENDER) || process.env.EMAIL_PROVIDER === 'brevo'

  if (isCloudHost && process.env.BREVO_API_KEY) {
    // 1. Fast cloud delivery via Brevo HTTP API (Port 443)
    const brevoRes = await sendViaBrevo({ to, subject, html, purpose })
    if (brevoRes) return brevoRes

    // 2. Fallback to SMTP if Brevo fails
    const smtpRes = await sendViaSmtp({ to, subject, html, purpose })
    if (smtpRes) return smtpRes
  } else {
    // 1. Local environment: Primary SMTP
    const smtpRes = await sendViaSmtp({ to, subject, html, purpose })
    if (smtpRes) return smtpRes

    // 2. Cloud Fallback: Brevo HTTP API
    const brevoRes = await sendViaBrevo({ to, subject, html, purpose })
    if (brevoRes) return brevoRes
  }

  return { success: false, provider: 'none' }
}

/**
 * 1. Notify Admin (Uday) about the new lead
 */
export async function sendLeadNotificationToAdmin(lead) {
  const adminEmail = process.env.ADMIN_EMAIL || 'udaychaudhary419@gmail.com'
  const subject = `🔥 [NEW LEAD] baggyHood Drop #01 — ${lead.email} (${lead.size})`
  const html = buildAdminLeadEmailHTML({ ...lead, providerUsed: 'Auto (SMTP/Brevo)' })

  return await dispatchEmail({
    to: adminEmail,
    subject,
    html,
    purpose: `Admin Lead Alert (${lead.email})`,
  })
}

/**
 * 2. Send instant VIP Confirmation email to the CUSTOMER
 */
export async function sendCustomerWelcomeEmail(lead) {
  const subject = `🔥 You're on the baggyHood Drop #01 VIP List`
  const html = buildCustomerWelcomeEmailHTML(lead)

  return await dispatchEmail({
    to: lead.email,
    subject,
    html,
    purpose: `Customer VIP Welcome (${lead.email})`,
  })
}
