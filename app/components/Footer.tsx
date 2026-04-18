import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__grid">
        <div className="footer__brand">
          <Image
            src="/Unionamreicana.jpeg"
            alt="La Unión Americana"
            width={144}
            height={48}
            style={{ height: '48px', width: 'auto', marginBottom: '12px', filter: 'brightness(0.9)' }}
          />
          <p style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-stone)',
            opacity: 0.7,
            maxWidth: '300px'
          }}>
            Organización dedicada a la dignidad, unidad y progreso de los pueblos latinoamericanos desde 2026.
          </p>
        </div>

        <div className="footer__links">
          <h5>Navegación</h5>
          <ul>
            <li><a href="/#inicio">Inicio</a></li>
            <li><a href="/#mision">Misión</a></li>
            <li><a href="/#pilares">Modelo Integrado</a></li>
            <li><a href="/#impacto">Proyecciones</a></li>
          </ul>
        </div>

        <div className="footer__links">
          <h5>Proyectos</h5>
          <ul>
            <li><a href="/proyectos/educacion">Educación</a></li>
            <li><a href="/proyectos/cultura">Cultura</a></li>
            <li><a href="/proyectos/sostenibilidad">Sostenibilidad</a></li>
            <li><a href="/proyectos/tecnologia">Tecnología</a></li>
          </ul>
        </div>

        <div className="footer__links">
          <h5>Legal</h5>
          <ul>
            <li><a href="/legal/privacidad">Política de Privacidad</a></li>
            <li><a href="/legal/terminos">Términos de Uso</a></li>
            <li><a href="/legal/transparencia">Transparencia</a></li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <span>© {currentYear} La Unión Americana. Todos los derechos reservados.</span>
        <span>Diseñado con dignidad y propósito.</span>
      </div>
    </footer>
  );
}
