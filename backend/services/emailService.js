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
async function dispatchEmail({ to, subject, html, purpose }) {
  const senderEmail = extractEmail(process.env.SMTP_USER || process.env.BREVO_SENDER_EMAIL || 'udaychaudhary419@gmail.com')
  const senderName = process.env.BREVO_SENDER_NAME || 'baggyHood Drops'

  // 1. Primary: Nodemailer (SMTP)
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      console.log(`[Email] Attempting ${purpose} via Primary SMTP...`)
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 465,
        secure: process.env.SMTP_SECURE !== 'false',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS.replace(/\s+/g, ''), // strip any spaces from app password
        },
        connectionTimeout: 6000,
        greetingTimeout: 6000,
      })

      await transporter.sendMail({
        from: `"${senderName}" <${senderEmail}>`,
        to,
        subject,
        html,
      })

      console.log(`✅ [Email] ${purpose} sent via Primary SMTP to ${to}`)
      return { success: true, provider: 'smtp' }
    } catch (smtpErr) {
      console.warn(`⚠️ [Email] Primary SMTP failed for ${purpose}: ${smtpErr.message}. Failing over to Brevo HTTP API...`)
    }
  }

  // 2. Fallback: Brevo REST API over HTTPS port 443
  if (process.env.BREVO_API_KEY) {
    try {
      console.log(`[Email] Attempting ${purpose} via Brevo REST API...`)
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
            email: senderEmail,
          },
          to: [{ email: to }],
          subject,
          htmlContent: html,
        }),
      })

      if (!response.ok) {
        const errText = await response.text()
        throw new Error(`Brevo HTTP API ${response.status}: ${errText}`)
      }

      console.log(`✅ [Email] ${purpose} sent via Brevo HTTP API fallback to ${to}`)
      return { success: true, provider: 'brevo' }
    } catch (brevoErr) {
      console.error(`❌ [Email] Brevo API fallback failed for ${purpose}: ${brevoErr.message}`)
    }
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
