'use client';

import { motion } from 'framer-motion';

export default function Pillars() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const pillarsData = [
    {
      id: "I",
      title: "Acción Humanitaria Directa",
      desc: "Proporcionar respuesta inmediata, digna y eficaz a las poblaciones en situación de crisis aguda. Agua, saneamiento de emergencia y asistencia vital.",
      time: "0-6 meses",
      image: "/images/humanitarian_action.png"
    },
    {
      id: "II",
      title: "Servicios Esenciales",
      desc: "Garantizar el acceso a salud, educación, vivienda, y desarrollo deportivo y cultural en territorios donde el Estado tiene presencia ausente o insuficiente.",
      time: "6-36 meses",
      image: "/images/essential_services.png"
    },
    {
      id: "III",
      title: "Desarrollo Comunitario",
      desc: "Impulsar proyectos estructurales para que las comunidades superen la pobreza por sus propios medios. Desarrollo económico local y Biofactorías.",
      time: "2-15 años",
      image: "/images/community_development.png"
    },
    {
      id: "IV",
      title: "Defensa de Derechos e Integración",
      desc: "Abogar por los DD.HH., igualdad, reducción de migración forzada y construcción de los cimientos para una verdadera integración regional.",
      time: "Permanente",
      image: "/images/rights_defense.png"
    }
  ];

  return (
    <section className="section pilares" id="pilares" style={{ backgroundColor: '#0A0A0A', padding: 'var(--space-2xl) 0' }}>
      <div className="container">
        <motion.div 
          className="pilares__header"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}
        >
          <p className="overline" style={{ color: 'var(--color-primary)' }}>Nuestro Modelo de Intervención</p>
          <h2 style={{ color: 'var(--color-text-main)' }}>Los 4 Pilares</h2>
        </motion.div>

        <motion.div 
          className="pilares__grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}
        >
          {pillarsData.map((pillar) => (
            <motion.div 
              key={pillar.id} 
              className="pilar-card" 
              variants={cardVariants}
              whileHover={{ scale: 1.05, y: -10 }}
              style={{
                backgroundColor: '#111',
                border: '1px solid #222',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ height: '200px', width: '100%', overflow: 'hidden' }}>
                <img src={pillar.image} alt={pillar.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', flexGrow: 1, position: 'relative' }}>
                <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '6rem', color: 'rgba(255,255,255,0.03)', fontWeight: 'bold', fontFamily: 'var(--font-heading)', lineHeight: 0.8 }}>
                  {pillar.id}
                </div>
                <h3 style={{ color: 'var(--color-text-main)', fontSize: '1.5rem', fontFamily: 'var(--font-heading)', zIndex: 1 }}>{pillar.title}</h3>
                <p style={{ color: '#aaa', lineHeight: 1.6, zIndex: 1, flexGrow: 1 }}>{pillar.desc}</p>
                <div style={{ zIndex: 1, marginTop: '1rem', borderTop: '1px solid #333', paddingTop: '1rem' }}>
                  <strong style={{ color: 'var(--color-cyan)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Horizonte: {pillar.time}</strong>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
