'use client';

import { useActionState } from 'react';
import { submitContact } from '../actions/contact';

const initialState: { success: boolean; message?: string; error?: string } = { success: false };

export default function Contact() {
  const [state, formAction, isPending] = useActionState(submitContact, initialState);

  return (
    <section className="section contacto" id="unete" style={{ paddingTop: 0, paddingBottom: 0 }}>
      <div className="container">
        <div className="contacto__content reveal">
          <p className="overline">Sé Parte</p>
          <h2 className="contacto__title">La historia<br /><em>comienza contigo</em></h2>
          <p className="contacto__subtitle">
            Únete a miles de personas que ya están construyendo la Latinoamérica del futuro.
          </p>
          
          <form action={formAction} className="glass-panel" style={{ padding: '2rem', marginTop: '2rem' }}>
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

            <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'left' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="nombre" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Nombre Completo *</label>
                <input required type="text" id="nombre" name="nombre" placeholder="Ej. Ana García" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="email" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Correo Electrónico *</label>
                <input required type="email" id="email" name="email" placeholder="ana@ejemplo.com" />
              </div>
            </div>

            <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'left', marginTop: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="tipo" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>¿Cómo quieres participar? *</label>
                <select required id="tipo" name="tipo">
                  <option value="">Selecciona una opción...</option>
                  <option value="voluntario">Como Voluntario</option>
                  <option value="aliado">Organización Aliada</option>
                  <option value="donante">Inversor / Donante</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="pais" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>País</label>
                <input type="text" id="pais" name="pais" placeholder="Ej. Colombia" />
              </div>
            </div>

            <div className="form-group" style={{ textAlign: 'left', marginTop: '1rem' }}>
              <label htmlFor="mensaje" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Mensaje (Opcional)</label>
              <textarea id="mensaje" name="mensaje" rows={4} placeholder="Cuéntanos más sobre ti..."></textarea>
            </div>

            <div className="contacto__buttons" style={{ marginTop: '2rem' }}>
              <button disabled={isPending} type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                {isPending ? 'Enviando Datos...' : 'Enviar y Unirme'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
