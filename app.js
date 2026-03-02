// ══════════════════════════════════════════════════════
// FIREBASE CONFIG — replace with YOUR values from:
// Firebase Console → Project Settings → SDK Setup → Config
// ══════════════════════════════════════════════════════
const firebaseConfig = {
  apiKey: "AIzaSyAJzDKnq3s_5ZIn-AiwLeQhPXyCjAvg0Bk",
  authDomain: "anand-portfolio-57781.firebaseapp.com",
  projectId: "anand-portfolio-57781",
  storageBucket: "anand-portfolio-57781.firebasestorage.app",
  messagingSenderId: "963512013772",
  appId: "1:963512013772:web:5e4027ca41e8ab5d3b0369"
};

// ── Firebase init ──
let db;
try {
  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
} catch(e) {
  console.error('Firebase init failed:', e);
}

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

// ── Nav — ALL flat links, no subfolders ──
function renderNav() {
  return `<nav>
    <a class="nav-logo" href="index.html">AES</a>
    <ul class="nav-links" id="navLinks">
      <li><a href="index.html">Home</a></li>
      <li><a href="about.html">About</a></li>
      <li><a href="skills.html">Skills</a></li>
      <li><a href="projects.html">Projects</a></li>
      <li><a href="experience.html">Experience</a></li>
      <li><a href="education.html">Education</a></li>
      <li><a href="travels.html">Travels</a></li>
      <li><a href="activities.html">Activities</a></li>
      <li><a href="volunteer.html">Volunteer</a></li>
      <li><a href="contact.html">Contact</a></li>
    </ul>
    <button class="nav-hamburger" id="navHamburger" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
  </nav>`;
}

// ── Fade observer ──
function reObserve() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('.fade-in:not(.visible)').forEach(el => obs.observe(el));
}

// ── initPage — called from every page ──
function initPage() {
  const mount = document.getElementById('navMount');
  if (mount) mount.innerHTML = renderNav();

  const ham   = document.getElementById('navHamburger');
  const links = document.getElementById('navLinks');
  if (ham && links) {
    ham.addEventListener('click', function(e) {
      e.stopPropagation();
      links.classList.toggle('open');
    });
    document.addEventListener('click', function(e) {
      if (!links.contains(e.target) && !ham.contains(e.target))
        links.classList.remove('open');
    });
  }

  // Highlight active link based on current filename
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href === current || (current === '' && href === 'index.html'))
      a.classList.add('active');
  });

  reObserve();
}
