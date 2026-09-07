/**
 * shared/components.js — Single Shared Component Handler
 * Injects original glassmorphism list drawer and dynamic header/footer
 */
(function () {
  'use strict';

  /* Theme Init Early */
  const SKEY = 'pduam-cs-theme';
  const html  = document.documentElement;

  function getSys() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(t) {
    html.setAttribute('data-theme', t);
    localStorage.setItem(SKEY, t);
    const lbl = document.getElementById('mobThemeLabel');
    if (lbl) lbl.textContent = t === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    const txt = document.getElementById('mobThemeText');
    if (txt) txt.textContent = t === 'dark' ? 'Light' : 'Dark';
    const gridTxt = document.getElementById('gridThemeText');
    if (gridTxt) gridTxt.textContent = t === 'dark' ? 'Switch to Light' : 'Switch to Dark';
  }

  applyTheme(localStorage.getItem(SKEY) || getSys());

  /* Detect Page */
  const seg  = window.location.pathname.split('/').filter(Boolean).pop() || 'index';
  const PAGE = seg.replace(/\.html?$/i, '') || 'index';
  const ac   = (href) => (href === PAGE || (PAGE === 'index' && href === 'index')) ? ' class="active"' : '';

  const HEADER_NAV_HTML = `
<!-- ════ HEADER ════ -->
<header>
  <div class="hdr-inner">
    <div class="hdr-logo">
      <img src="assets/logo/gov_logo.jpg" alt="PDUAM Logo" fetchpriority="high"/>
    </div>
    <div class="hdr-center">
      <div class="hdr-uni">Pandit Deendayal Upadhyaya Adarsha Mahavidyalaya, Amjonga</div>
      <div class="hdr-assamese">কম্পিউটাৰ বিজ্ঞান <span>বিভাগলৈ স্বাগতম</span></div>
      <div class="hdr-sub">e-Portal · Department of Computer Science · PDUAM, Amjonga, Assam</div>
      <div>
        <span class="hdr-tagline">
          <span class="live-dot"></span>প্রযুক্তিৰ পোহৰেৰে উদ্ভাসিত পৃথিৱী
        </span>
      </div>
    </div>
    <div class="hdr-logo hdr-logo-right">
      <img src="assets/logo/pduam-logo.jpg" alt="CS Dept Logo" fetchpriority="high"/>
    </div>
  </div>
</header>

<!-- ════ NAV ════ -->
<nav>
  <div class="nav-inner">
    <a href="index" class="nav-brand" style="text-decoration: none;">
      <i class="fa-solid fa-microchip"></i>
      <span class="nav-brand-desk">CS · PDUAM</span>
      <span class="nav-brand-mob">Dept. of Computer Science</span>
    </a>

    <ul class="nav-links">
      <li><a href="index"${ac('index')}><i class="fa-solid fa-house"></i> Home</a></li>
      <li><a href="mission"${ac('mission')}><i class="fa-solid fa-bullseye"></i> Mission</a></li>
      <li><a href="faculty"${ac('faculty')}><i class="fa-solid fa-chalkboard-user"></i> Faculty</a></li>
      <li><a href="students"${ac('students')}><i class="fa-solid fa-graduation-cap"></i> Students</a></li>
      <li><a href="gallery"${ac('gallery')}><i class="fa-solid fa-images"></i> Gallery</a></li>
      <li><a href="events"${ac('events')}><i class="fa-solid fa-calendar-days"></i> Events</a></li>
      <li><a href="alumni"${ac('alumni')}><i class="fa-solid fa-people-group"></i> Alumni</a></li>
      <li><a href="archives"${ac('archives')}><i class="fa-solid fa-box-archive"></i> Archives</a></li>
      <li><a href="publications"${ac('publications')}><i class="fa-solid fa-book"></i> Publications</a></li>
      <li><a href="tribute"${ac('tribute')}><i class="fa-solid fa-hand-holding-heart"></i> Tribute</a></li>
      <li><a href="contact"${ac('contact')}><i class="fa-solid fa-paper-plane"></i> Contact</a></li>
    </ul>

    <div class="nav-actions">
      <button class="theme-btn" id="themeBtn" aria-label="Toggle theme">
        <div class="toggle-track">
          <i class="fa-solid fa-sun track-sun"></i>
          <i class="fa-solid fa-moon track-moon"></i>
        </div>
        <div class="toggle-knob"></div>
      </button>
      <button class="nav-toggle" id="menuBtn" aria-label="Toggle menu" aria-expanded="false">
        <i class="fa-solid fa-bars" id="menuIcon"></i>
      </button>
    </div>
  </div>
</nav>

<!-- ════ MOBILE OVERLAY — LUXURY FULL-SCREEN GLASSMORPHISM CURTAIN ════ -->
<div class="mob-scrim" id="mobScrim"></div>
<div class="mob-overlay" id="mobOverlay" role="dialog" aria-modal="true" aria-label="Navigation menu">
  <div class="mob-head">
    <a href="index" class="mob-brand">
      <div class="mob-brand-icon"><img src="assets/logo/pduam-logo.jpg" alt="PDUAM Logo" class="mob-logo-img" /></div>
      <div class="mob-brand-title">
        <span>Department of Computer Science</span>
        <small>e-Portal</small>
      </div>
    </a>
    <div class="mob-head-actions">
      <button class="mob-theme-pill" id="themeBtnMob" aria-label="Toggle theme">
        <div class="theme-pill-track">
          <i class="fa-solid fa-sun track-sun"></i>
          <i class="fa-solid fa-moon track-moon"></i>
        </div>
      </button>
      <button class="mob-close-btn" id="mobClose" aria-label="Close menu">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  </div>

  <div class="mob-body">
    <div class="mob-nav-wrap">
      <div class="mob-sec-title">Navigation</div>
      <nav class="mob-nav-primary">
        <a href="index"${ac('index')} style="--delay: 0.03s">
          <div class="mob-link-left"><i class="fa-solid fa-house"></i><span>Home</span></div>
          <i class="fa-solid fa-chevron-right link-arrow"></i>
        </a>
        <a href="mission"${ac('mission')} style="--delay: 0.05s">
          <div class="mob-link-left"><i class="fa-solid fa-bullseye"></i><span>Mission & Vision</span></div>
          <i class="fa-solid fa-chevron-right link-arrow"></i>
        </a>
        <a href="faculty"${ac('faculty')} style="--delay: 0.07s">
          <div class="mob-link-left"><i class="fa-solid fa-chalkboard-user"></i><span>Faculty</span></div>
          <i class="fa-solid fa-chevron-right link-arrow"></i>
        </a>
        <a href="students"${ac('students')} style="--delay: 0.09s">
          <div class="mob-link-left"><i class="fa-solid fa-graduation-cap"></i><span>Student Corner</span></div>
          <i class="fa-solid fa-chevron-right link-arrow"></i>
        </a>
        <a href="contact"${ac('contact')} style="--delay: 0.11s">
          <div class="mob-link-left"><i class="fa-solid fa-paper-plane"></i><span>Contact Us</span></div>
          <i class="fa-solid fa-chevron-right link-arrow"></i>
        </a>
      </nav>

      <div class="mob-sec-title">Explore & Resources</div>
      <nav class="mob-nav-secondary">
        <a href="events"${ac('events')} style="--delay: 0.13s"><i class="fa-solid fa-calendar-days"></i><span>Events</span></a>
        <a href="gallery"${ac('gallery')} style="--delay: 0.15s"><i class="fa-solid fa-images"></i><span>Gallery</span></a>
        <a href="alumni"${ac('alumni')} style="--delay: 0.17s"><i class="fa-solid fa-people-group"></i><span>Alumni</span></a>
        <a href="publications"${ac('publications')} style="--delay: 0.19s"><i class="fa-solid fa-book"></i><span>Publications</span></a>
        <a href="archives"${ac('archives')} style="--delay: 0.21s"><i class="fa-solid fa-box-archive"></i><span>Archives</span></a>
        <a href="tribute"${ac('tribute')} style="--delay: 0.23s"><i class="fa-solid fa-hand-holding-heart"></i><span>Tribute</span></a>
      </nav>
    </div>

    <div class="mob-footer-hero">
      <div class="mob-footer-sub">
        Dept. of Computer Science · PDUAM Amjonga, Goalpara
      </div>
      <div class="mob-footer-email">
        <a href="mailto:csc@pduamamjonga.in">
          <i class="fa-solid fa-envelope"></i> csc@pduamamjonga.in
        </a>
      </div>
    </div>
  </div>
</div>`;
  const FOOTER_HTML = `
<!-- ════ FOOTER — REDESIGNED MODERN RESPONSIVE LAYOUT ════ -->
<footer>
  <div class="ftr-glow-line"></div>
  <div class="ftr-container">
    <!-- Main Footer Columns -->
    <div class="ftr-top-grid">
      <!-- Brand & Department Overview -->
      <div class="ftr-col ftr-col-brand">
        <div class="ftr-brand">
          <div class="ftr-brand-ico"><img src="assets/logo/pduam-logo.jpg" alt="PDUAM Logo" class="ftr-logo-img" /></div>
          <div class="ftr-brand-text">
            <h3>Dept. of Computer Science</h3>
            <p>PDUAM Amjonga, Goalpara</p>
          </div>
        </div>
        <p class="ftr-desc">
          Advancing academic excellence, digital innovation, and technical skill development for students in Goalpara and across Assam.
        </p>
        <div class="ftr-badges-wrap">
          <span class="ftr-badge"><i class="fa-solid fa-building-columns"></i> Govt. Model Degree College</span>
          <span class="ftr-badge ftr-badge-teal"><span class="live-dot"></span> NAAC Accredited B+ in 1st Cycle</span>
        </div>
        <div class="ftr-brand-contacts ftr-brand-contacts-desktop">
          <h4>Contact Us</h4>
          <div class="ftr-bc-item">
            <div class="ftr-email-boxes">
              <a href="mailto:csc@pduamamjonga.in" class="ftr-email-box">
                <i class="fa-solid fa-envelope"></i>
                <span>csc@pduamamjonga.in</span>
              </a>
              <a href="mailto:pduamcsc2017@gmail.com" class="ftr-email-box">
                <i class="fa-solid fa-envelope"></i>
                <span>pduamcsc2017@gmail.com</span>
              </a>
            </div>
          </div>
          <div class="ftr-bc-item">
            <i class="fa-solid fa-location-dot"></i>
            <a href="https://maps.app.goo.gl/WDbDdr6dqUqA9LVGA?g_st=aw" target="_blank" rel="noopener">Pandit Deendayal Upadhyaya Adarsha Mahavidyalaya, Amjonga, Goalpara, Assam – 783124</a>
          </div>
        </div>
      </div>

      <!-- Quick Links -->
      <div class="ftr-col">
        <h4>Navigation</h4>
        <ul class="ftr-links">
          <li><a href="index"><i class="fa-solid fa-house"></i>Home</a></li>
          <li><a href="mission"><i class="fa-solid fa-bullseye"></i>Mission & Vision</a></li>
          <li><a href="faculty"><i class="fa-solid fa-chalkboard-user"></i>Faculty</a></li>
          <li><a href="students"><i class="fa-solid fa-graduation-cap"></i>Student Corner</a></li>
          <li><a href="events"><i class="fa-solid fa-calendar-days"></i>Events</a></li>
          <li><a href="contact"><i class="fa-solid fa-paper-plane"></i>Contact Support</a></li>
        </ul>
      </div>

      <!-- Academic Resources -->
      <div class="ftr-col">
        <h4>Resources</h4>
        <ul class="ftr-links">
          <li><a href="routine"><i class="fa-solid fa-table-cells-large"></i>Class Routine</a></li>
          <li><a href="https://drive.google.com/drive/folders/14CjyuJb6DAtywFV9AIpFjaCYRcA6Yapg?usp=sharing" target="_blank" rel="noopener"><i class="fa-solid fa-book-open-reader"></i>GU Syllabus</a></li>
          <li><a href="https://gauhati.ac.in/media/notification/1734503844.pdf" target="_blank" rel="noopener"><i class="fa-solid fa-umbrella-beach"></i>Holiday List</a></li>
          <li><a href="gallery"><i class="fa-solid fa-images"></i>Photo Gallery</a></li>
          <li><a href="alumni"><i class="fa-solid fa-people-group"></i>Alumni's</a></li>
          <li><a href="publications"><i class="fa-solid fa-book"></i>Publications</a></li>
        </ul>
      </div>

      <!-- External Portals & Mobile Contact Us -->
      <div class="ftr-col ftr-col-useful">
        <div class="ftr-brand-contacts ftr-brand-contacts-mobile">
          <h4>Contact Us</h4>
          <div class="ftr-bc-item">
            <div class="ftr-email-boxes">
              <a href="mailto:csc@pduamamjonga.in" class="ftr-email-box">
                <i class="fa-solid fa-envelope"></i>
                <span>csc@pduamamjonga.in</span>
              </a>
              <a href="mailto:pduamcsc2017@gmail.com" class="ftr-email-box">
                <i class="fa-solid fa-envelope"></i>
                <span>pduamcsc2017@gmail.com</span>
              </a>
            </div>
          </div>
          <div class="ftr-bc-item">
            <i class="fa-solid fa-location-dot"></i>
            <a href="https://maps.app.goo.gl/WDbDdr6dqUqA9LVGA?g_st=aw" target="_blank" rel="noopener">Pandit Deendayal Upadhyaya Adarsha Mahavidyalaya, Amjonga, Goalpara, Assam – 783124</a>
          </div>
        </div>

        <h4>Useful Links</h4>
        <ul class="ftr-links">
          <li><a href="https://gauhati.ac.in/" target="_blank" rel="noopener"><i class="fa-solid fa-arrow-up-right-from-square"></i>Gauhati University</a></li>
          <li><a href="https://ahsec.assam.gov.in/" target="_blank" rel="noopener"><i class="fa-solid fa-arrow-up-right-from-square"></i>AHSEC Assam</a></li>
          <li><a href="https://darpan.ahseconline.in/" target="_blank" rel="noopener"><i class="fa-solid fa-arrow-up-right-from-square"></i>Darpan Portal</a></li>
          <li><a href="https://www.pduamamjonga.ac.in/department-details/83" target="_blank" rel="noopener"><i class="fa-solid fa-globe"></i>College Website</a></li>
        </ul>
      </div>
    </div>

    <div class="ftr-bottom">
      <div class="ftr-bottom-inner">
        <div class="ftr-copy">
          &copy; 2026 Department of Computer Science, PDUAM Amjonga. All Rights Reserved.
        </div>
        <div class="ftr-credits">
          <div class="ftr-credit-line-1">
            Developed by the <a href="faculty">Faculty of the Dept. of CS</a>, PDUAM, Amjonga
          </div>
          <div class="ftr-credit-line-2">
            Redesigned and improved by <a href="https://sonajit.in" target="_blank" rel="noopener">sOn4jit</a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <button class="float-top-btn" id="floatTopBtn" aria-label="Scroll to top">
    <i class="fa-solid fa-arrow-up"></i>
  </button>
</footer>`;

  function initComponents() {
    // 1. Replace existing <header>, <nav>, and mobile overlay with shared
    const existingHeader = document.querySelector('header');
    const existingNav = document.querySelector('nav');
    const existingOverlay = document.querySelector('.mob-overlay');
    const existingScrim = document.querySelector('.mob-scrim');

    if (existingHeader) {
      existingHeader.outerHTML = HEADER_NAV_HTML;
      if (existingNav) existingNav.remove();
      if (existingOverlay) existingOverlay.remove();
      if (existingScrim) existingScrim.remove();
    } else {
      const siteHdrSlot = document.getElementById('site-header');
      if (siteHdrSlot) siteHdrSlot.outerHTML = HEADER_NAV_HTML;
    }

    // 2. Replace existing <footer>
    const existingFooter = document.querySelector('footer');
    if (existingFooter) {
      existingFooter.outerHTML = FOOTER_HTML;
    } else {
      const siteFtrSlot = document.getElementById('site-footer');
      if (siteFtrSlot) siteFtrSlot.outerHTML = FOOTER_HTML;
    }

    // 3. Attach Theme & Mobile Nav Listeners
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem(SKEY)) applyTheme(e.matches ? 'dark' : 'light');
    });

    const toggleTheme = () => applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');

    document.getElementById('themeBtn')?.addEventListener('click', toggleTheme);
    document.getElementById('themeBtnMob')?.addEventListener('click', toggleTheme);
    document.getElementById('themeBtnMobCard')?.addEventListener('click', toggleTheme);

    // Floating Back to Top Button Listener
    const floatBtn = document.getElementById('floatTopBtn');
    if (floatBtn) {
      const toggleFloatBtn = () => {
        if (window.scrollY > 300) {
          floatBtn.classList.add('visible');
        } else {
          floatBtn.classList.remove('visible');
        }
      };
      window.addEventListener('scroll', toggleFloatBtn);
      toggleFloatBtn();
      floatBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    const menuBtn = document.getElementById('menuBtn');
    const overlay = document.getElementById('mobOverlay');
    const scrim   = document.getElementById('mobScrim');

    if (menuBtn && overlay && scrim) {
      const openMenu = () => {
        menuBtn.setAttribute('aria-expanded', 'true');
        overlay.classList.add('open');
        scrim.classList.add('open');
        document.body.style.overflow = 'hidden';
        const icon = document.getElementById('menuIcon');
        if (icon) icon.className = 'fa-solid fa-xmark';
      };

      const closeMenu = () => {
        menuBtn.setAttribute('aria-expanded', 'false');
        overlay.classList.remove('open');
        scrim.classList.remove('open');
        document.body.style.overflow = '';
        const icon = document.getElementById('menuIcon');
        if (icon) icon.className = 'fa-solid fa-bars';
      };

      menuBtn.addEventListener('click', () => overlay.classList.contains('open') ? closeMenu() : openMenu());
      document.getElementById('mobClose')?.addEventListener('click', closeMenu);
      scrim.addEventListener('click', closeMenu);
      overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
      document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initComponents);
  } else {
    initComponents();
  }
})();
