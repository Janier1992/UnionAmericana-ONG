import React from 'react';

export default function PrivacidadPage() {
  return (
    <section className="section" style={{ minHeight: '80vh', paddingTop: 'clamp(100px, 15vh, 150px)' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: 'var(--color-primary)', marginBottom: '2rem', fontFamily: 'var(--font-heading)' }}>
          Política de Privacidad
        </h1>
        <div style={{ color: 'var(--color-text-muted)', lineHeight: '1.8', fontSize: '1.1rem' }}>
          <p style={{ marginBottom: '1.5rem' }}>
            Última actualización: Abril 2026
          </p>
          <h2 style={{ color: 'var(--color-background)', marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.5rem' }}>1. Principio de Dignidad y Privacidad</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            En La Unión Americana, la transparencia es un acto de respeto y la privacidad es parte inalienable de la dignidad humana. Todo dato personal recolectado se usa exclusivamente para los fines del desarrollo comunitario y la acción humanitaria, sin fines comerciales ni de explotación.
          </p>

          <h2 style={{ color: 'var(--color-background)', marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.5rem' }}>2. Recopilación de Información</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Recopilamos información únicamente cuando es estrictamente necesario para la prestación de nuestros servicios esenciales, el registro de aliados estratégicos y el contacto a través de nuestra plataforma. Esto incluye:
          </p>
          <ul style={{ marginBottom: '1.5rem', listStyleType: 'disc', paddingLeft: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>Datos de contacto y comunicación básicos a través del formulario de aliados o contacto.</li>
            <li>Información estadística disgregada y anónima para evaluar el impacto de nuestros pilares.</li>
          </ul>

          <h2 style={{ color: 'var(--color-background)', marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.5rem' }}>3. Uso de la Información</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            La información recogida es procesada mediante nuestra arquitectura tecnológica (ej. Insforge u otras plataformas validadas) y se almacena bajo estándares internacionales de seguridad (ISO/IEC 27001). No compartiremos, alquilaremos ni venderemos su información a terceros. La compartición de datos con actores gubernamentales u ONGs aliadas sólo se realizará bajo explícito consentimiento.
          </p>
          
          <h2 style={{ color: 'var(--color-background)', marginTop: '2.5rem', marginBottom: '1rem', fontSize: '1.5rem' }}>4. Derechos de los Usuarios</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Usted tiene el derecho de acceso, rectificación, cancelación y oposición respecto a sus datos personales. Para ejercerlos, puede enviar una solicitud formal a través de nuestros canales oficiales de contacto.
          </p>
        </div>
      </div>
    </section>
  );
}
