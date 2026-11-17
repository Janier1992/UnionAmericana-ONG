'use client';

import Hero from './components/Hero';
import Ticker from './components/Ticker';
import Mission from './components/Mission';
import Pillars from './components/Pillars';
import Impact from './components/Impact';
import Roadmap from './components/Roadmap';
import CallToAction from './components/CallToAction';
import Contact from './components/Contact';
import { useParallax, useSmoothScroll, useRevealOnScroll } from './components/RevealOnScroll';

export default function HomePage() {
  useParallax();
  useSmoothScroll();
  useRevealOnScroll();

  return (
    <>
      {/* Luces ambientales que derivan despacio detrás de toda la página */}
      <div className="ld-ambient" aria-hidden="true">
        <span className="ld-glow ld-glow--blue" />
        <span className="ld-glow ld-glow--green" />
      </div>

      <div className="ld-page">
        <Hero />
        <Ticker />
        <Mission />
        <Pillars />
        <Impact />
        <Roadmap />
        <CallToAction />
        <Contact />
      </div>
    </>
  );
}
