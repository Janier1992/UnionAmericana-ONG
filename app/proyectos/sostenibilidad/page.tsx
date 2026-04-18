import React from 'react';

export default function SostenibilidadPage() {
  return (
    <section className="section" style={{ minHeight: '80vh', paddingTop: 'clamp(100px, 15vh, 150px)' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: 'var(--color-primary)', marginBottom: '2rem', fontFamily: 'var(--font-heading)' }}>
          Desarrollo Comunitario y Sostenibilidad
        </h1>
        <div style={{ color: 'var(--color-text-muted)', lineHeight: '1.8', fontSize: '1.1rem' }}>
          <p style={{ marginBottom: '1.5rem', fontSize: '1.25rem', color: 'var(--color-cyan)', fontStyle: 'italic' }}>
            "La sostenibilidad es el único éxito. Una comunidad que sigue dependiendo de La Unión Americana es una intervención que no cumplió su propósito."
          </p>
          
          <h2 style={{ color: 'var(--color-background)', marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.5rem' }}>Ecosistemas Endógenos</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Enmarcados en el Pilar III, nuestros proyectos generan independencia. Facilitamos la transición comunitaria de un estado de supervivencia a uno de empoderamiento productivo, implementando tecnología clave para un entorno sano y una economía circular.
          </p>

          <h2 style={{ color: 'var(--color-background)', marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.5rem' }}>Iniciativas Estratégicas</h2>
          <ul style={{ marginBottom: '1.5rem', listStyleType: 'disc', paddingLeft: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li><strong>Módulos de Biofactoría:</strong> Transformación de aguas residuales en agua tratada, energía vía biogás, y biosólidos para una agricultura regenerativa y autónoma.</li>
            <li><strong>Emprendimientos Locales:</strong> Financiamiento semilla y generación de cadenas de valor para conectar de forma digna a la producción descentralizada.</li>
            <li><strong>Desarrollo Habitacional Resiliente:</strong> Modelos participativos de vivienda ecológica usando materiales autóctonos, diseñados para resistir crisis climáticas en zonas de alto impacto.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
