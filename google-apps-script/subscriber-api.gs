/**
 * Google Apps Script for PDUAM Subscriber Management
 */

const DEPT_NAME = "Dept. of Computer Science, PDUAM Amjonga";
const WEBSITE_URL = "https://csc.pduam.dpdns.org";

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Subscribers");
  let data;
  
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return createResponse({ status: "error", message: "Invalid JSON" });
  }

  const action = data.action || "subscribe";

  // New Token-Based Unsubscribe
  if (action === "unsubscribe_token") {
    const token = data.token;
    if (!token) return createResponse({ status: "error", message: "Token required" });

    const rows = sheet.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
      // Column D (index 3) is the token
      if (rows[i][3] && rows[i][3].toString() === token) {
        moveToUnsubscribed(sheet, i + 1, rows[i]);
        return createResponse({ status: "success", message: "Unsubscribed successfully" });
      }
    }
    return createResponse({ status: "not_found", message: "Invalid token" });
  }

  const email = data.email.toLowerCase().trim();
  const name = data.name || "Student";

  const rows = sheet.getDataRange().getValues();
  let foundIndex = -1;
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0].toString().toLowerCase() === email) {
      foundIndex = i + 1;
      break;
    }
  }

  // Legacy email-based unsubscribe
  if (action === "unsubscribe") {
    if (foundIndex > -1) {
      const rowData = sheet.getRange(foundIndex, 1, 1, 4).getValues()[0];
      moveToUnsubscribed(sheet, foundIndex, rowData);
      return createResponse({ status: "success", message: "Unsubscribed successfully" });
    } else {
      return createResponse({ status: "not_found", message: "Email not found" });
    }
  }

  if (foundIndex > -1) {
    return createResponse({ status: "exists", message: "Already subscribed" });
  }

  // Remove from Unsubscribers if resubscribing
  try {
    const unsubSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Unsubscribers");
    if (unsubSheet) {
      const unsubRows = unsubSheet.getDataRange().getValues();
      for (let j = 1; j < unsubRows.length; j++) {
        if (unsubRows[j][0].toString().toLowerCase() === email) {
          unsubSheet.deleteRow(j + 1);
          break; // Stop after first match
        }
      }
    }
  } catch (err) {
    console.warn("Cleanup Unsubscribers failed: " + err.toString());
  }

  const token = Utilities.getUuid();
  sheet.appendRow([email, name, new Date(), token]);
  
  try {
    sendWelcomeEmail(email, name, token);
  } catch (err) {
    console.error("Email failed: " + err.toString());
  }

  return createResponse({ status: "success", message: "Subscribed successfully" });
}

