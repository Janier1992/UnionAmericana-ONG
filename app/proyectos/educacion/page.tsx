import React from 'react';

export default function EducacionPage() {
  return (
    <section className="section" style={{ minHeight: '80vh', paddingTop: 'clamp(100px, 15vh, 150px)' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: 'var(--color-primary)', marginBottom: '2rem', fontFamily: 'var(--font-heading)' }}>
          Educación y Desarrollo de Talento
        </h1>
        <div style={{ color: 'var(--color-text-muted)', lineHeight: '1.8', fontSize: '1.1rem' }}>
          <p style={{ marginBottom: '1.5rem', fontSize: '1.25rem', color: 'var(--color-cyan)', fontStyle: 'italic' }}>
            "El talento latinoamericano no tiene déficit: tiene déficit de oportunidades."
          </p>
          
          <h2 style={{ color: 'var(--color-background)', marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.5rem' }}>Nuestra Apuesta Educativa</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            A través del Pilar II de Servicios Esenciales, garantizamos programas intensivos para que cada talento descubra y alcance su potencial dentro del continente sin necesidad de emigrar para buscar la excelencia formativa.
          </p>

          <h2 style={{ color: 'var(--color-background)', marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.5rem' }}>Proyectos Clave</h2>
          <ul style={{ marginBottom: '1.5rem', listStyleType: 'disc', paddingLeft: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li><strong>Sistema de Identificación de Talentos:</strong> Búsqueda activa en territorios históricamente marginados de jóvenes con capacidades excepcionales en ciencia, tecnología y humanidades.</li>
            <li><strong>Becas y Acompañamiento Académico:</strong> Financiación total para asegurar que la excelencia intelectual de la juventud no se fugue de la región por limitaciones económicas.</li>
            <li><strong>Educación Intercultural Bilingüe:</strong> Modelos educativos con respeto a las lenguas y cosmovisiones indígenas como patrimonio cultural de la humanidad.</li>
            <li><strong>Escuelas de Oficios:</strong> Formación técnica vocacional adaptada a industrias como energías renovables y economía circular en ecosistemas locales.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
