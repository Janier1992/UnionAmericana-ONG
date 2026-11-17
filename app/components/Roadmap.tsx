'use client';

import { motion } from 'framer-motion';

const PHASES = [
  { n: '1', when: 'Meses 1–12', name: 'Fundación', desc: 'Registro legal en 3+ países, equipo fundador y primer financiamiento.' },
  { n: '2', when: 'Meses 13–36', name: 'Piloto', desc: 'Primera biofactoría operativa y 500 jóvenes talentos acompañados.' },
  { n: '3', when: 'Meses 37–72', name: 'Expansión', desc: 'Presencia en 8+ países y plataforma de talentos con más de 10.000 usuarios.' },
  { n: '4', when: 'Años 7–15', name: 'Transformación', desc: '20+ comunidades autosostenibles y 30% menos intención de migrar.' },
];

export default function Roadmap() {
  return (
    <section className="ld-section" id="ruta">
      <div className="ld-container">
        <h2 className="ld-h2" style={{ marginBottom: '2rem' }}>Hoja de ruta</h2>
        <ol className="ld-grid ld-grid--4">
          {PHASES.map((phase, i) => (
            <motion.li
              key={phase.n}
              className="ld-card ld-card--pad"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <span className="ld-step">{phase.n}</span>
              <span className="ld-tag">{phase.when}</span>
              <h3 className="ld-card__title">{phase.name}</h3>
              <p className="ld-card__text">{phase.desc}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
