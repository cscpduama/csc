# Security Policy

## Overview

The Department of Computer Science, Pandit Deendayal Upadhyaya Adarsha Mahavidyalaya (PDUAM), Amjonga takes the security of this project and its users seriously. We appreciate responsible disclosure of any vulnerabilities found in this repository or the live e-Portal.

---

## Supported Versions

Only the latest production deployment of the e-Portal is actively maintained and receives security updates.

| Version / Branch | Supported |
|---|---|
| `master` (latest) | ✅ Actively maintained |
| Older commits | ❌ Not supported |

---

## Reporting a Vulnerability

If you discover a security vulnerability in this project — including the website, data files, scripts, or any associated infrastructure — **please do NOT open a public GitHub issue.**

Instead, report it privately via one of the following:

| Channel | Contact |
|---|---|
| 📧 **Department Email** | [pduamcsc2017@gmail.com](mailto:pduamcsc2017@gmail.com) |
| 📧 **Developer Email** | [hello@sonajit.in](mailto:hello@sonajit.in) |

Please include **"SECURITY"** in the subject line of your email.

---

## What to Include in Your Report

To help us triage and resolve the issue quickly, please provide:

- A clear description of the vulnerability
- Steps to reproduce the issue
- The potential impact or severity
- Any proof-of-concept (PoC) if available
- Your name/handle (optional, for credit)

---

## Response Timeline

| Stage | Timeframe |
|---|---|
| **Acknowledgement** | Within 72 hours |
| **Initial Assessment** | Within 7 days |
| **Fix / Mitigation** | Depends on severity |
| **Public Disclosure** | After fix is deployed |

---

## Scope

The following are **in scope** for security reports:

- Live site at `https://csc.pduam.dpdns.org`
- This GitHub repository (`cscpduam-alt/csc`)
- Email notification system & subscriber data handling
- Any exposed API endpoints or serverless functions

The following are **out of scope**:

- GitHub platform itself (report to [GitHub Security](https://github.com/security))
- Third-party services (Google Sheets, Vercel, Gmail SMTP)
- Social engineering or phishing attacks targeting individuals
- Vulnerabilities in browsers or operating systems

---

## Responsible Disclosure

We follow a **responsible disclosure** policy. We ask that you:

- Give us reasonable time to investigate and fix the issue before any public disclosure
- Avoid accessing, modifying, or deleting data that does not belong to you
- Do not disrupt or degrade the service for other users

In return, we will:

- Acknowledge your contribution (if you wish)
- Work to resolve the issue promptly
- Keep you informed of progress

---

## Security Best Practices for Contributors

If you contribute to this project:

- Never commit secrets, API keys, tokens, or passwords to the repository
- Use `.env` files locally and GitHub Secrets for CI/CD workflows
- Keep dependencies updated and review changes carefully before pushing

---

*This security policy was last updated: May 2026*

*Department of Computer Science, PDUAM Amjonga · [pduamcsc2017@gmail.com](mailto:pduamcsc2017@gmail.com)*
