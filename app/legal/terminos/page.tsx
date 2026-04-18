import React from 'react';

export default function TerminosPage() {
  return (
    <section className="section" style={{ minHeight: '80vh', paddingTop: 'clamp(100px, 15vh, 150px)' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: 'var(--color-primary)', marginBottom: '2rem', fontFamily: 'var(--font-heading)' }}>
          Términos de Uso
        </h1>
        <div style={{ color: 'var(--color-text-muted)', lineHeight: '1.8', fontSize: '1.1rem' }}>
          <p style={{ marginBottom: '1.5rem' }}>
            Última actualización: Abril 2026
          </p>
          <h2 style={{ color: 'var(--color-background)', marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.5rem' }}>1. Aceptación de los Términos</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Al acceder y utilizar el sitio web de La Unión Americana, usted acepta los presentes términos y condiciones, comprometiéndose a utilizar esta plataforma en conformidad con la ley, la moral y la filosofía fundacional de nuestra organización: Unidad, Dignidad y Desarrollo.
          </p>

          <h2 style={{ color: 'var(--color-background)', marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.5rem' }}>2. Propiedad Intelectual</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Todo el material incluido en este sitio, excepto cuando se indique lo contrario, es propiedad de La Unión Americana. Esto abarca tanto los textos, el Documento Fundacional (Document.MD), las imágenes y el diseño visual y tecnológico. Queda permitida la copia o distribución con fines no comerciales y de difusión social, siempre que se atribuya formalmente a La Unión Americana y su equipo fundador.
          </p>

          <h2 style={{ color: 'var(--color-background)', marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.5rem' }}>3. Limitación de Responsabilidad</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Las cifras de impacto proyectadas ("Visión 2040") se basan en investigaciones de CEPAL, OPS y otras entidades, formuladas como metas organizativas. La Unión Americana no asume responsabilidad legal por las desviaciones en estos tiempos e hitos debido a contingencias macroeconómicas y sociopolíticas continentales.
          </p>

          <h2 style={{ color: 'var(--color-background)', marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.5rem' }}>4. Modificaciones</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            La Unión Americana se reserva el derecho de modificar estos términos para adaptarlos a novedades operativas, humanitarias o legislativas. Sus cambios entrarán en vigor tan pronto como se publiquen en la plataforma.
          </p>
        </div>
      </div>
    </section>
  );
}