function sendWelcomeEmail(userEmail, name, token) {
  const subject = "You Have Successfully Subscribed to Dept. of Computer Science Notifications 🔔";
  const unsubUrl = `${WEBSITE_URL}/unsubscribe?token=${token}`;
  
  const htmlBody = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to CS Dept Notifications</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&family=Inter:wght@400;500&display=swap" rel="stylesheet">
    <style type="text/css">
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        table { border-collapse: collapse !important; }
        
        body, .wrapper-table { 
            margin: 0 !important; 
            padding: 0 !important;
            font-family: 'Outfit', 'Inter', sans-serif;
        }

        @media screen and (max-width: 600px) {
            .wrapper-table { padding: 20px 10px !important; }
            .main-container { border-radius: 20px !important; }
            .header-cell { padding: 35px 20px !important; }
            .body-cell { padding: 30px 20px !important; }
            .footer-cell { padding: 30px 20px !important; }
            .stack-mobile { display: block !important; width: 100% !important; margin: 4px 0 !important; }
            .hide-mobile { display: none !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" class="wrapper-table" style="padding: 40px 20px;">
        <tr>
            <td align="center">
                <!-- Main Card (Keep Corners Rounded) -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" class="main-container" style="max-width: 600px; background-color: #111827; border-radius: 24px; overflow: hidden; border: 1px solid #1e293b; box-shadow: 0 10px 30px rgba(0,0,0,0.15);">
                    
                    <!-- Header -->
                    <tr>
                        <td align="center" class="header-cell" style="background-color: #0d1321; padding: 45px 40px 30px; border-top: 4px solid #d4a843;">
                            <img src="${WEBSITE_URL}/assets/favicon/cs_department_logo.jpg" alt="Logo" width="80" style="display: block; border-radius: 50%; border: 2px solid #d4a843; margin-bottom: 15px;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; font-family: 'Outfit', sans-serif;">Dept. of Computer Science</h1>
                            <p style="margin: 4px 0 0 0; color: #7a8ba8; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;">PDUAM, AMJONGA</p>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td class="body-cell" style="padding: 40px 45px;">
                            <p style="margin: 0 0 15px 0; font-size: 18px; color: #ffffff; font-weight: 600; font-family: 'Outfit', sans-serif;">Hello <strong>${name}</strong>,</p>
                            <p style="margin: 0 0 25px 0; font-size: 15px; line-height: 1.6; color: #94a3b8; font-family: 'Inter', sans-serif;">
                                Thanks for subscribing to the department notification alerts. We are excited to have you on board!
                            </p>
                            
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #1a2236; border-left: 4px solid #d4a843; border-radius: 12px; margin-bottom: 25px;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <h3 style="margin: 0 0 15px 0; color: #d4a843; font-size: 14px; font-weight: 700; text-transform: uppercase; font-family: 'Outfit', sans-serif;">What You'll Receive:</h3>
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr><td style="padding-bottom: 8px; font-size: 14px; color: #e2e8f0; font-family: 'Inter', sans-serif;">📢&nbsp; Important Announcements</td></tr>
                                            <tr><td style="padding-bottom: 8px; font-size: 14px; color: #e2e8f0; font-family: 'Inter', sans-serif;">🚀&nbsp; Events and Workshops</td></tr>
                                            <tr><td style="padding-bottom: 8px; font-size: 14px; color: #e2e8f0; font-family: 'Inter', sans-serif;">📝&nbsp; Examination schedules</td></tr>
                                            <tr><td style="padding-bottom: 8px; font-size: 14px; color: #e2e8f0; font-family: 'Inter', sans-serif;">📁&nbsp; Assignment updates</td></tr>
                                            <tr><td style="font-size: 14px; color: #e2e8f0; font-family: 'Inter', sans-serif;">🏛️&nbsp; Department news</td></tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 0 0 30px 0; font-size: 15px; line-height: 1.6; color: #94a3b8; font-family: 'Inter', sans-serif;">
                                You will now receive real-time email alerts whenever a new update is posted.
                            </p>

                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <a href="${WEBSITE_URL}" target="_blank" style="display: inline-block; padding: 14px 28px; background-color: #d4a843; color: #000; text-decoration: none; font-size: 14px; font-weight: 700; border-radius: 10px; font-family: 'Outfit', sans-serif;">VISIT E-PORTAL</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" class="footer-cell" style="background-color: #0d1321; padding: 40px 45px; border-top: 1px solid #1a2236; text-align: center;">
                            <p style="margin: 0 0 8px 0; font-size: 13px; color: #ffffff; font-weight: 600; font-family: 'Outfit', sans-serif;">
                                © 2026 Department of Computer Science
                            </p>
                            <p style="margin: 0; font-size: 11px; color: #7a8ba8; font-family: 'Inter', sans-serif; line-height: 1.5;">
                                Pandit Deendayal Upadhyaya Adarsha Mahavidyalaya (PDUAM)<br>
                                Amjonga, Assam, India :: <a href="${WEBSITE_URL}" style="color: #d4a843; text-decoration: none; font-weight: 600;">cscpduam</a>
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

  MailApp.sendEmail({
    to: userEmail,
    subject: subject,
    htmlBody: htmlBody,
    name: "Dept. Of Computer Science PDUAM",
    replyTo: "pduamcsc2017@gmail.com"
  });
}

function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Subscribers");
  const email = (e.parameter.email || "").toLowerCase().trim();
  const token = e.parameter.token;
  const action = e.parameter.action || "check";

  const rows = sheet.getDataRange().getValues();

  // Check by Token
  if (token) {
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][3] && rows[i][3].toString() === token) {
        return createResponse({ status: "exists", email: rows[i][0] });
      }
    }
    return createResponse({ status: "not_found", message: "Invalid token" });
  }

  // Legacy Check by Email
  if (email) {
    let found = false;
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0].toString().toLowerCase() === email) {
        found = true;
        break;
      }
    }
    if (action === "check") {
      return createResponse({ status: found ? "exists" : "available" });
    }
  }

  return createResponse({ status: "ok", message: "API is active" });
}

function createResponse(result) {
  const out = ContentService.createTextOutput(JSON.stringify(result));
  out.setMimeType(ContentService.MimeType.JSON);
  return out;
}

function moveToUnsubscribed(sourceSheet, rowIndex, rowData) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let unsubSheet = ss.getSheetByName("Unsubscribers");
  
  // Create sheet if it doesn't exist
  if (!unsubSheet) {
    unsubSheet = ss.insertSheet("Unsubscribers");
    unsubSheet.appendRow(["Email", "Name", "Subscription Date", "Token", "Unsubscription Date"]);
    unsubSheet.getRange(1, 1, 1, 5).setFontWeight("bold").setBackground("#f3f3f3");
  }
  
  // Append user data + current timestamp
  const archiveData = [
    rowData[0], // Email
    rowData[1], // Name
    rowData[2], // Sub Date
    rowData[3], // Token
    new Date()  // Unsub Date
  ];
  
  unsubSheet.appendRow(archiveData);
  sourceSheet.deleteRow(rowIndex);
}