import dotenv from 'dotenv'
import path from 'path'
import nodemailer from 'nodemailer'

dotenv.config({ path: path.join(process.cwd(), '.env') })

const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Meet baggyHood</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0d0d0d; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0d0d0d; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #161616; border-radius: 16px; border: 1px solid #2a2a2a; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          <!-- Header -->
          <tr>
            <td style="padding: 36px 32px 24px 32px; border-bottom: 1px solid #242424; text-align: left;">
              <span style="display: inline-block; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff; text-transform: lowercase;">baggy<span style="color: #a9ad87;">Hood</span></span>
              <p style="margin: 6px 0 0 0; font-size: 13px; color: #888888; letter-spacing: 0.5px; text-transform: uppercase;">Independent Streetwear</p>
            </td>
          </tr>
          <!-- Content Body -->
          <tr>
            <td style="padding: 32px; font-size: 15px; line-height: 1.7; color: #d4d4d8;">
              <p style="margin-top: 0; font-size: 16px; color: #ffffff;">Hi Kritika,</p>
             
              <p>Hope you’re doing great!</p>
             
              <p>We wanted to share something special that we’ve been quietly building over the past few months — our new streetwear brand, <strong>baggyHood</strong>.</p>
             
              <p>We started baggyHood around a simple idea: finding true, heavyweight, vintage-washed baggy jeans in India that actually fit right and pool cleanly over sneakers is surprisingly tough. Every piece in our debut drop is crafted from durable 14 oz rigid denim, specifically calibrated for that effortless, oversized puddle stack.</p>

              <p>Knowing your eye for fashion and style, we really wanted you to be among the very first people to check it out!</p>

              <!-- CTA Card -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 32px 0 24px 0;">
                <tr>
                  <td align="center" style="background-color: #1a1c17; border: 1px dashed #3a3e30; border-radius: 12px; padding: 24px;">
                    <p style="margin: 0 0 16px 0; font-size: 14px; color: #a1a1aa;">Check out the collection on:</p>
                    <a href="https://baggyhood.in" target="_blank" style="display: inline-block; background-color: #a9ad87; color: #0d0d0d; text-decoration: none; padding: 12px 34px; font-size: 15px; font-weight: 800; border-radius: 9999px; box-shadow: 0 4px 14px rgba(169, 173, 135, 0.25); letter-spacing: 0.3px;">
                      baggyhood.in &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin-bottom: 0;">Browse through the shades and fits, and let us know what you think — your honest feedback would mean the world to us!</p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #111111; border-top: 1px solid #242424; text-align: left; font-size: 13px; color: #71717a;">
              <p style="margin: 0; font-weight: 600; color: #ffffff;">The baggyHood Team</p>
              <p style="margin: 4px 0 0 0; color: #a1a1aa;">Calibrated Streetwear & Denim</p>
              <p style="margin: 12px 0 0 0; font-size: 12px; color: #52525b;">Web: <a href="https://baggyhood.in" style="color: #a9ad87; text-decoration: none;">baggyhood.in</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

async function sendEmail() {
  const recipient = 'agrawalkritika691@gmail.com'
  const subject = 'Kritika, before this drops publicly — meet baggyHood'

  console.log(`Sending email to Kritika: ${recipient}`)

  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 465,
        secure: process.env.SMTP_SECURE !== 'false',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS.replace(/\s+/g, ''),
        },
      })

      const info = await transporter.sendMail({
        from: `"baggyHood" <${process.env.SMTP_USER}>`,
        to: recipient,
        subject,
        html: htmlContent,
      })

      console.log(`✅ Sent email successfully to ${recipient}! MessageId: ${info.messageId}`)
    } catch (e) {
      console.error(`❌ SMTP failed:`, e.message)
    }
  }
}

sendEmail()
