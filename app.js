// ══════════════════════════════════════════════════════
// FIREBASE CONFIG — replace with YOUR values from:
// Firebase Console → Project Settings → SDK Setup → Config
// ══════════════════════════════════════════════════════
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// ── Firebase init ──
let db;
(function initFirebase() {
  if (typeof firebase === 'undefined') {
    console.error('Firebase SDK not loaded. Check your script tags.');
    return;
  }
  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
})();

// ── Firestore helpers ──
async function getSiteData(section) {
  if (!db) return null;
  try {
    const doc = await db.collection('siteData').doc(section).get();
    return doc.exists ? doc.data() : null;
  } catch(e) { console.warn('getSiteData:', e); return null; }
}
async function setSiteData(section, data) {
  if (!db) return false;
  try {
    await db.collection('siteData').doc(section).set(data, { merge: true });
    return true;
  } catch(e) { console.warn('setSiteData:', e); return false; }
}

// ── Auth ──
const AUTH_KEY   = 'aes_admin_auth';
const AUTH_TOKEN = 'appu_logged_in_2024';
function setAdminLoggedIn()  { sessionStorage.setItem(AUTH_KEY, AUTH_TOKEN); }
function clearAdminSession() { sessionStorage.removeItem(AUTH_KEY); }
function isAdminLoggedIn()   { return sessionStorage.getItem(AUTH_KEY) === AUTH_TOKEN; }

// ── Toast ──
function showToast(msg, isError) {
  let t = document.getElementById('_toast');
  if (!t) { t = document.createElement('div'); t.id = '_toast'; t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.style.background = isError ? 'var(--accent2)' : 'var(--accent)';
  t.style.color = isError ? '#fff' : '#050508';
  t.classList.add('show');
  clearTimeout(t._hideTimer);
  t._hideTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

// ── Nav HTML ──
function renderNav(root) {
  root = root || '';
  return `<nav>
    <a class="nav-logo" href="${root}index.html">AES</a>
    <ul class="nav-links" id="navLinks">
      <li><a href="${root}index.html">Home</a></li>
      <li><a href="${root}pages/about.html">About</a></li>
      <li><a href="${root}pages/skills.html">Skills</a></li>
      <li><a href="${root}pages/projects.html">Projects</a></li>
      <li><a href="${root}pages/experience.html">Experience</a></li>
      <li><a href="${root}pages/education.html">Education</a></li>
      <li><a href="${root}pages/travels.html">Travels</a></li>
      <li><a href="${root}pages/activities.html">Activities</a></li>
      <li><a href="${root}pages/contact.html">Contact</a></li>
    </ul>
    <button class="nav-hamburger" id="navHamburger" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
  </nav>`;
}

// ── Fade-in observer (exported so pages can call after dynamic render) ──
function reObserve() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('.fade-in:not(.visible)').forEach(el => obs.observe(el));
}

// ── initPage — called from inline script at bottom of each page ──
function initPage(root) {
  root = root || '';

  // Inject nav
  const mount = document.getElementById('navMount');
  if (mount) mount.innerHTML = renderNav(root);

  // Hamburger toggle
  const ham   = document.getElementById('navHamburger');
  const links = document.getElementById('navLinks');
  if (ham && links) {
    ham.addEventListener('click', function(e) {
      e.stopPropagation();
      links.classList.toggle('open');
    });
    document.addEventListener('click', function(e) {
      if (!links.contains(e.target) && !ham.contains(e.target)) {
        links.classList.remove('open');
      }
    });
  }

  // Highlight active nav link
  const path = location.pathname;
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href') || '';
    // strip leading ../ or ./
    const clean = href.replace(/^\.\.\//,'').replace(/^\.\//,'');
    if (path.endsWith(clean)) a.classList.add('active');
  });

  // Initial fade-in
  reObserve();
}
