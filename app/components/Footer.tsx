import Image from 'next/image';
import LegalDocuments from './LegalDocuments';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__grid">
        <div className="footer__brand">
          <img
            src="/logo_alta_calidad.png"
            alt="La Unión Americana"
            style={{ height: '48px', width: 'auto', marginBottom: '12px', filter: 'brightness(0.9)' }}
          />
          <p style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-stone)',
            opacity: 0.7,
            maxWidth: '300px',
            marginBottom: '10px'
          }}>
            Organización dedicada a la dignidad, unidad y progreso de los pueblos latinoamericanos desde 2026.
          </p>
          <a href="mailto:gerencia@launionamericana.org" style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-cyan)',
            fontWeight: 600,
            textDecoration: 'none'
          }}>
            gerencia@launionamericana.org
          </a>
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
            <li><LegalDocuments /></li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <span>© {currentYear} La Unión Americana. Todos los derechos reservados.</span>
        <a
          href="https://www.facebook.com/share/1DHXFfdd9M/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-text-muted)',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-cyan)';
            e.currentTarget.style.color = 'var(--color-cyan)';
            e.currentTarget.style.background = 'rgba(0, 240, 255, 0.05)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.color = 'var(--color-text-muted)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
          </svg>
        </a>
        <span>Diseñado con dignidad y propósito.</span>
      </div>
    </footer>
  );
}
