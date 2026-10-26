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
 * 1. Send email via Resend REST API (over HTTPS port 443 — highest inbox deliverability)
 * Docs: https://resend.com/docs/api-reference/emails/send-email
 */
async function sendViaResend({ to, subject, html, purpose }) {
  if (!process.env.RESEND_API_KEY) return null

  // Defaults to Resend's pre-verified test sender, or custom domain if set (e.g. 'baggyHood <vip@baggyhood.com>')
  const resendFrom = process.env.RESEND_FROM_EMAIL || 'baggyHood <onboarding@resend.dev>'
  const replyTo = process.env.BREVO_SENDER_EMAIL || process.env.SMTP_USER || 'baggyhoodindia@gmail.com'

  try {
    console.log(`[Email] Attempting ${purpose} via Resend HTTP API (from: ${resendFrom})...`)
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: resendFrom,
        to: [to],
        reply_to: extractEmail(replyTo),
        subject,
        html,
      }),
    })

    const resJson = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(`Resend API ${response.status}: ${JSON.stringify(resJson)}`)
    }

    console.log(`🚀 [Email] ${purpose} delivered via Resend HTTP API to ${to} (ID: ${resJson.id})`)
    return { success: true, provider: 'resend', id: resJson.id }
  } catch (err) {
    console.warn(`⚠️ [Email] Resend attempt failed for ${purpose}: ${err.message}`)
    return null
  }
}

/**
 * 2. Send email via Brevo REST API (over HTTPS port 443 — guaranteed to work on cloud hosts like Render)
 * Note: Brevo requires the sender email to be an active verified sender in your Brevo account.
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
 * 3. Send email via Primary Nodemailer SMTP (works locally, but ports 465/587 are blocked on Render free tier)
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
 * Dispatch an email with multi-provider architecture:
 * Tier 1: Resend HTTP API (if RESEND_API_KEY is present — top inbox deliverability)
 * Tier 2: Brevo HTTP API (if BREVO_API_KEY is present — Render cloud safe fallback)
 * Tier 3: Nodemailer Primary SMTP (for local dev or SMTP allowed hosts)
 */
async function dispatchEmail({ to, subject, html, purpose }) {
  // 1. Resend (Top priority if RESEND_API_KEY is configured)
  if (process.env.RESEND_API_KEY) {
    const resendRes = await sendViaResend({ to, subject, html, purpose })
    if (resendRes) return resendRes
  }

  // 2. Brevo (Cloud HTTP fallback or primary if configured)
  if (process.env.BREVO_API_KEY) {
    const brevoRes = await sendViaBrevo({ to, subject, html, purpose })
    if (brevoRes) return brevoRes
  }

  // 3. Primary Nodemailer SMTP (Local or standard SMTP)
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    const smtpRes = await sendViaSmtp({ to, subject, html, purpose })
    if (smtpRes) return smtpRes
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
