import React from 'react';

export default function CulturaPage() {
  return (
    <section className="section" style={{ minHeight: '80vh', paddingTop: 'clamp(100px, 15vh, 150px)' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: 'var(--color-primary)', marginBottom: '2rem', fontFamily: 'var(--font-heading)' }}>
          Cultura e Identidad Latinoamericana
        </h1>
        <div style={{ color: 'var(--color-text-muted)', lineHeight: '1.8', fontSize: '1.1rem' }}>
          <p style={{ marginBottom: '1.5rem', fontSize: '1.25rem', color: 'var(--color-cyan)', fontStyle: 'italic' }}>
            "América Latina tiene el potencial de ser la capital cultural del mundo; La Unión Americana construye ese escenario."
          </p>
          
          <h2 style={{ color: 'var(--color-background)', marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.5rem' }}>Rescate y Fortalecimiento Cultural</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Creemos que la identidad latinoamericana es la principal herramienta de resistencia frente al desarraigo. Al fomentar el arte y potenciar nuestras raíces, construimos orgullo colectivo que fundamenta una integración real y próspera.
          </p>

          <h2 style={{ color: 'var(--color-background)', marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.5rem' }}>Proyectos Clave</h2>
          <ul style={{ marginBottom: '1.5rem', listStyleType: 'disc', paddingLeft: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li><strong>Escuelas de Arte, Música y Teatro:</strong> Formación y preservación del patrimonio artístico dirigido a infancias y juventudes comunitarias.</li>
            <li><strong>Festivales de Identidad Latinoamericana:</strong> Celebración de nuestra inmensa diversidad como una plataforma de encuentro binacional en corredores migratorios.</li>
            <li><strong>Desarrollo Deportivo Formativo:</strong> Apoyo vital a la juventud a través de escuelas de fútbol, artes marciales y deportes autóctonos, fomentando disciplina y resiliencia.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
