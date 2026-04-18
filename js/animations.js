// ============================================
// ANIMATIONS JS - Intersection Observer + reveal
// ============================================

// --- REVEAL ON SCROLL ---
function initRevealAnimations() {
  // Animación de entrada para .reveal
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,         // 15% visible
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.reveal').forEach(element => {
    revealObserver.observe(element);
  });

  // Contador animado para stat-number
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5,
    rootMargin: '0px'
  });

  document.querySelectorAll('.stat-number[data-value]').forEach(stat => {
    statsObserver.observe(stat);
  });
}

// --- INIT ---
document.addEventListener('DOMContentLoaded', initRevealAnimations);
