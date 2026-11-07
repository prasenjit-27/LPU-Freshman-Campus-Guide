import https from "https";

// Create custom agent with fallback for corporate / dev proxies or firewalls if necessary
const httpsAgent = new https.Agent({
  rejectUnauthorized: process.env.NODE_TLS_REJECT_UNAUTHORIZED !== "0",
});

/**
 * Send an email via Brevo's official Transactional Email API v3
 * Falls back safely to console logging when BREVO_API_KEY is not configured or network request fails
 * @param {Object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.toName - Recipient full name
 * @param {string} options.subject - Email subject line
 * @param {string} options.htmlContent - Formatted HTML email body
 * @param {string} [options.textContent] - Plain text version
 */
export async function sendBrevoEmail({ to, toName, subject, htmlContent, textContent }) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey || apiKey === "your-brevo-api-key") {
    console.log("\n=======================================================");
    console.log(`[TRANSACTIONAL EMAIL - LOCAL DEV SIMULATOR]`);
    console.log(`To: ${to} (${toName || "Student"})`);
    console.log(`Subject: ${subject}`);
    console.log(`Content:\n${textContent || subject}`);
    console.log("=======================================================\n");
    return { ok: true, devMode: true };
  }

  const senderEmail = process.env.BREVO_SENDER_EMAIL || "coding.prasenjit@gmail.com";
  const senderName = process.env.BREVO_SENDER_NAME || "LPU Freshman Guide";

  const payload = JSON.stringify({
    sender: {
      name: senderName,
      email: senderEmail,
    },
    to: [
      {
        email: to,
        name: toName || to.split("@")[0],
      },
    ],
    subject,
    htmlContent,
    textContent: textContent || subject,
  });

  return new Promise((resolve) => {
    const req = https.request(
      "https://api.brevo.com/v3/smtp/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
          "Content-Length": Buffer.byteLength(payload),
        },
        agent: httpsAgent,
        timeout: 5000,
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(JSON.parse(data));
            } catch {
              resolve({ ok: true, data });
            }
          } else {
            console.warn(`[Brevo API Notice]: status ${res.statusCode}. Logging email locally for seamless access.`);
            console.log(`[LOCAL EMAIL DISPATCH - ${to}]: ${subject}\n${textContent || subject}`);
            resolve({ ok: true, fallback: true });
          }
        });
      }
    );

    req.on("error", (err) => {
      console.warn(`[Brevo Network Notice]: ${err.message}. Logging email locally for seamless access.`);
      console.log(`[LOCAL EMAIL DISPATCH - ${to}]: ${subject}\n${textContent || subject}`);
      resolve({ ok: true, fallback: true });
    });

    req.on("timeout", () => {
      req.destroy();
      console.warn("[Brevo Timeout Notice]: Logging email locally for seamless access.");
      console.log(`[LOCAL EMAIL DISPATCH - ${to}]: ${subject}\n${textContent || subject}`);
      resolve({ ok: true, fallback: true });
    });

    req.write(payload);
    req.end();
  });
}
