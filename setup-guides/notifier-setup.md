# 🔔 PDUAM CS Dept - Notification Mailer Setup Guide

This guide covers how to set up the automated notification system that sends emails to students whenever `data/notifications.json` or `data/events.json` are updated.

---

## 1. Google Sheets (The Subscriber Database)
1.  Create a new Google Sheet named **"PDUAM Subscribers"**.
2.  Rename the first tab (at the bottom) to exactly **"Subscribers"**.
3.  In Row 1, add these headers: `Email`, `Name`, `Subscribed At`.
4.  Keep the **Spreadsheet ID** (the long string in the URL between `/d/` and `/edit`).

---

## 2. Google Apps Script (The Subscription API)
1.  In your Google Sheet, go to **Extensions > Apps Script**.
2.  Paste the code from [google-apps-script/subscriber-api.gs](google-apps-script/subscriber-api.gs).
3.  Click **Deploy > New Deployment**.
4.  Set:
    *   **Type**: Web App
    *   **Execute as**: Me (your email)
    *   **Who has access**: Anyone
5.  **Authorize**: Click through the "Advanced" prompts to allow the script to manage your sheets and send emails.
6.  **Copy the Web App URL**: You'll need this for your website frontend.

---

## 3. Google Cloud Service Account (The "Key" for GitHub)
To allow GitHub to read your subscribers list securely, you need a Service Account.

1.  Go to [Google Cloud Console](https://console.cloud.google.com/).
2.  **Create a Project** (if you don't have one).
3.  Go to **APIs & Services > Library** and enable **"Google Sheets API"**.
4.  Go to **APIs & Services > Credentials**.
5.  Click **Create Credentials > Service Account**.
    *   Give it a name (e.g., `github-mailer`).
    *   Skip the optional roles.
6.  Once created, click the service account email. Go to the **Keys** tab.
7.  Click **Add Key > Create New Key > JSON**.
8.  **Download the JSON file**. This is your `GOOGLE_SERVICE_JSON`.
9.  **IMPORTANT**: Open your Google Sheet, click **Share**, and invite the service account email (e.g., `github-mailer@project.iam.gserviceaccount.com`) as a **Viewer**.

---

## 4. Gmail Setup (The Sender)
1.  Go to your Google Account settings > Security.
2.  Enable **2-Step Verification**.
3.  Search for **"App Passwords"**.
4.  Create a new one for "Mail" on "Other (Custom Name)".
5.  Copy the **16-character code** (e.g., `xxxx xxxx xxxx xxxx`).

---

## 5. GitHub Secrets (Connecting Everything)
Go to your GitHub Repository > **Settings > Secrets and variables > Actions**. Add the following **New repository secrets**:

| Secret Name | Description |
| :--- | :--- |
| `GMAIL_USER` | Your full Gmail address (e.g., `dept@gmail.com`). |
| `GMAIL_APP_PASSWORD` | The 16-character App Password you generated. |
| `CUSTOM_FROM_EMAIL` | (Recommended) Same as GMAIL_USER, or your verified alias. |
| `REPLY_TO_EMAIL` | The email where you want to receive replies (e.g., `csc-queries@sonajit.in`). |
| `GOOGLE_SHEET_ID` | The long ID from your Google Sheet URL. |
| `GOOGLE_SERVICE_JSON` | The **entire content** of the JSON file you downloaded from Google Cloud. |
| `SITE_URL` | Your website URL (e.g., `https://csc.pduam.dpdns.org`). |

---

## 6. How to Trigger a Notification
1.  Add a new entry to `data/notifications.json` or `data/events.json`.
2.  Ensure you add `"isNew": true` to the new item.
3.  Commit and Push the changes to GitHub.
4.  GitHub Actions will automatically pick it up, send the emails, and then automatically change `isNew` to false in a follow-up commit to prevent duplicate sends.

---

## ⚠️ Troubleshooting
*   **"Permission Denied"**: Make sure you shared your Google Sheet with the Service Account email.
*   **"Authentication Failed"**: Double check your GMAIL_APP_PASSWORD (no spaces needed when pasting).
*   **Emails not sending**: Check the **Actions** tab in GitHub to see the logs and error messages.
