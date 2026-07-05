<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:1a1a2e,50:16213e,100:d4a843&height=180&section=header&text=e-Portal&fontSize=52&fontColor=ffffff&fontAlignY=38&desc=Department%20of%20Computer%20Science%20·%20PDUAM%20Amjonga&descSize=16&descAlignY=58&descColor=d4a843&animation=fadeIn" width="100%"/>

</div>

<div align="center">

[![Live Site](https://img.shields.io/badge/🌐_Live_Site-csc.pduam.dpdns.org-d4a843?style=flat-square&labelColor=0d1117)](http://csc.pduam.dpdns.org)
[![GitHub](https://img.shields.io/badge/GitHub-cscpduam--alt-181717?style=flat-square&logo=github&labelColor=0d1117)](https://github.com/cscpduam-alt)
[![License](https://img.shields.io/badge/License-All_Rights_Reserved-e05252?style=flat-square&labelColor=0d1117)](./LICENSE)
[![Stars](https://img.shields.io/github/stars/cscpduam-alt/csc?style=flat-square&labelColor=0d1117&color=d4a843)](https://github.com/cscpduam-alt/csc/stargazers)
[![Last Commit](https://img.shields.io/github/last-commit/cscpduam-alt/csc?style=flat-square&labelColor=0d1117&color=2dd4bf)](https://github.com/cscpduam-alt/csc/commits/master)

</div>

---

> **Official e-Portal of the Department of Computer Science,**
> **Pandit Deendayal Upadhyaya Adarsha Mahavidyalaya (PDUAM), Amjonga, Assam.**
> A production-grade digital ecosystem for students, faculty, and alumni.

---

## 📋 Overview

This platform is the primary digital presence of the department, providing students and faculty with seamless access to:

- 📢 Department notices & real-time email notifications
- 👨‍🏫 Faculty profiles & directory
- 🎓 Alumni directory
- 📸 Gallery & event archives
- 📚 Academic resources — syllabi, question papers, notes & code repositories
- 📊 Vercel Performance Analytics & Speed Insights

---

## 💎 Key Features

### Design & UX
- **Glassmorphism UI** — sleek blurred surfaces with vibrant gradients
- **Dynamic Theme Engine** — system-aware dark/light mode with persistent state
- **Fluid Typography** — responsive text scaling across all devices
- **Progressive Image Loading** — blur-up effects and skeleton states to minimize layout shifts (CLS)

### 📡 Smart Notification Ecosystem
- **Real-time Email Alerts** — subscriber system powered by **Google Apps Script** and **Google Sheets API**
- **Dynamic OG Meta Generation** — Serverless Functions generate Open Graph tags for social sharing
- **Deep Linking** — direct routing to specific notifications with automated cache invalidation

### 📚 Student Corner (Resource Hub)
- **Academic Archives** — semester-wise GU syllabi, previous year question papers, handwritten notes
- **Code Repository** — Python, C++, C, HTML, JavaScript practicals via GitHub/Drive
- **Faculty Publications** — free access to textbooks authored by department faculty
- **Project Templates** — official BSc CS final-year project report templates (DOCX/PDF)

---

## ⚙️ Technical Architecture

Built with a **static-first architecture** focused on performance, SEO, and zero-maintenance hosting.

| Component | Technology |
|---|---|
| **Frontend** | HTML5, CSS3 (Vanilla), JavaScript (ES6+) |
| **Backend / API** | Vercel Serverless Functions (Node.js) |
| **Data Layer** | JSON-driven via `fetch()` — stored in `/data` |
| **Email Automation** | Google Apps Script + Google Sheets API |
| **Design System** | CSS variables, glassmorphism, dark/light mode |
| **Typography** | Inter & Noto Serif Bengali, responsive fluid scaling |
| **Hosting** | GitHub Pages → `cscpduam-alt.github.io/csc` |
| **Analytics** | Vercel Performance Analytics & Speed Insights |

---

## 🗂️ Project Structure

```
csc/
├── api/                        # Vercel Serverless Functions (OG tag generation)
├── index.html                  # Homepage — dynamic slideshow & live notices
├── students.html               # Student Corner / Resource Hub
├── *.html                      # Core pages (Faculty, Alumni, Gallery, etc.)
├── assets/
│   ├── favicon/                # Icons & logos
│   ├── images/                 # Static images
│   └── documents/              # Downloadable files
├── data/
│   ├── notifications.json      # Notice board content
│   ├── faculty.json            # Faculty directory
│   ├── alumni.json             # Alumni directory
│   └── index_images.json       # Homepage slideshow
├── google-apps-script/         # Subscriber API & email automation logic
├── .github/scripts/
│   └── send-notifications/     # Node.js mailer & GitHub Actions workflow
├── vercel.json                 # Deployment & routing configuration
└── LICENSE
```

---

## 🗃️ Data Management

To update dynamic content, **edit only the JSON files** in `/data` — no HTML changes needed.

| File | Controls |
|---|---|
| `data/notifications.json` | Homepage notice board & notifications page |
| `data/faculty.json` | Faculty directory & profiles |
| `data/alumni.json` | Alumni directory |
| `data/index_images.json` | Homepage dynamic slideshow |

---

## 🚀 Setup & Deployment

**Run locally:**
```bash
git clone https://github.com/cscpduam-alt/csc.git
cd csc
# Use VS Code Live Server or:
npx serve .
# Recommended to avoid CORS issues with local JSON fetching
```

**Deploy:**

The site is production-ready for any static hosting platform:

[![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-Ready-181717?style=flat-square&logo=githubpages)](https://cscpduam-alt.github.io/csc)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-Ready-F38020?style=flat-square&logo=cloudflare&logoColor=white)](https://pages.cloudflare.com)
[![Vercel](https://img.shields.io/badge/Vercel-Ready-000000?style=flat-square&logo=vercel)](https://vercel.com)
[![Netlify](https://img.shields.io/badge/Netlify-Ready-00C7B7?style=flat-square&logo=netlify&logoColor=white)](https://netlify.com)

---

## 🏆 Recent Milestones

- **Account Migration** — moved to `@cscpduam-alt` as active account while primary is under suspension & appeal
- **Domain Migration** — successfully transitioned to `csc.pduam.dpdns.org` infrastructure
- **Email Automation** — rebuilt notification mailer using Node.js + GitHub Actions + Gmail SMTP

---

## 📈 Repository Activity

<div align="center">

[![Star History Chart](https://api.star-history.com/svg?repos=cscpduam-alt/csc&type=Date&theme=dark)](https://star-history.com/#cscpduam-alt/csc&Date)

</div>

---

## 👥 Maintainers & Contributors

| Role | Person |
|---|---|
| **Owner** | Department of Computer Science, PDUAM Amjonga |
| **Concept & Supervision** | Faculty of the Dept. of Computer Science, PDUAM Amjonga |
| **Student Developer** | [sOn4jit](https://sonajit.in) · [hello@sonajit.in](mailto:hello@sonajit.in) |
| **Dept. Contact** | [pduamcsc2017@gmail.com](mailto:pduamcsc2017@gmail.com) |

<div align="center">

### Contributors

[![Contributors](https://contrib.rocks/image?repo=cscpduam-alt/csc)](https://github.com/cscpduam-alt/csc/graphs/contributors)

</div>

---

## 📄 License

© Department of Computer Science, Pandit Deendayal Upadhyaya Adarsha Mahavidyalaya (PDUAM), Amjonga. **All Rights Reserved.**

Unauthorized copying, modification, distribution, or use of this project, in whole or in part, is strictly prohibited without prior written permission from the department.

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:d4a843,50:16213e,100:1a1a2e&height=100&section=footer" width="100%"/>

*© 2026 Department of Computer Science, PDUAM Amjonga · All Rights Reserved*

</div>