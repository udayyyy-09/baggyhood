/**
 * Automated WhatsApp confirmation message service for customers joining the droplist
 */
export async function sendCustomerWelcomeWhatsApp({ whatsapp, size, shade }) {
  if (process.env.ENABLE_WHATSAPP_WELCOME !== 'true') {
    return { skipped: true, reason: 'ENABLE_WHATSAPP_WELCOME is false or not configured' }
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER

  if (!accountSid || !authToken || !fromNumber) {
    console.warn('⚠️ WhatsApp automated welcome is enabled but Twilio credentials are incomplete.')
    return { skipped: true, reason: 'Missing credentials' }
  }

  try {
    // Dynamically import twilio so project runs even if twilio isn't installed initially
    const twilioPkg = await import('twilio')
    const client = twilioPkg.default(accountSid, authToken)

    const cleanNumber = whatsapp.replace(/[^\d+]/g, '')
    const to = cleanNumber.startsWith('+') ? `whatsapp:${cleanNumber}` : `whatsapp:+${cleanNumber}`
    const from = fromNumber.startsWith('whatsapp:') ? fromNumber : `whatsapp:${fromNumber}`

    const message = await client.messages.create({
      from,
      to,
      body: `🔥 baggyHood Drop #01 // VIP Confirmed\n\nYou're officially locked into the exclusive Drop #01 early access list.\n\n• Reserved Size: ${size}\n• Colorway: ${shade}\n• Access: VIP link unlocked 2 hours before public announcement.\n\nMore room. Better fits. Bigger vibes.\n— The baggyHood Team`,
    })

    console.log(`✅ Automated WhatsApp welcome sent to ${whatsapp} (SID: ${message.sid})`)
    return { success: true, sid: message.sid }
  } catch (err) {
    console.error(`⚠️ Failed to send automated customer WhatsApp welcome: ${err.message}`)
    return { success: false, error: err.message }
  }
}
