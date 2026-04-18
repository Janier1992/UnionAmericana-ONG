// ============================================
// LA UNIÓN AMERICANA — Complete JavaScript
// Navbar, Animations, Map, Counters, Form
// ============================================

(function () {
  'use strict';

  // ——— NAVBAR ———
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          navbar.classList.toggle('scrolled', window.scrollY > 80);
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ——— MOBILE MENU ———
  function initMobileMenu() {
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('active');
      toggle.classList.toggle('active');
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    menu.querySelectorAll('.nav-link, .btn').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('active');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ——— SMOOTH SCROLLING ———
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', e => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const navH = document.getElementById('navbar')?.offsetHeight || 0;
          const y = target.getBoundingClientRect().top + window.scrollY - navH;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      });
    });
  }

  // ——— HERO PARALLAX ———
  function initParallax() {
    const map = document.getElementById('hero-map');
    if (!map) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          if (y < window.innerHeight * 1.2) {
            map.style.transform = `translateY(${y * 0.25}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ——— REVEAL ON SCROLL ———
  function initReveals() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // ——— ANIMATED COUNTERS ———
  function animateCounter(el) {
    const target = parseInt(el.dataset.value, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 2200;
    let start = null;

    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function step(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const current = Math.round(target * easeOutExpo(progress));

      if (target >= 1000) {
        el.textContent = current.toLocaleString('es-LA') + suffix + '+';
      } else {
        el.textContent = current + suffix + (target > 30 ? '+' : '');
      }

      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  function initCounters() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number[data-value]').forEach(el => observer.observe(el));
  }

  // ——— INTERACTIVE MAP ———
  function initMap() {
    const container = document.getElementById('map-container');
    const tooltip = document.getElementById('map-tooltip');
    if (!container || !tooltip) return;

    const pulsePoints = container.querySelectorAll('.pulse-point');

    pulsePoints.forEach(point => {
      point.addEventListener('mouseenter', e => {
        const label = point.dataset.label || '';
        tooltip.textContent = label;
        tooltip.classList.add('visible');

        const rect = container.getBoundingClientRect();
        const px = point.getBoundingClientRect();
        tooltip.style.left = (px.left - rect.left + px.width / 2) + 'px';
        tooltip.style.top = (px.top - rect.top - 35) + 'px';
        tooltip.style.transform = 'translateX(-50%)';
      });

      point.addEventListener('mouseleave', () => {
        tooltip.classList.remove('visible');
      });
    });

    // Hover on countries
    container.querySelectorAll('.country').forEach(country => {
      country.style.cursor = country.dataset.country ? 'pointer' : 'default';
      country.addEventListener('mouseenter', () => {
        if (country.dataset.country) {
          const label = country.dataset.country + ' — País Piloto';
          tooltip.textContent = label;
          tooltip.classList.add('visible');

          const rect = container.getBoundingClientRect();
          const bbox = country.getBoundingClientRect();
          tooltip.style.left = (bbox.left - rect.left + bbox.width / 2) + 'px';
          tooltip.style.top = (bbox.top - rect.top - 10) + 'px';
          tooltip.style.transform = 'translateX(-50%)';
        }
      });
      country.addEventListener('mouseleave', () => {
        tooltip.classList.remove('visible');
      });
    });
  }

  // ——— FORM VALIDATION ———
  function initForm() {
    const form = document.getElementById('unete-form');
    if (!form) return;

    const validators = {
      nombre: v => v.trim().length >= 2,
      email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      tipo: v => v !== ''
    };

    function validateField(field) {
      const group = field.closest('.form-group');
      if (!group) return true;
      const validator = validators[field.name];
      if (!validator) return true;

      const isValid = validator(field.value);
      group.classList.toggle('has-error', !isValid);
      return isValid;
    }

    // Real-time validation
    form.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        const group = field.closest('.form-group');
        if (group?.classList.contains('has-error')) validateField(field);
      });
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      let allValid = true;

      Object.keys(validators).forEach(name => {
        const field = form.querySelector(`[name="${name}"]`);
        if (field && !validateField(field)) allValid = false;
      });

      if (allValid) {
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = '¡Mensaje enviado! ✓';
        btn.style.background = 'var(--color-verde)';
        btn.disabled = true;

        setTimeout(() => {
          form.reset();
          form.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'));
          btn.textContent = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      }
    });
  }

  // ——— ACTIVE NAV LINK ON SCROLL ———
  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });

    sections.forEach(s => observer.observe(s));
  }

  // ——— INIT ALL ———
  document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initParallax();
    initReveals();
    initCounters();
    initMap();
    initForm();
    initActiveNav();
  });

})();
