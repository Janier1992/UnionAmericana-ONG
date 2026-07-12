'use client';

import React, { useState, useEffect } from 'react';
import { getRecords, loginAdmin, updateRecord, deleteRecord, createContactRecord } from '../actions/contact';
import { getEmailLogs, type EmailLog } from '../actions/email';

export default function AdminPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'voluntarios' | 'donaciones' | 'contactos' | 'emails'>('dashboard');

  // Load session from sessionStorage on mount
  useEffect(() => {
    const savedAuth = sessionStorage.getItem('ua_admin_authenticated');
    const savedToken = sessionStorage.getItem('ua_admin_token');
    if (savedAuth === 'true' && savedToken) {
      setIsAuthenticated(true);
      setAuthToken(savedToken);
    }
  }, []);
  
  // Real-time Database state
  const [voluntarios, setVoluntarios] = useState<any[]>([]);
  const [donaciones, setDonaciones] = useState<any[]>([]);
  const [contactos, setContactos] = useState<any[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Auth Handler against Insforge
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setErrorMsg('');
    try {
      const res = await loginAdmin(email, password);
      if (res.success) {
        setAuthToken(res.token || '');
        setIsAuthenticated(true);
        sessionStorage.setItem('ua_admin_authenticated', 'true');
        sessionStorage.setItem('ua_admin_token', res.token || '');
        setErrorMsg('');
      } else {
        setErrorMsg(res.error || 'Credenciales inválidas.');
      }
    } catch (err) {
      setErrorMsg('Error al conectar con el servidor.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Logout Handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthToken('');
    sessionStorage.removeItem('ua_admin_authenticated');
    sessionStorage.removeItem('ua_admin_token');
    window.location.href = '/';
  };

  // Load records from Insforge (passing authorization token to query RLS tables)
  const loadData = async (tokenStr?: string) => {
    setIsLoading(true);
    const activeToken = tokenStr || authToken;
    try {
      const dbVoluntarios = await getRecords('voluntarios', activeToken);
      const dbDonaciones = await getRecords('donaciones', activeToken);
      const dbContactos = await getRecords('contactos', activeToken);
      const logs = await getEmailLogs();

      // Only display real database records from Insforge
      setVoluntarios(dbVoluntarios);
      setDonaciones(dbDonaciones);
      setContactos(dbContactos);
      setEmailLogs(logs);
    } catch (e) {
      console.error("Error loading Insforge records:", e);
      setVoluntarios([]);
      setDonaciones([]);
      setContactos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleUpdateVolunteerStatus = async (id: string, newStatus: 'Aprobado' | 'Contactado' | 'Rechazado' | 'Pendiente') => {
    setUpdatingId(id);
    try {
      const res = await updateRecord('voluntarios', id, { estado: newStatus }, authToken);
      if (res.success) {
        await loadData(authToken);
      } else {
        if (res.error?.includes('column') || res.error?.includes('estado')) {
          alert(`Error al actualizar estado: La base de datos de Insforge no cuenta con las columnas nuevas de control. Para solucionarlo, ejecuta el script de base de datos 'public/insforge_schema.sql' en el editor SQL de tu panel en Insforge.`);
        } else if (res.error?.includes('AUTH_UNAUTHORIZED') || res.error?.includes('token') || res.error?.includes('401')) {
          alert(`Tu sesión administrativa ha expirado por motivos de seguridad.\n\nPor favor, haz clic en el botón 'Cerrar Sesión' (abajo a la izquierda) e ingresa nuevamente para renovar tu acceso.`);
        } else {
          alert(`Error al actualizar estado: ${res.error}`);
        }
      }
    } catch (e: any) {
      alert(`Error de red: ${e.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteVolunteer = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar permanentemente este registro de voluntario?')) return;
    setUpdatingId(id);
    try {
      const res = await deleteRecord('voluntarios', id, authToken);
      if (res.success) {
        await loadData(authToken);
      } else {
        alert(`Error al eliminar: ${res.error}`);
      }
    } catch (e: any) {
      alert(`Error de red: ${e.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    if (isAuthenticated && authToken) {
      loadData(authToken);
    }
  }, [isAuthenticated, authToken]);

  // Calculations for dashboard
  const totalVoluntarios = voluntarios.length;
  const totalDonacionesCount = donaciones.length;
  const totalContactos = contactos.length;
  const totalEmailsSent = emailLogs.length;

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-base)',
        backgroundImage: 'radial-gradient(at 50% 50%, rgba(138, 43, 226, 0.15) 0px, transparent 50%)',
        padding: '20px'
      }}>
        <div className="glass-panel" style={{
          position: 'relative',
          padding: '3rem',
          maxWidth: '450px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 8px 32px 0 rgba(0, 240, 255, 0.1)',
          border: '1px solid rgba(0, 240, 255, 0.2)'
        }}>
          {/* Close button - redirects to home landing page */}
          <a 
            href="/" 
            style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              color: 'rgba(255,255,255,0.4)',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              textDecoration: 'none'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
            }}
            title="Volver a la Web"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </a>
          <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
            Portal Administrativo
          </h2>
          <p className="overline" style={{ color: 'var(--color-cyan)', fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '2rem' }}>
            CRM La Unión Americana (Insforge Auth)
          </p>

          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            
            {/* Email Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
              <label htmlFor="email" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>Correo Electrónico *</label>
              <input 
                type="email" 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="gerencia@launionamericana.org" 
                required 
                style={{ 
                  padding: '0.9rem', 
                  borderRadius: '10px', 
                  border: '1px solid rgba(255,255,255,0.15)', 
                  background: 'rgba(0,0,0,0.4)', 
                  color: '#fff',
                  fontSize: '1rem'
                }} 
              />
            </div>

            {/* Password Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
              <label htmlFor="password" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>Contraseña *</label>
              <input 
                type="password" 
                id="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                required 
                style={{ 
                  padding: '0.9rem', 
                  borderRadius: '10px', 
                  border: '1px solid rgba(255,255,255,0.15)', 
                  background: 'rgba(0,0,0,0.4)', 
                  color: '#fff',
                  fontSize: '1rem'
                }} 
              />
            </div>

            {errorMsg && (
              <p style={{ color: 'var(--color-magenta)', fontSize: '0.85rem', margin: 0, textAlign: 'left' }}>
                ⚠️ {errorMsg}
              </p>
            )}

            <button disabled={isLoggingIn} type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '0.5rem' }}>
              {isLoggingIn ? 'Iniciando Sesión...' : 'Ingresar al Portal'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Mobile Top Header (visible on mobile only) */}
      <header className="admin-mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src="/Unionamreicana.jpeg" alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
          <h2 style={{ fontSize: '1rem', color: '#fff', margin: 0, fontFamily: 'var(--font-heading)' }}>UA Admin</h2>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {/* Back to web (active session) */}
          <a 
            href="/"
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff',
              fontSize: '0.75rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              fontWeight: 600
            }}
            title="Volver a la Landing Page sin cerrar sesión"
          >
            🌐 Web
          </a>
          <button 
            onClick={() => loadData(authToken)}
            disabled={isLoading}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: '8px',
              background: 'rgba(0, 240, 255, 0.1)',
              border: '1px solid rgba(0, 240, 255, 0.2)',
              color: 'var(--color-cyan)',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
            title="Sincronizar"
          >
            {isLoading ? '...' : '🔄'}
          </button>
          <button 
            onClick={handleLogout}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: '8px',
              background: 'rgba(255, 0, 85, 0.1)',
              border: '1px solid rgba(255, 0, 85, 0.2)',
              color: 'var(--color-magenta)',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            Salir
          </button>
        </div>
      </header>

      {/* Sidebar Navigation (becomes Bottom Bar on Mobile) */}
      <aside className="admin-sidebar">
        {/* Logo & Title (Desktop only) */}
        <div className="admin-logo">
          <img 
            src="/Unionamreicana.jpeg" 
            alt="La Unión Americana" 
            style={{ 
              width: '45px', 
              height: '45px', 
              borderRadius: '50%',
              border: '1.5px solid var(--color-cyan)',
              boxShadow: '0 0 10px rgba(0, 240, 255, 0.3)'
            }} 
          />
          <div>
            <h2>UA Continental</h2>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-cyan)', textTransform: 'uppercase', letterSpacing: '1px' }}>CRM Portal</span>
          </div>
        </div>

        {/* Tab Controls Menu */}
        <div className="admin-menu-list">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'voluntarios', label: 'Voluntarios', icon: '🤝' },
            { id: 'donaciones', label: 'Donaciones', icon: '💰' },
            { id: 'contactos', label: 'Aliados', icon: '✉️' },
            { id: 'emails', label: 'Correos', icon: '📧' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`admin-menu-item ${activeTab === tab.id ? 'active' : ''}`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Desktop Footer Actions */}
        <div className="admin-footer-actions">
          {/* Back to web (active session) */}
          <a 
            href="/"
            style={{
              width: '100%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.75rem',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'rgba(255,255,255,0.8)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
            }}
            title="Volver a la Landing Page sin cerrar sesión"
          >
            🌐 Ver Landing Page
          </a>
          
          <button 
            onClick={() => loadData(authToken)}
            disabled={isLoading}
            style={{
              width: '100%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.75rem',
              borderRadius: '10px',
              background: 'rgba(0, 240, 255, 0.08)',
              border: '1px solid rgba(0, 240, 255, 0.15)',
              color: 'var(--color-cyan)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginTop: '0.5rem'
            }}
          >
            <svg className={isLoading ? 'animate-spin' : ''} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: isLoading ? 'spin 1.5s linear infinite' : 'none' }}>
              <path d="M23 4v6h-6"></path>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
            </svg>
            Sincronizar
          </button>
          
          <button 
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '10px',
              background: 'rgba(255, 0, 85, 0.08)',
              border: '1px solid rgba(255, 0, 85, 0.15)',
              color: 'var(--color-magenta)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginTop: '0.5rem'
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-content-area">
        {/* Desktop Header bar info (Hidden on mobile) */}
        <div className="hidden-mobile" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '1.5rem' }}>
          <div>
            <span className="overline" style={{ fontSize: '0.8rem', color: 'var(--color-cyan)' }}>Administración y Control</span>
            <h1 style={{ fontSize: '2rem', margin: '0.25rem 0 0 0', color: '#fff', fontFamily: 'var(--font-heading)' }}>
              {activeTab === 'dashboard' ? 'Dashboard General' :
               activeTab === 'voluntarios' ? 'Registro de Voluntarios' :
               activeTab === 'donaciones' ? 'Gestión de Donaciones' :
               activeTab === 'contactos' ? 'Aliados y Mensajes' : 'Historial de Correos'}
            </h1>
          </div>
        </div>

        {/* TAB CONTENTS */}
        
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            
            {/* KPI Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
              <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', borderLeft: '4px solid var(--color-cyan)' }}>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>Voluntarios Registrados</span>
                <strong style={{ fontSize: '2.5rem', color: '#fff', margin: '0.5rem 0', fontFamily: 'var(--font-heading)' }}>{totalVoluntarios}</strong>
                <span style={{ fontSize: '0.8rem', color: '#00F0FF' }}>🤝 Talento Continental</span>
              </div>
              <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', borderLeft: '4px solid var(--color-violet)' }}>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>Financiadores e Inversores</span>
                <strong style={{ fontSize: '2.5rem', color: '#fff', margin: '0.5rem 0', fontFamily: 'var(--font-heading)' }}>{totalDonacionesCount}</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-violet)' }}>💰 Empresas & Donaciones</span>
              </div>
              <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', borderLeft: '4px solid var(--color-magenta)' }}>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>Mensajes y Alianzas</span>
                <strong style={{ fontSize: '2.5rem', color: '#fff', margin: '0.5rem 0', fontFamily: 'var(--font-heading)' }}>{totalContactos}</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-magenta)' }}>✉️ Solicitudes del Hub</span>
              </div>
              <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', borderLeft: '4px solid #4caf50' }}>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>Notificaciones Enviadas</span>
                <strong style={{ fontSize: '2.5rem', color: '#fff', margin: '0.5rem 0', fontFamily: 'var(--font-heading)' }}>{totalEmailsSent}</strong>
                <span style={{ fontSize: '0.8rem', color: '#4caf50' }}>📧 Correos Automáticos</span>
              </div>
            </div>

            {/* Graphs & Actions Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              
              {/* CSS Graph Card */}
              <div className="glass-panel" style={{ padding: '2.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>
                  Interacciones por Nodo (País)
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  {[
                    { pais: 'Colombia', valor: 100, color: 'var(--color-cyan)' }
                  ].map((bar, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                        <span style={{ color: '#fff', fontWeight: 600 }}>{bar.pais}</span>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>{bar.valor}% del volumen</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${bar.valor}%`, height: '100%', background: bar.color, borderRadius: '4px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feed Card */}
              <div className="glass-panel" style={{ padding: '2.5rem', maxHeight: '420px', overflowY: 'auto' }}>
                <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>
                  Actividad Reciente (Tiempo Real)
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  {voluntarios.slice(0, 2).map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
                      <div style={{ fontSize: '1.5rem' }}>🤝</div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{item.nombre} se postuló como Voluntario</p>
                        <p style={{ margin: '0.2rem 0 0 0', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>País: {item.pais} | Hace unas horas</p>
                      </div>
                    </div>
                  ))}
                  {donaciones.slice(0, 2).map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
                      <div style={{ fontSize: '1.5rem' }}>💰</div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>Donación de {item.nombre}</p>
                        <p style={{ margin: '0.2rem 0 0 0', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Monto: {item.monto || 'Bienes'} | Hace unas horas</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: VOLUNTARIOS LIST */}
        {activeTab === 'voluntarios' && (
          <div className="glass-panel" style={{ padding: '2rem', overflowX: 'auto' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>
              Registro de Voluntariado Continental
            </h3>
            {voluntarios.length === 0 ? (
              <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '2rem' }}>No hay solicitudes de voluntariado actualmente.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                    <th style={{ padding: '1rem' }}>Nombre</th>
                    <th style={{ padding: '1rem' }}>Contacto</th>
                    <th style={{ padding: '1rem' }}>País</th>
                    <th style={{ padding: '1rem' }}>Mensaje/Habilidades</th>
                    <th style={{ padding: '1rem' }}>Estado</th>
                    <th style={{ padding: '1rem', textAlign: 'center' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {voluntarios.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.95rem' }}>
                      <td style={{ padding: '1.2rem 1rem', fontWeight: 600, color: '#fff' }}>{item.nombre}</td>
                      <td style={{ padding: '1.2rem 1rem' }}>
                        <a href={`mailto:${item.email}`} style={{ color: 'var(--color-cyan)', textDecoration: 'none' }}>{item.email}</a>
                      </td>
                      <td style={{ padding: '1.2rem 1rem' }}>{item.pais || 'No especificado'}</td>
                      <td style={{ padding: '1.2rem 1rem', color: '#aaa', maxWidth: '280px', whiteSpace: 'normal', wordBreak: 'break-word' }}>{item.mensaje || 'Sin detalles'}</td>
                      <td style={{ padding: '1.2rem 1rem' }}>
                        <span style={{ 
                          padding: '0.25rem 0.75rem', 
                          borderRadius: '8px', 
                          fontSize: '0.8rem', 
                          fontWeight: 700,
                          background: item.estado === 'Aprobado' ? 'rgba(76, 175, 80, 0.2)' : item.estado === 'Contactado' ? 'rgba(138, 43, 226, 0.2)' : item.estado === 'Rechazado' ? 'rgba(255, 0, 85, 0.2)' : 'rgba(0, 240, 255, 0.15)',
                          color: item.estado === 'Aprobado' ? '#4caf50' : item.estado === 'Contactado' ? 'var(--color-violet)' : item.estado === 'Rechazado' ? 'var(--color-magenta)' : 'var(--color-cyan)',
                          border: `1px solid ${item.estado === 'Aprobado' ? '#4caf50' : item.estado === 'Contactado' ? 'var(--color-violet)' : item.estado === 'Rechazado' ? 'var(--color-magenta)' : 'var(--color-cyan)'}`
                        }}>
                          {item.estado || 'Nuevo'}
                        </span>
                      </td>
                      <td style={{ padding: '1.2rem 1rem', textAlign: 'center' }}>
                        {updatingId === item.id ? (
                          <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>Procesando...</span>
                        ) : (
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            {(!item.estado || item.estado === 'Nuevo' || item.estado === 'Pendiente') && (
                              <>
                                <button 
                                  onClick={() => handleUpdateVolunteerStatus(item.id, 'Aprobado')}
                                  style={{ padding: '0.35rem 0.75rem', borderRadius: '6px', background: 'rgba(76, 175, 80, 0.15)', border: '1px solid rgba(76, 175, 80, 0.3)', color: '#4caf50', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
                                  title="Aprobar Voluntario"
                                >
                                  ✔️ Aprobar
                                </button>
                                <button 
                                  onClick={() => handleUpdateVolunteerStatus(item.id, 'Contactado')}
                                  style={{ padding: '0.35rem 0.75rem', borderRadius: '6px', background: 'rgba(138, 43, 226, 0.15)', border: '1px solid rgba(138, 43, 226, 0.3)', color: 'var(--color-violet)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
                                  title="Marcar como Contactado"
                                >
                                  📞 Contactar
                                </button>
                                <button 
                                  onClick={() => handleUpdateVolunteerStatus(item.id, 'Rechazado')}
                                  style={{ padding: '0.35rem 0.75rem', borderRadius: '6px', background: 'rgba(255, 0, 85, 0.1)', border: '1px solid rgba(255, 0, 85, 0.2)', color: 'var(--color-magenta)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
                                  title="Rechazar Voluntario"
                                >
                                  ❌ Rechazar
                                </button>
                              </>
                            )}
                            {(item.estado === 'Aprobado' || item.estado === 'Contactado') && (
                              <button 
                                onClick={() => handleUpdateVolunteerStatus(item.id, 'Rechazado')}
                                style={{ padding: '0.35rem 0.75rem', borderRadius: '6px', background: 'rgba(255, 0, 85, 0.1)', border: '1px solid rgba(255, 0, 85, 0.2)', color: 'var(--color-magenta)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
                                title="Rechazar Voluntario"
                              >
                                ❌ Rechazar
                              </button>
                            )}
                            {item.estado === 'Rechazado' && (
                              <>
                                <button 
                                  onClick={() => handleUpdateVolunteerStatus(item.id, 'Pendiente')}
                                  style={{ padding: '0.35rem 0.75rem', borderRadius: '6px', background: 'rgba(0, 240, 255, 0.1)', border: '1px solid rgba(0, 240, 255, 0.2)', color: 'var(--color-cyan)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
                                  title="Reactivar a Pendiente"
                                >
                                  🔄 Reactivar
                                </button>
                                <button 
                                  onClick={() => handleDeleteVolunteer(item.id)}
                                  style={{ padding: '0.35rem 0.75rem', borderRadius: '6px', background: 'rgba(255, 0, 85, 0.2)', border: '1px solid #FF0055', color: '#fff', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
                                  title="Eliminar de la Base de Datos"
                                >
                                  🗑️ Eliminar
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TAB 3: DONACIONES LIST */}
        {activeTab === 'donaciones' && (
          <div className="glass-panel" style={{ padding: '2rem', overflowX: 'auto' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>
              Registro de Donantes y Aliados Financieros
            </h3>
            {donaciones.length === 0 ? (
              <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '2rem' }}>No hay solicitudes de donación registradas.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                    <th style={{ padding: '1rem' }}>Donante / Entidad</th>
                    <th style={{ padding: '1rem' }}>Email</th>
                    <th style={{ padding: '1rem' }}>País</th>
                    <th style={{ padding: '1rem' }}>Detalles de la Contribución</th>
                    <th style={{ padding: '1rem' }}>Monto Est. / Recurso</th>
                  </tr>
                </thead>
                <tbody>
                  {donaciones.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.95rem' }}>
                      <td style={{ padding: '1.2rem 1rem', fontWeight: 600, color: '#fff' }}>{item.nombre}</td>
                      <td style={{ padding: '1.2rem 1rem' }}>
                        <a href={`mailto:${item.email}`} style={{ color: 'var(--color-cyan)', textDecoration: 'none' }}>{item.email}</a>
                      </td>
                      <td style={{ padding: '1.2rem 1rem' }}>{item.pais || 'No especificado'}</td>
                      <td style={{ padding: '1.2rem 1rem', color: '#aaa', maxWidth: '300px', whiteSpace: 'normal', wordBreak: 'break-word' }}>{item.mensaje || 'Sin detalles'}</td>
                      <td style={{ padding: '1.2rem 1rem', fontWeight: 700, color: 'var(--color-cyan)' }}>{item.monto || 'Tangible (Insumos)'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TAB 4: CONTACTOS LIST */}
        {activeTab === 'contactos' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Create Ally Form Panel */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '1.2rem', fontFamily: 'var(--font-heading)' }}>
                🤝 Registrar Nuevo Aliado Continental
              </h3>
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  const target = e.target as HTMLFormElement;
                  const nombre = (target.elements.namedItem('ally_nombre') as HTMLInputElement).value;
                  const email = (target.elements.namedItem('ally_email') as HTMLInputElement).value;
                  const pais = (target.elements.namedItem('ally_pais') as HTMLInputElement).value;
                  const mensaje = (target.elements.namedItem('ally_mensaje') as HTMLTextAreaElement).value;

                  setIsLoading(true);
                  try {
                    const res = await createContactRecord({
                      nombre,
                      email,
                      tipo: 'Organización Aliada',
                      pais,
                      mensaje
                    }, authToken);

                    if (res.success) {
                      target.reset();
                      await loadData(authToken);
                    } else {
                      alert(`Error al registrar aliado: ${res.error}`);
                    }
                  } catch (err: any) {
                    alert(`Error de red: ${err.message}`);
                  } finally {
                    setIsLoading(false);
                  }
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.2rem'
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>Nombre del Aliado *</label>
                    <input required name="ally_nombre" type="text" placeholder="Ej. Fundación Solar" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>Correo Electrónico *</label>
                    <input required name="ally_email" type="email" placeholder="contacto@empresa.com" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>País de Origen</label>
                    <input name="ally_pais" type="text" placeholder="Ej. México" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>Detalles de Alianza / Mensaje</label>
                  <textarea name="ally_mensaje" rows={2} placeholder="Descripción del convenio, interés o tipo de alianza..." style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff', resize: 'vertical' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button 
                    disabled={isLoading}
                    type="submit" 
                    className="btn btn-primary"
                    style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', fontSize: '0.9rem', cursor: 'pointer' }}
                  >
                    {isLoading ? 'Registrando...' : '➕ Registrar Aliado'}
                  </button>
                </div>
              </form>
            </div>

            {/* Allies list table */}
            <div className="glass-panel" style={{ padding: '2rem', overflowX: 'auto' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>
                Bandeja de Entrada — Mensajes y Alianzas Registradas
              </h3>
              {contactos.length === 0 ? (
                <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '2rem' }}>Bandeja de entrada vacía.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                      <th style={{ padding: '1rem' }}>Nombre</th>
                      <th style={{ padding: '1rem' }}>Email</th>
                      <th style={{ padding: '1rem' }}>País</th>
                      <th style={{ padding: '1rem' }}>Mensaje / Detalles</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contactos.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.95rem' }}>
                        <td style={{ padding: '1.2rem 1rem', fontWeight: 600, color: '#fff' }}>{item.nombre}</td>
                        <td style={{ padding: '1.2rem 1rem' }}>
                          <a href={`mailto:${item.email}`} style={{ color: 'var(--color-cyan)', textDecoration: 'none' }}>{item.email}</a>
                        </td>
                        <td style={{ padding: '1.2rem 1rem' }}>{item.pais || 'No especificado'}</td>
                        <td style={{ padding: '1.2rem 1rem', color: '#aaa', maxWidth: '400px', whiteSpace: 'normal', wordBreak: 'break-word' }}>{item.mensaje || 'Sin mensaje'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: EMAILS INFORMATION */}
        {activeTab === 'emails' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                background: 'rgba(0, 240, 255, 0.1)', 
                border: '1.5px solid var(--color-cyan)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 1.5rem auto',
                boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)'
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>

              <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
                Correo Corporativo Oficial
              </h2>
              <p className="overline" style={{ color: 'var(--color-cyan)', fontSize: '0.85rem', letterSpacing: '2px', marginBottom: '2rem' }}>
                La Unión Americana ONG
              </p>

              <div style={{ 
                background: 'rgba(0,0,0,0.3)', 
                border: '1px solid rgba(255,255,255,0.05)', 
                padding: '2rem', 
                borderRadius: '16px', 
                maxWidth: '500px', 
                margin: '0 auto',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Dirección de Email Directo</span>
                <h3 style={{ fontSize: '1.6rem', color: '#fff', margin: '0.5rem 0 1.5rem 0', fontFamily: 'monospace', fontWeight: 'bold' }}>
                  gerencia@launionamericana.org
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', textAlign: 'left', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Propósito:</span>
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>Atención y Alianzas</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Estado del Canal:</span>
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.9rem', color: '#4caf50', fontWeight: 600 }}>🟢 Operacional</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Servidor:</span>
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>Insforge Mail Relay</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Seguridad:</span>
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.9rem', color: 'var(--color-cyan)', fontWeight: 600 }}>SSL/TLS Encrypted</p>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '2.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', maxWidth: '600px', margin: '2.5rem auto 0 auto', lineHeight: '1.6' }}>
                <p>
                  Este canal de comunicación está enlazado directamente a los sistemas de correspondencia de la ONG. Cualquier solicitud, registro de voluntariado o aportación monetaria se procesa en tiempo real y notifica a esta dirección de manera inmediata.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
