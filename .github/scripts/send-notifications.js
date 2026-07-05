'use strict';

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const fs            = require('fs');
const path          = require('path');
const nodemailer    = require('nodemailer');
const { google }    = require('googleapis');

const ROOT            = path.resolve(__dirname, '../../');
const NOTIFICATIONS   = path.join(ROOT, 'data', 'notifications.json');
const EVENTS          = path.join(ROOT, 'data', 'events.json');
const SENT_IDS_FILE   = path.join(__dirname, 'sent-ids.json');

const GMAIL_USER         = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const CUSTOM_FROM_EMAIL  = process.env.CUSTOM_FROM_EMAIL || GMAIL_USER;
const GOOGLE_SHEET_ID    = process.env.GOOGLE_SHEET_ID;
const GOOGLE_SERVICE_JSON= process.env.GOOGLE_SERVICE_JSON;
const SITE_URL           = (process.env.SITE_URL || 'https://csc.pduam.dpdns.org').replace(/\/$/, '');
const REPLY_TO_EMAIL     = process.env.REPLY_TO_EMAIL || CUSTOM_FROM_EMAIL;

const SENDER_NAME = "Dept. Of Computer Science PDUAM";

/* ── Validate env ── */
function checkEnv() {
  const missing = [
    'GMAIL_USER',
    'GMAIL_APP_PASSWORD',
    'CUSTOM_FROM_EMAIL',
    'GOOGLE_SHEET_ID',
    'GOOGLE_SERVICE_JSON',
  ].filter(k => !process.env[k]);
  if (missing.length) {
    console.error('❌  Missing required secrets:', missing.join(', '));
    process.exit(1);
  }
}

/* ── Helper: Format Date ── */
function fmtDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  } catch (e) {
    return iso;
  }
}

/* ── Helper: Generate Google Calendar Link ── */
function generateCalendarLink(event) {
  const title = encodeURIComponent(event.title);
  const details = encodeURIComponent(event.description || '');
  const location = encodeURIComponent(event.location || '');
  
  // Format date for GCal (YYYYMMDD)
  const dateStr = event.date.replace(/-/g, '');
  const start = `${dateStr}T090000Z`;
  const end = `${dateStr}T110000Z`;
  
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
}

