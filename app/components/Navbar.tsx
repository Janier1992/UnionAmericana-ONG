'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 100);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const navLinks = [
    { href: '/#inicio', label: 'Inicio' },
    { href: '/#pilares', label: 'Modelo' },
    { href: '/#proyecciones', label: 'Proyecciones' },
    { href: '/donaciones', label: 'Donaciones y Contribuciones', icon: true },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <a href="/#inicio" className="nav-logo">
        <Image
          src="/Unionamreicana.jpeg"
          alt="La Unión Americana — Logo"
          width={70}
          height={70}
          style={{ 
            height: '70px', 
            width: '70px', 
            objectFit: 'cover',
            borderRadius: '50%', 
            border: '2px solid rgba(0, 240, 255, 0.3)',
            boxShadow: '0 0 15px rgba(0, 240, 255, 0.4)'
          }}
        />
        <h1>La Unión Americana</h1>
      </a>

      <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
        {navLinks.map((link) => (
          <li key={link.label}>
            <a href={link.href} className="nav-link" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {link.icon && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-cyan)' }}>
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              )}
              {link.label}
            </a>
          </li>
        ))}
        <li className="nav-cta">
          <a href="/unete" className="btn btn-primary" onClick={closeMenu}>
            Únete
          </a>
        </li>
      </ul>

      <button
        className="nav-toggle"
        aria-label="Abrir menú"
        aria-expanded={menuOpen ? 'true' : 'false'}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span /><span /><span />
      </button>
    </nav>
  );
}
