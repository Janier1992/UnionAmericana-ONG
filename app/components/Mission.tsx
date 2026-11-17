'use client';

import { motion } from 'framer-motion';

export default function Mission() {
  return (
    <section className="ld-section" id="mision">
      <div className="ld-container ld-mision">
        <motion.div
          className="ld-mision__text"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
        >
          <p className="ld-overline">Misión y Visión 2040</p>
          <p className="ld-statement">
            <span>Promovemos la unidad, el desarrollo integral y la dignidad de los pueblos de América Latina y el Caribe</span>{' '}
            mediante la acción humanitaria directa, la prestación de servicios en territorios desatendidos, el
            empoderamiento económico y social de las comunidades y{' '}
            <span>la defensa irrestricta de los derechos humanos.</span>
          </p>
          <p className="ld-mision__vision">
            <strong>Visión 2040:</strong> contribuir a posicionar a América Latina y el Caribe como hub global de
            talento, biodiversidad e innovación social, y ser el referente continental para el desarrollo estructural.
          </p>
          <a href="#pilares" className="ld-link">Nuestro modelo de intervención →</a>
        </motion.div>

        <motion.div
          className="ld-mision__media"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <img src="/images/mission_unity.png" alt="Unidad para cada pueblo" />
        </motion.div>
      </div>
    </section>
  );
}
