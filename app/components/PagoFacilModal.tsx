'use client';

import React, { useState, useActionState, useEffect } from 'react';
import { submitContact, type ActionState } from '../actions/contact';

const initialState: ActionState = { success: false };

interface PagoFacilModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PagoFacilModal({ isOpen, onClose }: PagoFacilModalProps) {
  const [step, setStep] = useState(1);
  const [monto, setMonto] = useState<string>('');
  const [customMonto, setCustomMonto] = useState<string>('');
  const [state, formAction, isPending] = useActionState(submitContact, initialState);

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle successful submission
  useEffect(() => {
    if (state?.success && step === 2) {
      setStep(3);
    }
  }, [state, step]);

  if (!isOpen) return null;

  const handleMontoSelect = (val: string) => {
    setMonto(val);
    setCustomMonto('');
  };

  const handleNextStep = () => {
    if (monto || customMonto) {
      setStep(2);
    }
  };

  const finalMonto = monto || customMonto;

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999,
      padding: '1rem'
    }}>
      <div className="modal-content glass-panel" style={{
        background: 'var(--color-bg)', border: '1px solid var(--color-cyan)',
        borderRadius: '16px', padding: '2rem', maxWidth: '500px', width: '100%',
        position: 'relative', boxShadow: '0 10px 40px rgba(0, 240, 255, 0.2)'
      }}>
        
        <button onClick={onClose} style={{
          position: 'absolute', top: '1rem', right: '1rem',
          background: 'transparent', border: 'none', color: '#fff',
          fontSize: '1.5rem', cursor: 'pointer'
        }}>
          &times;
        </button>

        <h2 style={{ color: 'var(--color-cyan)', marginBottom: '0.5rem', textAlign: 'center' }}>Pago Fácil</h2>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>Aporte Directo a ONG La Unión Americana</p>

        {/* STEP 1: Monto */}
        {step === 1 && (
          <div className="fade-in">
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>1. Selecciona el monto</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              {['25000', '50000', '100000', '200000'].map(val => (
                <button 
                  key={val}
                  onClick={() => handleMontoSelect(val)}
                  style={{
                    padding: '1rem', borderRadius: '8px', 
                    background: monto === val ? 'var(--color-cyan)' : 'rgba(255,255,255,0.05)',
                    color: monto === val ? '#000' : '#fff',
                    border: `1px solid ${monto === val ? 'var(--color-cyan)' : 'rgba(255,255,255,0.2)'}`,
                    cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem',
                    transition: 'all 0.3s'
                  }}
                >
                  $ {parseInt(val).toLocaleString('es-CO')}
                </button>
              ))}
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.5rem', display: 'block' }}>Otro monto (COP)</label>
              <input 
                type="number" 
                value={customMonto}
                onChange={(e) => { setCustomMonto(e.target.value); setMonto(''); }}
                placeholder="Ingresa un monto"
                style={{
                  width: '100%', padding: '1rem', borderRadius: '8px',
                  background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff', fontSize: '1.1rem'
                }}
              />
            </div>

            <button 
              onClick={handleNextStep}
              disabled={!monto && !customMonto}
              className="btn btn-primary"
              style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', opacity: (!monto && !customMonto) ? 0.5 : 1 }}
            >
              Continuar
            </button>
          </div>
        )}

        {/* STEP 2: Datos y Método de Pago */}
        {step === 2 && (
          <div className="fade-in">
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>2. Completa tu donación</h3>
            
            <div style={{ background: 'rgba(0,240,255,0.1)', border: '1px solid var(--color-cyan)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>Realiza tu transferencia por <strong>$ {parseInt(finalMonto).toLocaleString('es-CO')}</strong> a:</p>
              <p style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold', fontSize: '1.1rem' }}>Bancolombia</p>
              <p style={{ margin: '0 0 0.25rem 0', fontFamily: 'monospace', color: 'var(--color-cyan)' }}>Cuenta de Ahorros: 53600019195</p>
              <p style={{ margin: 0, fontSize: '0.85rem' }}>Titular: ONG La Unión Americana</p>
            </div>

            <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="hidden" name="origen" value="donaciones" />
              <input type="hidden" name="tipo" value="donante_financiero" />
              <input type="hidden" name="monto" value={finalMonto} />

              {state?.error && (
                <div style={{ padding: '0.8rem', background: 'rgba(255,0,85,0.1)', color: '#FF0055', borderRadius: '8px', border: '1px solid #FF0055', fontSize: '0.9rem' }}>
                  {state.error}
                </div>
              )}

              <div>
                <input type="text" name="nombre" required placeholder="Nombre completo o Empresa *" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff' }} />
              </div>
              
              <div>
                <input type="email" name="email" required placeholder="Correo electrónico *" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff' }} />
              </div>

              <div>
                <input type="text" name="pais" placeholder="País (opcional)" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff' }} />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setStep(1)} style={{ padding: '0.8rem', flex: 1, background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', borderRadius: '8px', cursor: 'pointer' }}>
                  Atrás
                </button>
                <button disabled={isPending} type="submit" className="btn btn-primary" style={{ padding: '0.8rem', flex: 2 }}>
                  {isPending ? 'Procesando...' : 'Confirmar Donación'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: Confirmación */}
        {step === 3 && (
          <div className="fade-in" style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ width: '60px', height: '60px', background: 'var(--color-cyan)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem', color: 'var(--color-cyan)' }}>¡Gracias por tu aporte!</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem' }}>
              {state?.message || 'Hemos registrado tu intención de donación. Recibirás un correo con los detalles en breve.'}
            </p>
            <button onClick={onClose} className="btn btn-primary" style={{ width: '100%' }}>
              Cerrar
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
