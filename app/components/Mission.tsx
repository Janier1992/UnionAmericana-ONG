'use client';

import { motion } from 'framer-motion';

export default function Mission() {
  const textVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.8 }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: { duration: 0.8, delay: 0.2 }
    }
  };

  return (
    <section className="section mision" id="mision">
      <div className="container">
        <div className="mision__grid">
          <motion.div 
            className="mision__text"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={textVariants}
          >
            <p className="overline">Misión y Visión 2040</p>
            <h2>Unidad para<br /><em>cada pueblo</em></h2>

            <p style={{ fontSize: '1.125rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
              <span className="mision__dropcap">Misión:</span> Promover la unidad, el desarrollo integral y 
              la dignidad de los pueblos de América Latina y el Caribe mediante la acción 
              humanitaria directa, la prestación de servicios en territorios desatendidos, 
              el empoderamiento económico y social de las comunidades y la defensa irrestricta 
              de los derechos humanos.
            </p>

            <p style={{ fontSize: '1.125rem', lineHeight: '1.8', color: 'var(--color-primary)', marginTop: '2rem' }}>
              <span className="mision__dropcap">Visión:</span> Para 2040, La Unión Americana habrá contribuido a posicionar a América Latina y el Caribe como hub global de talento, biodiversidad e innovación social. La organización será el referente continental para el desarrollo estructural.
            </p>

            <div style={{ marginTop: 'var(--space-xl)' }}>
              <a href="#pilares" className="btn-text">Nuestro Modelo de Intervención →</a>
            </div>
          </motion.div>

          <motion.div 
            className="mision__image"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={imageVariants}
          >
            <div className="mision__image-wrapper" style={{ overflow: 'hidden', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <img 
                src="/images/mission_unity.png" 
                alt="Unidad para cada pueblo" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