/* ── Load Data ── */
function loadData(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌  File not found: ${filePath}`);
    return [];
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

/* ── Load / save sent IDs ── */
function loadSentIds() {
  if (!fs.existsSync(SENT_IDS_FILE)) return [];
  try { return JSON.parse(fs.readFileSync(SENT_IDS_FILE, 'utf8')); }
  catch { return []; }
}
function saveSentIds(ids) {
  fs.writeFileSync(SENT_IDS_FILE, JSON.stringify(ids, null, 2));
}

/* ── Fetch subscribers from Google Sheet ── */
async function fetchSubscribers() {
  let credentials;
  try {
    credentials = JSON.parse(GOOGLE_SERVICE_JSON);
  } catch (err) {
    throw new Error('Failed to parse GOOGLE_SERVICE_JSON. Please verify it is a valid JSON string.');
  }

  if (!credentials || !credentials.private_key) {
    throw new Error('Invalid service account credentials: missing private_key.');
  }

  credentials.private_key = credentials.private_key.replace(/\\n/g, '\n').replace(/\r/g, '\nr');

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  const sheets = google.sheets({ version: 'v4', auth });
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: GOOGLE_SHEET_ID,
    range: 'Subscribers!A:D',
  });
  const rows = response.data.values || [];
  if (rows.length <= 1) { console.log('ℹ️   No subscribers found.'); return []; }
  const subscribers = rows.slice(1)
    .filter(row => row[0] && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row[0].trim()))
    .map(row => ({
      email: row[0].trim(),
      name:  (row[1] || '').trim() || 'Student',
      token: row[3] || '', // UUID token in Column D
    }));
  console.log(`✅  Found ${subscribers.length} subscriber(s)`);
  return subscribers;
}

/* ── Build HTML email ── */
function buildEmailHTML(item, subscriberName, subscriberEmail, subscriberToken, isEvent = false) {
  const date = item.date ? fmtDate(item.date) : '';
  const unsubUrl = `${SITE_URL}/unsubscribe?token=${subscriberToken}`;
  const shareUrl = isEvent ? `${SITE_URL}/api/events/share?id=${item.id}` : `${SITE_URL}/api/notifications/share?id=${item.id}`;
  const calendarLink = isEvent ? generateCalendarLink(item) : null;
  
  // Favicon Path (Updated)
  const logoUrl = `${SITE_URL}/assets/favicon/cs_department_logo.jpg`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&family=Inter:wght@400;500&display=swap" rel="stylesheet">
  <style>
    body { margin: 0; padding: 0; font-family: 'Outfit', 'Inter', sans-serif; }
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; padding: 10px !important; }
      .content { padding: 30px 20px !important; }
      .footer { padding: 30px 20px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding: 40px 0;">
    <tr>
      <td align="center">
        <table class="container" width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #111827; border-radius: 24px; overflow: hidden; border: 1px solid #1e293b; box-shadow: 0 10px 30px rgba(0,0,0,0.15);">
          
          <!-- Header Card -->
          <tr>
            <td style="background-color: #0d1321; padding: 45px 40px 35px; text-align: center; border-top: 4px solid #d4a843;">
              <div style="margin-bottom: 18px;">
                <img src="${logoUrl}" width="80" height="80" alt="Logo" style="border-radius: 50%; border: 2px solid #d4a843;">
              </div>
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.01em; font-family: 'Outfit', sans-serif;">Dept. of Computer Science</h1>
              <p style="color: #7a8ba8; margin: 6px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.12em; font-weight: 600;">PDUAM, AMJONGA</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content" style="padding: 40px 45px;">
              <p style="color: #ffffff; margin: 0 0 18px; font-size: 18px; font-weight: 600; font-family: 'Outfit', sans-serif;">Hello <strong>${subscriberName}</strong>,</p>
              <p style="color: #94a3b8; margin: 0 0 30px; font-size: 15px; line-height: 1.7; font-family: 'Inter', sans-serif;">
                ${isEvent ? 'A new upcoming event has been scheduled in the Department of Computer Science.' : 'A new notification has been posted on the e-Portal.'}
              </p>
              
              <!-- Notification/Event Detail -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; overflow: hidden; background-color: #1a2236; border-left: 4px solid #d4a843;">
                <tr>
                  <td style="padding: 25px;">
                    <div style="margin-bottom: 15px;">
                      <span style="background-color: #d4a843; color: #000000; padding: 4px 12px; border-radius: 99px; font-size: 11px; text-transform: uppercase; font-weight: 800;">${isEvent ? 'UPCOMING EVENT' : (item.category || 'NOTICE').toUpperCase()}</span>
                    </div>
                    <h2 style="color: #ffffff; margin: 0 0 12px; font-size: 20px; font-weight: 700; line-height: 1.4; font-family: 'Outfit', sans-serif;">${item.title}</h2>
                    <p style="color: #94a3b8; margin: 0 0 20px; font-size: 14px; line-height: 1.6; font-family: 'Inter', sans-serif;">${isEvent ? item.description : item.text}</p>
                    
                    <table border="0" cellspacing="0" cellpadding="0">
                       ${date ? `<tr><td style="color: #7a8ba8; font-size: 13px; padding-bottom: 4px;">📅 ${date}</td></tr>` : ''}
                       ${isEvent && item.time ? `<tr><td style="color: #7a8ba8; font-size: 13px; padding-bottom: 4px;">⏰ ${item.time}</td></tr>` : ''}
                       ${isEvent && item.location ? `<tr><td style="color: #7a8ba8; font-size: 13px;">📍 ${item.location}</td></tr>` : ''}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Action Buttons -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 35px;">
                <tr>
                  <td align="center">
                    <a href="${shareUrl}" style="background-color: #d4a843; color: #000000; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block; font-family: 'Outfit', sans-serif; margin-bottom: 10px;">${isEvent ? 'View Event Details' : 'View Full Notification'}</a>
                    ${isEvent ? `<div style="margin-top: 15px;"><a href="${calendarLink}" style="display: inline-flex; align-items: center; background-color: #1a2236; border: 1px solid #2dd4bf; color: #2dd4bf; padding: 10px 24px; border-radius: 99px; text-decoration: none; font-weight: 700; font-size: 13px; font-family: 'Outfit', sans-serif;"><span style="margin-right: 8px; font-size: 16px;">G</span> Add to Calendar</a></div>` : ''}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer (Updated) -->
          <tr>
            <td class="footer" style="background-color: #0d1321; padding: 40px 45px; border-top: 1px solid #1a2236; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 13px; color: #ffffff; font-weight: 600; font-family: 'Outfit', sans-serif;">
                © 2026 Department of Computer Science
              </p>
              <p style="margin: 0; font-size: 11px; color: #7a8ba8; font-family: 'Inter', sans-serif; line-height: 1.5;">
                Pandit Deendayal Upadhyaya Adarsha Mahavidyalaya (PDUAM)<br>
                Amjonga, Assam, India :: <a href="${SITE_URL}" style="color: #d4a843; text-decoration: none; font-weight: 600;">cscpduam</a>
              </p>
              
              <p style="margin: 20px 0 10px; font-size: 10px; color: #4b5563; line-height: 1.6; font-family: 'Inter', sans-serif;">
                You are receiving this because you opted into e-Portal notifications.<br>
                You subscribed to these alerts. <a href="${unsubUrl}" style="color: #4b5563; text-decoration: underline;">Unsubscribe</a>
              </p>
              
              <div style="font-size: 11px; color: #4b5563; font-family: 'Inter', sans-serif; margin-top: 15px;">
                <span style="display: inline-block; margin: 4px 0;">Support: <a href="mailto:csc-queries@sonajit.in" style="color: #2dd4bf; text-decoration: none; font-weight: 600;">csc-queries@sonajit.in</a></span>
                <span style="margin: 0 10px; opacity: 0.3;">|</span>
                <span style="display: inline-block; margin: 4px 0;">Dept: <a href="mailto:pduamcsc2017@gmail.com" style="color: #2dd4bf; text-decoration: none; font-weight: 600;">pduamcsc2017@gmail.com</a></span>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/* ── Helper: Mask Email for Privacy ── */
function maskEmail(email) {
  const [user, domain] = email.split('@');
  if (!user || !domain) return '***';
  const maskedUser = user.length > 2 ? user[0] + '***' + user[user.length - 1] : user[0] + '***';
  return `${maskedUser}@${domain}`;
}

/* ── Send emails ── */
async function sendEmails(items, subscribers, isEvent = false) {
  const transporter = nodemailer.createTransport({
    host:   'smtp.gmail.com',
    port:   587,
    secure: false,
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD,
    },
  });

  await transporter.verify();
  console.log('📧  Gmail SMTP verified');

  let sentCount = 0;

  for (const item of items) {
    console.log(`\n📢  Sending ${isEvent ? 'Event' : 'Notification'}: "${item.title}"`);

    for (const subscriber of subscribers) {
      try {
        await transporter.sendMail({
          from:    `"${SENDER_NAME}" <${CUSTOM_FROM_EMAIL}>`,
          to:      subscriber.email,
          subject: `${isEvent ? '📅 Upcoming Event: ' : '📢 '}${item.title} — PDUAM CS Dept.`,
          html:    buildEmailHTML(item, subscriber.name, subscriber.email, subscriber.token, isEvent),
          replyTo: `"${SENDER_NAME}" <${REPLY_TO_EMAIL}>`,
        });
        sentCount++;
        await new Promise(r => setTimeout(r, 200));
      } catch (err) {
        console.error(`   ❌  Failed for ${subscriber.email}:`, err.message);
      }
    }
  }

  return sentCount;
}

/* ── MAIN ── */
async function main() {
  console.log('🚀  PDUAM Notification Mailer starting…\n');
  checkEnv();

  const notifications = loadData(NOTIFICATIONS);
  const events        = loadData(EVENTS);
  const sentIds       = loadSentIds();

  // Filter new Notifications
  const newNotifications = notifications.filter(n =>
    n.isNew === true && !sentIds.includes(String(n.id))
  );

  // Filter new Events
  const newEvents = events.filter(e =>
    e.isNew === true && !sentIds.includes(String(e.id))
  );

  if (newNotifications.length === 0 && newEvents.length === 0) {
    console.log('\nℹ️   No new items to send. Exiting.');
    process.exit(0);
  }

  const subscribers = await fetchSubscribers();
  if (subscribers.length === 0) {
    console.log('ℹ️   No subscribers yet. Marking as sent and exiting.');
    const allNewIds = [...newNotifications, ...newEvents].map(item => String(item.id));
    saveSentIds([...new Set([...sentIds, ...allNewIds])]);
    process.exit(0);
  }

  let totalSent = 0;

  if (newNotifications.length > 0) {
    console.log(`✨  New notifications: ${newNotifications.length}`);
    totalSent += await sendEmails(newNotifications, subscribers, false);
  }

  if (newEvents.length > 0) {
    console.log(`✨  New events: ${newEvents.length}`);
    totalSent += await sendEmails(newEvents, subscribers, true);
  }

  // Save updated IDs
  const allSentIds = [...newNotifications, ...newEvents].map(item => String(item.id));
  saveSentIds([...new Set([...sentIds, ...allSentIds])]);

  console.log(`\n🎉  Done! Sent ${totalSent} total email(s).`);
}

main().catch(err => {
  console.error('\n❌  Fatal error:', err.message);
  process.exit(1);
});