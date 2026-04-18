// ============================================
// MAIN JS - La Unión Americana
// Navbar adaptativa, scroll suave, mobile menu
// ============================================

// --- NAVBAR ADAPTATIVA ---
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 100);
        ticking = false;
      });
      ticking = true;
    }
  });
}

// --- SMOOTH SCROLLING PARA LINKS INTERNOS ---
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Cerrar menú mobile si está abierto
        const navMenu = document.querySelector('.nav-menu');
        navMenu?.classList.remove('active');
      }
    });
  });
}

// --- HAMBURGUESA MOBILE ---
function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');
  const closeBtns = document.querySelectorAll('.nav-link, .nav-cta button');

  toggle?.addEventListener('click', () => {
    menu?.classList.toggle('active');
  });

  // Cerrar el menú al hacer click en un link
  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      menu?.classList.remove('active');
    });
  });
}

// --- PARALLAX HERO ---
function initParallax() {
  const map = document.querySelector('.hero__map');
  if (!map) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const vh = window.innerHeight;
    if (scrollY < vh * 1.2) {
      map.style.transform = `translateY(${scrollY * 0.3}px)`;
    }
  });
}

// --- COUNTER ANIMADO PARA STAT-NUMBERS ---
function animateCounter(element) {
  const target = element.dataset.value;
  const duration = 2000;
  const start = 0;
  let startTime;

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const easedProgress = easeOutExpo(progress);
    const current = Math.round(start + (target - start) * easedProgress);

    // Formato con comas
    element.textContent = current.toLocaleString('es-LA') +
      (element.dataset.suffix || '') + '+';

    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  }

  window.requestAnimationFrame(step);
}

// --- LUCIDE ICONS ---
function loadIcons() {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initSmoothScroll();
  initMobileMenu();
  initParallax();
  loadIcons();
});
