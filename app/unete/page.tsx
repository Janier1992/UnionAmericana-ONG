'use client';

import React, { useActionState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { submitContact } from '../actions/contact';

const initialState = { success: false, message: '', error: '' };

export default function UnetePage() {
  const [state, formAction, isPending] = useActionState(submitContact, initialState);

  return (
    <>
      <div style={{ paddingTop: 'clamp(80px, 15vh, 120px)', minHeight: '100vh', background: 'var(--color-bg)' }}>
        <div className="container" style={{ paddingBottom: '4rem' }}>
          
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p className="overline">Conviértete en Voluntario</p>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontFamily: 'var(--font-heading)', color: 'var(--color-text-main)', marginBottom: '1rem' }}>
              Únete a La <span style={{ color: 'var(--color-cyan)' }}>Unión Americana</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.125rem', maxWidth: '700px', margin: '0 auto' }}>
              La historia comienza contigo. Únete a miles de personas que ya están construyendo la Latinoamérica del futuro como voluntarios o aliados estratégicos en terreno.
            </p>
          </div>

          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="glass-panel" style={{ padding: '2.5rem' }}>
              <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <input type="hidden" name="origen" value="voluntarios" />
                {state?.success && (
                  <div style={{ padding: '1rem', background: 'rgba(0,255,0,0.1)', color: '#00F0FF', borderRadius: '8px', border: '1px solid #00F0FF' }}>
                    {state.message}
                  </div>
                )}
                {state?.error && (
                  <div style={{ padding: '1rem', background: 'rgba(255,0,85,0.1)', color: '#FF0055', borderRadius: '8px', border: '1px solid #FF0055' }}>
                    {state.error}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label htmlFor="nombre" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>Nombre Completo *</label>
                    <input type="text" id="nombre" name="nombre" required placeholder="Ej. Carlos Mendoza" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff' }} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label htmlFor="email" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>Correo Electrónico *</label>
                    <input type="email" id="email" name="email" required placeholder="carlos@ejemplo.com" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label htmlFor="tipo" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>¿Cómo quieres participar? *</label>
                    <select id="tipo" name="tipo" required style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff' }}>
                      <option value="" style={{ color: '#000' }}>Selecciona una opción...</option>
                      <option value="voluntario" style={{ color: '#000' }}>Como Voluntario en Terreno</option>
                      <option value="voluntario" style={{ color: '#000' }}>Como Voluntario Digital</option>
                      <option value="aliado" style={{ color: '#000' }}>Como Organización Aliada</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label htmlFor="pais" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>País de Residencia</label>
                    <input type="text" id="pais" name="pais" placeholder="Ej. Colombia" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label htmlFor="mensaje" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>Cuéntanos sobre tus habilidades o intereses (Opcional)</label>
                  <textarea id="mensaje" name="mensaje" rows={4} placeholder="Soy profesional en salud, docencia, logística, etc..." style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff', resize: 'vertical' }}></textarea>
                </div>

                <button disabled={isPending} type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '1rem', fontSize: '1.1rem' }}>
                  {isPending ? 'Enviando Solicitud...' : 'Registrarme como Voluntario'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
