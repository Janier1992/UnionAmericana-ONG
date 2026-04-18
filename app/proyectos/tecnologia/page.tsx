import React from 'react';

export default function TecnologiaPage() {
  return (
    <section className="section" style={{ minHeight: '80vh', paddingTop: 'clamp(100px, 15vh, 150px)' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: 'var(--color-primary)', marginBottom: '2rem', fontFamily: 'var(--font-heading)' }}>
          Tecnología y Hub Global
        </h1>
        <div style={{ color: 'var(--color-text-muted)', lineHeight: '1.8', fontSize: '1.1rem' }}>
          <p style={{ marginBottom: '1.5rem', fontSize: '1.25rem', color: 'var(--color-cyan)', fontStyle: 'italic' }}>
            "Retener el cerebro latinoamericano. Que fluya como ecosistema de innovación al servicio de nuestra propia región."
          </p>
          
          <h2 style={{ color: 'var(--color-background)', marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.5rem' }}>Nuestra Visión Tecnológica 2040</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Para posicionar a la región como la tercera economía del globo mediante una estrategia colaborativa, integramos la tecnología en la raíz del desarrollo estructural. Facilitamos los recursos para que las mentes jóvenes y disruptivas construyan su infraestructura moderna en el continente.
          </p>

          <h2 style={{ color: 'var(--color-background)', marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.5rem' }}>Líneas de Innovación</h2>
          <ul style={{ marginBottom: '1.5rem', listStyleType: 'disc', paddingLeft: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li><strong>Red de Talento Latinoamericano:</strong> Plataforma digital interactiva que conecta y mapea ecosistemas de conocimiento entre centros de investigación y emprendimiento a nivel regional.</li>
            <li><strong>Centros de Innovación Comunitaria:</strong> Espacios tecnológicos equipados donde los jóvenes locales diseñan e implementan soluciones disruptivas aplicadas directamente a su realidad territorial.</li>
            <li><strong>Telemedicina:</strong> Conectividad remota orientada a integrar zonas desabastecidas al sistema de salud general de los grandes nodos urbanos, garantizando especialización experta en toda la plataforma latinoamericana.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
