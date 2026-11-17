'use client';

import { useEffect, useRef } from 'react';

function animateCounter(element: HTMLElement, target: number) {
  const duration = 2000;
  const start = 0;
  let startTime: number | null = null;

  const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

  const step = (timestamp: number) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const easedProgress = easeOutExpo(progress);
    const current = Math.round(start + (target - start) * easedProgress);

    element.textContent = current.toLocaleString('es-LA') + '+';

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
}

export default function Impact() {
  const statsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target instanceof HTMLElement) {
          const value = parseInt(entry.target.dataset.value || '0', 10);
          animateCounter(entry.target, value);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statsRef.current.forEach((stat) => {
      if (stat) observer.observe(stat);
    });

    return () => observer.disconnect();
  }, []);

  const stats = [
    { value: 500000, label: 'Personas asistidas en crisis' },
    { value: 100000, label: 'Talentos apoyados' },
    { value: 25, label: 'Biofactorías operativas' },
    { value: 20, label: 'Países integrados' },
  ];

  return (
    <section className="ld-section" id="proyecciones">
      <div className="ld-container">
        <div className="ld-head ld-head--row">
          <div>
            <p className="ld-overline">Hacia el futuro</p>
            <h2 className="ld-h2">Proyecciones 2040</h2>
          </div>
          <p className="ld-head__note">
            No mediremos nuestro éxito por la cantidad de ayuda que damos, sino por la cantidad de comunidades que
            ya no la necesiten.
          </p>
        </div>

        <div className="ld-stats">
          {stats.map((stat, i) => (
            <div className="ld-stat" key={stat.label}>
              <div
                className="ld-stat__num"
                ref={(el) => { statsRef.current[i] = el; }}
                data-value={stat.value}
              >
                0
              </div>
              <div className="ld-stat__label">{stat.label}</div>
            </div>
          ))}
        </div>
        <p className="ld-foot-note">Cifras proyectadas a 2040, no resultados actuales.</p>
      </div>
    </section>
  );
}
