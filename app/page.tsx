'use client';

import Hero from './components/Hero';
import Mission from './components/Mission';
import Pillars from './components/Pillars';
import Impact from './components/Impact';
import Contact from './components/Contact';
import { useParallax, useSmoothScroll } from './components/RevealOnScroll';

export default function HomePage() {
  // Initialize custom hooks for parallax/scroll (if still needed)
  useParallax();
  useSmoothScroll();

  return (
    <>
      <Hero />
      <Mission />
      <Pillars />
      <Impact />
      
      {/* Cinematic 2040 Vision Banner */}
      <section style={{ height: '35vh', width: '100%', position: 'relative', overflow: 'hidden' }}>
        <img 
          src="/images/latam_realista_medellin.png" 
          alt="Lucha por transformar América Latina y el Caribe - Medellín" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6)' }} 
        />
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)', padding: '0 20px' }}>
          <h2 style={{ 
            color: 'var(--color-text-main)', 
            fontSize: 'clamp(1.5rem, 3.5vw, 3rem)', 
            fontFamily: 'var(--font-heading)', 
            textAlign: 'center', 
            textShadow: '0 4px 15px rgba(0,0,0,0.9)',
            lineHeight: 1.2,
            maxWidth: '1000px'
          }}>
            Hacia una lucha por transformar América Latina y el Caribe. <br/>
            <span style={{ color: 'var(--color-primary-main)', fontWeight: 'bold' }}>Juntos somos imparables.</span>
          </h2>
        </div>
      </section>

      <Contact />
    </>
  );
}
