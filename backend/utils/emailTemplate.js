/**
 * Generate HTML email notification sent to baggyHood Admin (Uday)
 */
export function buildAdminLeadEmailHTML({ email, size, shade, timestamp, providerUsed }) {
  const replyMailto = `mailto:${email}?subject=${encodeURIComponent(
    'baggyHood Drop #01 // VIP Early Access Details'
  )}&body=${encodeURIComponent(
    `Hey,\n\nThanks for locking in size ${size} for baggyHood Drop #01!\n\nWe'll be sending your private checkout link prior to the public announcement.\n\nBest,\nUday & the baggyHood Team`
  )}`

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New baggyHood Droplist Entry</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0d0c; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #ffffff;">
  <div style="max-width: 600px; margin: 30px auto; background-color: #161a14; border: 1px solid rgba(255,255,255,0.12); border-radius: 14px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
    
    <!-- Header Banner -->
    <div style="background-color: #1f251c; border-bottom: 1px solid rgba(255,255,255,0.1); padding: 24px 30px;">
      <p style="margin: 0; font-size: 11px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; color: #a9ad87;">Drop #01 // VIP Droplist</p>
      <h1 style="margin: 6px 0 0; font-size: 24px; font-weight: 900; letter-spacing: -0.03em; color: #ffffff;">🔥 NEW DROPLIST SIGNUP</h1>
    </div>

    <!-- Body Content -->
    <div style="padding: 30px;">
      <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: rgba(255,255,255,0.7);">
        A new customer just joined the baggyHood Drop #01 waitlist.
      </p>

      <!-- Key Details Card -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 28px; background-color: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px;">
        <tr>
          <td style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 12px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.1em; width: 35%;">Customer Email</td>
          <td style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 16px; font-weight: 800; color: #a9ad87;">${email}</td>
        </tr>
        <tr>
          <td style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 12px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.1em;">Reserved Size</td>
          <td style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 14px; font-weight: 700; color: #ffffff;">${size}</td>
        </tr>
        <tr>
          <td style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 12px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.1em;">Selected Colorway</td>
          <td style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 14px; font-weight: 700; color: #ffffff;">${shade}</td>
        </tr>
        <tr>
          <td style="padding: 14px 18px; font-size: 12px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.1em;">Received At</td>
          <td style="padding: 14px 18px; font-size: 13px; color: rgba(255,255,255,0.8);">${timestamp}</td>
        </tr>
      </table>

      <!-- 1-Tap Reply Button -->
      <div style="text-align: center; margin: 32px 0 20px;">
        <a href="${replyMailto}" style="display: inline-block; background-color: #f1f0eb; color: #0b0d0c; text-decoration: none; font-size: 13px; font-weight: 800; padding: 14px 28px; border-radius: 9999px; letter-spacing: 0.05em; text-transform: uppercase;">
          ✉️ Reply to Customer Directly
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #0b0d0c; padding: 16px 30px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 11px; color: rgba(255,255,255,0.4); display: flex; justify-content: space-between;">
      <span>baggyHood Droplist Service</span>
      <span style="color: #a9ad87;">Delivery Route: ${providerUsed}</span>
    </div>
  </div>
</body>
</html>
`
}

/**
 * Generate VIP confirmation welcome email sent to CUSTOMER
 */
export function buildCustomerWelcomeEmailHTML({ size, shade }) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You're on the baggyHood Drop #01 VIP List</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0d0c; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #ffffff;">
  <div style="max-width: 600px; margin: 30px auto; background-color: #121511; border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,0.6);">
    
    <!-- Top Brand Bar -->
    <div style="background-color: #181d16; border-bottom: 1px solid rgba(255,255,255,0.08); padding: 28px 32px;">
      <h2 style="margin: 0; font-size: 26px; font-weight: 900; letter-spacing: -0.05em; color: #ffffff;">
        baggy<span style="color: #a9ad87;">Hood</span><span style="color: #a9ad87;">.</span>
      </h2>
      <p style="margin: 6px 0 0; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.24em; color: #a9ad87;">
        DROP #01 // VIP EARLY ACCESS PASS
      </p>
    </div>

    <!-- Main Hero Body -->
    <div style="padding: 36px 32px;">
      <span style="display: inline-block; background-color: rgba(169, 173, 135, 0.15); border: 1px solid rgba(169, 173, 135, 0.4); color: #c8cca8; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.18em; padding: 6px 14px; border-radius: 9999px; margin-bottom: 20px;">
        ✦ YOU'RE ON THE LIST
      </span>

      <h1 style="margin: 0 0 16px; font-size: 32px; font-weight: 900; line-height: 1.05; letter-spacing: -0.04em; color: #ffffff;">
        BUILT FOR THE STREETS.<br />
        <span style="color: #a9ad87;">MADE FOR YOUR FIT.</span>
      </h1>

      <p style="margin: 0 0 28px; font-size: 14px; line-height: 1.6; color: rgba(255,255,255,0.7);">
        Thanks for backing baggyHood before the public launch. We have reserved your requested silhouette for the Drop #01 production batch.
      </p>

      <!-- Reservation Details Box -->
      <div style="background-color: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px 24px; margin-bottom: 28px;">
        <p style="margin: 0 0 14px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; color: #a9ad87;">
          Your Reserved Fit Details
        </p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-size: 13px; color: rgba(255,255,255,0.5); width: 45%;">Selected Size</td>
            <td style="padding: 8px 0; font-size: 14px; font-weight: 800; color: #ffffff;">${size}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 13px; color: rgba(255,255,255,0.5);">Chosen Colorway</td>
            <td style="padding: 8px 0; font-size: 14px; font-weight: 800; color: #ffffff;">${shade}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 13px; color: rgba(255,255,255,0.5);">Outseam Calibration</td>
            <td style="padding: 8px 0; font-size: 13px; font-weight: 600; color: #a9ad87;">Deep Sneaker Stack Drape</td>
          </tr>
        </table>
      </div>

      <!-- Drop Perk Notice -->
      <div style="border-left: 3px solid #a9ad87; padding-left: 16px; margin-bottom: 32px;">
        <p style="margin: 0; font-size: 13px; font-weight: 700; color: #ffffff;">What happens next?</p>
        <p style="margin: 4px 0 0; font-size: 12px; line-height: 1.5; color: rgba(255,255,255,0.6);">
          When Drop #01 drops, waitlist members receive their private purchase link <strong>2 hours before</strong> the public announcement on Instagram. Strictly limited batch sizing.
        </p>
      </div>

      <!-- Slogan -->
      <p style="margin: 0; font-size: 13px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; color: #a9ad87;">
        More room. Better fits. Bigger vibes.
      </p>
      <p style="margin: 4px 0 0; font-size: 12px; color: rgba(255,255,255,0.4);">
        — The baggyHood Design Team
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #0b0d0c; border-top: 1px solid rgba(255,255,255,0.08); padding: 20px 32px; text-align: center;">
      <p style="margin: 0; font-size: 11px; color: rgba(255,255,255,0.4);">
        © 2026 baggyHood • <a href="https://www.baggyhood.in" style="color: #a9ad87; text-decoration: none; font-weight: 600;">www.baggyhood.in</a>
      </p>
      <p style="margin: 6px 0 0; font-size: 10px; color: rgba(255,255,255,0.3);">
        Built for the streets. Made for your fit.
      </p>
    </div>
  </div>
</body>
</html>
`
}
