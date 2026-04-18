'use client';

import React, { useActionState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { submitContact } from '../actions/contact';

const initialState: any = { success: false, message: '', error: '' };

export default function DonacionesPage() {
  const [state, formAction, isPending] = useActionState<any, FormData>(submitContact, initialState);

  return (
    <>
      <div style={{ paddingTop: 'clamp(80px, 15vh, 120px)', minHeight: '100vh', background: 'var(--color-bg)' }}>
        <div className="container" style={{ paddingBottom: '4rem' }}>
          
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p className="overline">Haz Parte del Cambio</p>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontFamily: 'var(--font-heading)', color: 'var(--color-text-main)', marginBottom: '1rem' }}>
              Donaciones y <span style={{ color: 'var(--color-cyan)' }}>Contribuciones</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.125rem', maxWidth: '700px', margin: '0 auto' }}>
              Tu aporte es el motor que nos permite llevar asistencia humanitaria, abrir escuelas de talentos e instalar biofactorías en toda América Latina. Juntos construimos el Hub Global del futuro.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            
            {/* Opciones de Donación Financiera */}
            <div className="glass-panel" style={{ padding: '2.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--color-cyan)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                Depósitos y Transferencias
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>
                Puedes hacer un aporte financiero directo a nuestras cuentas oficiales. Estos fondos son auditados y destinados 100% a los Pilares de Intervención.
              </p>
              
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '1.5rem' }}>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>Cuenta Bancaria Institucional (Colombia - Nodo Sur)</p>
                <p style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold' }}>Banco de Bogotá</p>
                <p style={{ margin: '0 0 0.25rem 0', fontFamily: 'monospace', fontSize: '1.1rem', color: 'var(--color-cyan)' }}>Cuenta Corriente: 123-45678-9</p>
                <p style={{ margin: '0', fontSize: '0.9rem' }}>A nombre de: ONG La Unión Americana</p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>Transferencias Internacionales (SWIFT)</p>
                <p style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold' }}>Código SWIFT: BOGOCOBB</p>
                <p style={{ margin: '0', fontSize: '0.9rem' }}>Ruta internacional disponible para donantes desde Norteamérica, Europa y resto de ALC.</p>
              </div>
            </div>

            {/* Formulario para Donaciones Tangibles o Patrocinios */}
            <div className="glass-panel" style={{ padding: '2.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--color-cyan)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                Recursos Tangibles y Patrocinios
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem' }}>
                ¿Deseas aportar insumos médicos, tecnología, maquinaria para biofactorías, o patrocinar un proyecto específico completo? Déjanos tus datos.
              </p>

              <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input type="hidden" name="origen" value="donaciones" />
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label htmlFor="nombre" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>Nombre de Persona u Organización *</label>
                  <input type="text" id="nombre" name="nombre" required placeholder="Ej. Fundación Solar" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff' }} />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    <label htmlFor="email" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>Correo *</label>
                    <input type="email" id="email" name="email" required placeholder="correo@ejemplo.com" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    <label htmlFor="pais" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>País</label>
                    <input type="text" id="pais" name="pais" placeholder="Ej. México" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label htmlFor="tipo" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>Tipo de Participación</label>
                  <select id="tipo" name="tipo" required style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff' }}>
                    <option value="" style={{ color: '#000' }}>Selecciona una opción...</option>
                    <option value="donante" style={{ color: '#000' }}>Insumos Médicos / Clínicos</option>
                    <option value="donante" style={{ color: '#000' }}>Equipos Tecnológicos / Educativos</option>
                    <option value="donante" style={{ color: '#000' }}>Materiales para Biofactorías / Vivienda</option>
                    <option value="donante" style={{ color: '#000' }}>Patrocinio de un Proyecto Completo</option>
                    <option value="aliado" style={{ color: '#000' }}>Otro Tipo de Donación / Alianza</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label htmlFor="mensaje" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>Detalles del Aporte</label>
                  <textarea id="mensaje" name="mensaje" rows={3} placeholder="Describa los recursos que desea aportar..." style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff', resize: 'vertical' }}></textarea>
                </div>

                <button disabled={isPending} type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                  {isPending ? 'Enviando Datos...' : 'Contactar al Equipo de Donaciones'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
