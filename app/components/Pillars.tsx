'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Pillars() {
  const [activePillar, setActivePillar] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
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
      image: "/images/humanitarian_action.png",
      details: "Este pilar se enfoca en la intervención inmediata y el apoyo logístico en zonas críticas de desastre natural o exclusión extrema, actuando como primera línea de ayuda para restablecer condiciones de dignidad básicas en menos de 72 horas.",
      actions: [
        "Distribución y abastecimiento de agua potable y sistemas de saneamiento portátiles.",
        "Atenciones médicas de campañas autogestionadas con personal especializado voluntario.",
        "Distribución rápida de kits de nutrición y suministros de emergencia para la infancia y familias.",
        "Establecimiento de refugios temporales coordinados con comunidades locales."
      ]
    },
    {
      id: "II",
      title: "Servicios Esenciales",
      desc: "Garantizar el acceso a salud, educación, vivienda, y desarrollo deportivo y cultural en territorios donde el Estado tiene presencia ausente o insuficiente.",
      time: "6-36 meses",
      image: "/images/essential_services.png",
      details: "Desarrollamos infraestructura social, educativa y de habitabilidad básica para llenar vacíos de cobertura estatal de mediano plazo, sembrando las bases de un desarrollo integral permanente en cada territorio.",
      actions: [
        "Programas de nivelación educativa acelerada y becas de estudio continental.",
        "Talleres de formación en oficios prácticos y educación intercultural bilingüe.",
        "Construcción de módulos habitacionales eco-sostenibles con materiales de la región.",
        "Centros culturales y deportivos comunitarios como núcleos de paz e integración."
      ]
    },
    {
      id: "III",
      title: "Desarrollo Comunitario",
      desc: "Impulsar proyectos estructurales para que las comunidades superen la pobreza por sus propios medios. Desarrollo económico local y Biofactorías.",
      time: "2-15 años",
      image: "/images/community_development.png",
      details: "Buscamos la autosostenibilidad y soberanía local. Implementamos tecnologías circulares innovadoras y creamos esquemas productivos autogestionados para que las comunidades rompan estructuralmente la trampa de la pobreza.",
      actions: [
        "Biofactorías ecológicas: Plantas que transforman aguas residuales en agua limpia para riego, biogás y nutrientes orgánicos.",
        "Creación de cooperativas de producción, procesamiento y redes de microcréditos comunitarios.",
        "Plataforma de comercio justo directa para evitar intermediarios y potenciar ganancias locales.",
        "Programas de emprendimiento tecnológico adaptados a zonas rurales y periurbanas."
      ]
    },
    {
      id: "IV",
      title: "Defensa de Derechos e Integración",
      desc: "Abogar por los DD.HH., igualdad, reducción de migración forzada y construcción de los cimientos para una verdadera integración regional.",
      time: "Permanente",
      image: "/images/rights_defense.png",
      details: "Abogamos por la protección irrestricta de los derechos de los migrantes y de las comunidades vulnerabilizadas. Promovemos la integración regional real desde las bases sociales como alternativa al desarraigo y la migración forzada.",
      actions: [
        "Red de asesoramiento jurídico gratuita y orientación para personas en condición de desplazamiento y migración.",
        "Campañas de concientización y prevención sobre los riesgos del tránsito irregular transfronterizo.",
        "Incidencia y propuesta de políticas de libre movilidad de talento e integración académica en ALC.",
        "Observatorio regional de derechos humanos enfocado en género, etnicidad y ecología."
      ]
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
          <h2 style={{ color: 'var(--color-text-main)', fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.15 }}>Los 4 Pilares</h2>
        </motion.div>

        <motion.div 
          className="pilares__grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}
        >
          {pillarsData.map((pillar, idx) => (
            <motion.div 
              key={pillar.id} 
              className="pilar-card" 
              variants={cardVariants}
              whileHover={{ 
                scale: 1.03, 
                y: -8,
                boxShadow: '0 12px 40px rgba(0, 240, 255, 0.15), inset 0 0 0 1px rgba(0, 240, 255, 0.1)'
              }}
              onClick={() => setActivePillar(idx)}
              style={{
                backgroundColor: 'rgba(255,255,255,0.02)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all var(--duration-fast) var(--ease-smooth)'
              }}
            >
              <div style={{ height: '200px', width: '100%', overflow: 'hidden', position: 'relative' }}>
                <img src={pillar.image} alt={pillar.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(17,17,17,1))' }} />
              </div>
              <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', flexGrow: 1, position: 'relative' }}>
                <div style={{ position: 'absolute', top: '10px', right: '15px', fontSize: '5rem', color: 'rgba(0, 240, 255, 0.05)', fontWeight: 800, fontFamily: 'var(--font-heading)', lineHeight: 0.8 }}>
                  {pillar.id}
                </div>
                <h3 style={{ color: 'var(--color-text-main)', fontSize: '1.4rem', fontFamily: 'var(--font-heading)', zIndex: 1 }}>{pillar.title}</h3>
                <p style={{ color: '#aaa', fontSize: '0.95rem', lineHeight: 1.6, zIndex: 1, flexGrow: 1 }}>{pillar.desc}</p>
                <div style={{ zIndex: 1, marginTop: '1rem', borderTop: '1px solid #222', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--color-cyan)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '1px' }}>Horizonte: {pillar.time}</span>
                  <span style={{ color: 'var(--color-violet)', fontSize: '0.9rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                    Saber más 
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Modal Glassmorphic para Detalles de los Pilares */}
      <AnimatePresence>
        {activePillar !== null && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActivePillar(null)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(5, 5, 17, 0.8)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
            />
            
            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '650px',
                maxHeight: '90vh',
                backgroundColor: 'rgba(15, 15, 30, 0.9)',
                border: '1px solid rgba(0, 240, 255, 0.25)',
                boxShadow: '0 20px 50px rgba(0, 240, 255, 0.1), inset 0 0 15px rgba(255, 255, 255, 0.02)',
                borderRadius: '24px',
                padding: '2.5rem',
                overflowY: 'auto',
                zIndex: 10000,
                scrollbarWidth: 'thin'
              }}
            >
              {/* Close Button */}
              <button 
                onClick={() => setActivePillar(null)}
                style={{
                  position: 'absolute',
                  top: '1.5rem',
                  right: '1.5rem',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 0, 85, 0.2)';
                  e.currentTarget.style.borderColor = 'var(--color-magenta)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              <span className="overline" style={{ fontSize: '0.8rem', color: 'var(--color-cyan)', display: 'inline-block', marginBottom: '0.5rem' }}>
                Pilar {pillarsData[activePillar].id}
              </span>
              <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', color: '#fff', margin: '0 0 1.5rem 0' }}>
                {pillarsData[activePillar].title}
              </h2>
              
              <div style={{ height: '220px', width: '100%', borderRadius: '16px', overflow: 'hidden', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                <img src={pillarsData[activePillar].image} alt={pillarsData[activePillar].title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <p style={{ color: '#fff', opacity: 0.9, fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {pillarsData[activePillar].details}
              </p>

              <h4 style={{ color: 'var(--color-cyan)', fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', margin: '1.5rem 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 11 12 14 22 4"></polyline>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                </svg>
                Acciones de Impacto Directo:
              </h4>

              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', paddingLeft: 0, listStyle: 'none', margin: '0 0 2rem 0' }}>
                {pillarsData[activePillar].actions.map((action, idx) => (
                  <li key={idx} style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start', color: '#ccc', fontSize: '0.95rem', lineHeight: 1.5 }}>
                    <span style={{ color: 'var(--color-magenta)', fontSize: '1.2rem', lineHeight: 1, marginTop: '-2px' }}>✦</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1.5rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>
                  Horizonte de Ejecución: <strong style={{ color: 'var(--color-cyan)' }}>{pillarsData[activePillar].time}</strong>
                </span>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setActivePillar(null)}
                  style={{ padding: '0.6rem 1.5rem', borderRadius: '12px', fontSize: '0.85rem' }}
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
