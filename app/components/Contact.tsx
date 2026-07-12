'use client';

import { useActionState } from 'react';
import { submitContact, type ActionState } from '../actions/contact';

const initialState: ActionState = { success: false };

export default function Contact() {
  const [state, formAction, isPending] = useActionState(submitContact, initialState);

  return (
    <section className="section contacto" id="unete" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-xl)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }} className="reveal">
          <p className="overline">Sé Parte</p>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', lineHeight: 1.2, marginBottom: '1rem' }}>
            La historia<br />
            <span style={{ 
              background: 'linear-gradient(90deg, var(--color-cyan), var(--color-violet))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontStyle: 'italic',
              fontWeight: 700
            }}>comienza contigo</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Únete a miles de personas que ya están construyendo la Latinoamérica del futuro.
          </p>
        </div>

        {/* 2-Column Grid Layout */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '3rem', 
          alignItems: 'start',
          marginTop: '2rem'
        }} className="reveal">
          
          {/* Left Column: Contact info & Socials */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Contact Card */}
            <div className="glass-panel" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', borderLeft: '4px solid var(--color-cyan)' }}>
              <div>
                <span className="overline" style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>Contacto Oficial</span>
                <h3 style={{ fontSize: '1.5rem', margin: '0 0 1rem 0', fontFamily: 'var(--font-heading)' }}>
                  La Unión Americana
                </h3>
                <p style={{ color: '#aaa', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                  Nuestra sede fundacional se encuentra en Colombia, impulsando el talento y el desarrollo integral de las comunidades en América Latina y el Caribe (ALC).
                </p>
              </div>

              {/* Email */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                <div style={{ 
                  width: '44px', 
                  height: '44px', 
                  borderRadius: '12px', 
                  background: 'rgba(0, 240, 255, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'var(--color-cyan)',
                  flexShrink: 0
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Correo Electrónico</p>
                  <a href="mailto:gerencia@launionamericana.org" style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-cyan)' }}>
                    gerencia@launionamericana.org
                  </a>
                </div>
              </div>

              {/* Location */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  width: '44px', 
                  height: '44px', 
                  borderRadius: '12px', 
                  background: 'rgba(138, 43, 226, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'var(--color-violet)',
                  flexShrink: 0
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a10 10 0 0 0-10 10c0 5.25 10 10 10 10s10-4.75 10-10a10 10 0 0 0-10-10z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Sede Central</p>
                  <p style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: '#fff' }}>
                    Colombia, América Latina
                  </p>
                </div>
              </div>
            </div>

            {/* Socials Card */}
            <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ fontSize: '1.1rem', margin: 0, textTransform: 'uppercase', letterSpacing: '1px', color: '#fff', fontWeight: 700 }}>
                Nuestras Redes
              </h4>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                {/* Instagram */}
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-cyan)';
                  e.currentTarget.style.color = 'var(--color-cyan)';
                  e.currentTarget.style.background = 'rgba(0, 240, 255, 0.05)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                }}
                aria-label="Instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                
                {/* LinkedIn */}
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-cyan)';
                  e.currentTarget.style.color = 'var(--color-cyan)';
                  e.currentTarget.style.background = 'rgba(0, 240, 255, 0.05)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                }}
                aria-label="LinkedIn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>

                {/* X / Twitter */}
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-cyan)';
                  e.currentTarget.style.color = 'var(--color-cyan)';
                  e.currentTarget.style.background = 'rgba(0, 240, 255, 0.05)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                }}
                aria-label="X (Twitter)">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                  </svg>
                </a>

                {/* YouTube */}
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-cyan)';
                  e.currentTarget.style.color = 'var(--color-cyan)';
                  e.currentTarget.style.background = 'rgba(0, 240, 255, 0.05)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                }}
                aria-label="YouTube">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                  </svg>
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Form */}
          <form action={formAction} className="glass-panel" style={{ padding: '2.5rem', margin: 0 }}>
            <input type="hidden" name="origen" value="contactos" />
            {state?.success && (
              <div style={{ padding: '1rem', background: 'rgba(0,255,0,0.1)', color: '#00F0FF', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #00F0FF' }}>
                {state.message}
              </div>
            )}

            {state?.error && (
              <div style={{ padding: '1rem', background: 'rgba(255,0,85,0.1)', color: '#FF0055', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #FF0055' }}>
                {state.error}
              </div>
            )}

            <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', textAlign: 'left' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="nombre" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Nombre Completo *</label>
                <input required type="text" id="nombre" name="nombre" placeholder="Ej. Ana García" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="email" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Correo Electrónico *</label>
                <input required type="email" id="email" name="email" placeholder="ana@ejemplo.com" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff' }} />
              </div>
            </div>

            <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', textAlign: 'left', marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="tipo" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>¿Cómo quieres participar? *</label>
                <select required id="tipo" name="tipo" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff' }}>
                  <option value="" style={{ color: '#000' }}>Selecciona una opción...</option>
                  <option value="voluntario" style={{ color: '#000' }}>Como Voluntario</option>
                  <option value="aliado" style={{ color: '#000' }}>Organización Aliada</option>
                  <option value="donante" style={{ color: '#000' }}>Inversor / Donante</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="pais" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>País</label>
                <input type="text" id="pais" name="pais" placeholder="Ej. Colombia" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff' }} />
              </div>
            </div>

            <div className="form-group" style={{ textAlign: 'left', marginTop: '1.5rem' }}>
              <label htmlFor="mensaje" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Mensaje (Opcional)</label>
              <textarea id="mensaje" name="mensaje" rows={4} placeholder="Cuéntanos más sobre ti..." style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff', resize: 'vertical' }}></textarea>
            </div>

            <div className="contacto__buttons" style={{ marginTop: '2rem' }}>
              <button disabled={isPending} type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
                {isPending ? 'Enviando Datos...' : 'Enviar y Unirme'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </section>
  );
}
