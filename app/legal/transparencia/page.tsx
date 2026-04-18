import React from 'react';

export default function TransparenciaPage() {
  return (
    <section className="section" style={{ minHeight: '80vh', paddingTop: 'clamp(100px, 15vh, 150px)' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: 'var(--color-primary)', marginBottom: '2rem', fontFamily: 'var(--font-heading)' }}>
          Transparencia y Gobernanza
        </h1>
        <div style={{ color: 'var(--color-text-muted)', lineHeight: '1.8', fontSize: '1.1rem' }}>
          <p style={{ marginBottom: '1.5rem', fontSize: '1.25rem', color: 'var(--color-cyan)', fontStyle: 'italic' }}>
            "La transparencia es un acto de respeto. Todo recurso recibido, toda decisión tomada y todo resultado obtenido será de conocimiento público."
          </p>
          
          <h2 style={{ color: 'var(--color-background)', marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.5rem' }}>Independencia Política</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            La Unión Americana es una organización políticamente independiente. No está afiliada a ningún gobierno, partido político, ideología, religión, corriente económica ni agenda geopolítica. Su única lealtad es hacia los derechos humanos universales y el bienestar de las comunidades latinoamericanas.
          </p>

          <h2 style={{ color: 'var(--color-background)', marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.5rem' }}>Estructura de Gobernanza</h2>
          <ul style={{ marginBottom: '1.5rem', listStyleType: 'disc', paddingLeft: '2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <li><strong>Asamblea General:</strong> Miembros fundadores encargados de la visión plurianual, presupuesto y lineamientos estratégicos.</li>
            <li><strong>Junta Directiva:</strong> Conformada por 7 miembros con un 50% de representación femenina y pluralidad multinacional para supervisión y gestión de riesgos.</li>
            <li><strong>Comité de Ética y Auditoría:</strong> Conformado por 3 miembros externos e independientes que gestionan quejas, auditan presupuestos y evalúan conflictos de interés garantizando integridad operativa.</li>
          </ul>

          <h2 style={{ color: 'var(--color-background)', marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.5rem' }}>Transparencia Financiera</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Aseguramos la integridad de nuestros compromisos mediante:
          </p>
          <ul style={{ marginBottom: '1.5rem', listStyleType: 'none', paddingLeft: '0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>✓ Publicación anual de estados financieros (Estándares NICSP).</li>
            <li>✓ Auditoría externa independiente anual.</li>
            <li>✓ Registro de donantes y política de tolerancia cero frente al desvío de recursos.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
