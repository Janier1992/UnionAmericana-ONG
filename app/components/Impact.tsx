'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <>
      <div className="section-divider" />

      <section className="section impacto" id="proyecciones">
        <div className="container">
          <motion.div 
            className="impacto__header"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <p className="overline">Hacia el Futuro</p>
            <h2>Proyecciones<br /><em>2040</em></h2>
            <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.7)', maxWidth: '600px' }}>
              No mediremos nuestro éxito por la cantidad de ayuda que damos, sino por la cantidad de comunidades que ya no la necesiten. Estas son nuestras proyecciones para transformar el continente.
            </p>
          </motion.div>

          <motion.div 
            className="impacto__grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div 
              className="impacto__stat"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}
            >
              <motion.div className="stat-large" variants={cardVariants}>
                <div className="stat-number" ref={(el) => { statsRef.current[0] = el; }} data-value="500000">0</div>
                <div className="stat-label">Personas asisitidas en crisis</div>
              </motion.div>
              <motion.div className="stat-large" variants={cardVariants}>
                <div className="stat-number" ref={(el) => { statsRef.current[1] = el; }} data-value="100000">0</div>
                <div className="stat-label">Talentos apoyados</div>
              </motion.div>
              <motion.div className="stat-large" variants={cardVariants}>
                <div className="stat-number" ref={(el) => { statsRef.current[2] = el; }} data-value="25">0</div>
                <div className="stat-label">Biofactorías operativas</div>
              </motion.div>
              <motion.div className="stat-large" variants={cardVariants}>
                <div className="stat-number" ref={(el) => { statsRef.current[3] = el; }} data-value="20">0</div>
                <div className="stat-label">Países integrados</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
