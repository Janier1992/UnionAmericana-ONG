'use client';

import { motion } from 'framer-motion';
import NetworkBackground from './NetworkBackground';

export default function Hero() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  };
  const item = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
  };

  return (
    <section className="ld-hero" id="inicio">
      <div
        className="hero__background ld-hero__bg"
        style={{ backgroundImage: 'url(/images/hero_humanitarian.png)' }}
      />
      <div className="ld-hero__shade" />
      <div className="ld-hero__dots" aria-hidden="true" />

      {/* Contorno del continente que se dibuja solo */}
      <div className="hero__map ld-hero__map" aria-hidden="true">
        <svg viewBox="0 0 1000 1200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            className="ld-mapline"
            pathLength={1}
            d="M500 50 C520 55, 540 65, 530 100 C520 135, 480 180, 500 200 C520 220, 560 260, 540 300 C520 340, 480 380, 500 420 C520 460, 540 480, 520 520 C500 560, 470 600, 490 640 C510 680, 530 720, 520 760 C510 800, 490 840, 510 880 C530 920, 500 960, 480 1000 C470 1020, 460 1050, 450 1080 C440 1100, 420 1110, 400 1090 C380 1070, 390 1040, 410 1010 C430 980, 420 940, 440 900 C460 860, 450 820, 470 780 C490 740, 480 700, 460 660 C440 620, 450 580, 430 540 C410 500, 390 460, 410 420 C430 380, 450 340, 430 300 C410 260, 430 220, 450 180 C470 140, 480 100, 500 70 C500 60, 500 50, 500 50Z"
          />
          <path
            className="ld-mapline"
            pathLength={1}
            style={{ animationDelay: '1.2s' }}
            d="M550 150 C580 160, 600 180, 610 220 C620 260, 600 300, 590 340 C580 380, 560 400, 590 440 C620 480, 580 520, 600 560"
          />
          <path
            className="ld-mapline"
            pathLength={1}
            style={{ animationDelay: '2.2s' }}
            d="M400 200 C380 210, 360 230, 340 270 C320 310, 340 350, 330 390 C320 430, 340 460, 360 500"
          />
        </svg>
      </div>

      <NetworkBackground />

      <motion.div className="ld-hero__content" variants={container} initial="hidden" animate="show">
        <motion.p className="ld-eyebrow" variants={item}>
          <span className="ld-eyebrow__dot" />
          ONG panlatinoamericana · Fundada en 2026
        </motion.p>

        <motion.h1 className="ld-hero__title" variants={item}>
          <span>Una sola fuerza.</span>
          <span className="ld-hero__outline">Cien naciones.</span>
          <span className="ld-hero__grad">Un solo corazón.</span>
        </motion.h1>

        <motion.div className="ld-hero__foot" variants={item}>
          <p className="ld-hero__quote">
            &ldquo;América Latina no necesita el sueño americano. Necesita despertar el suyo propio.&rdquo;
          </p>
          <div className="ld-hero__cta">
            <a href="/donaciones" className="ld-btn ld-btn--solid">Apoyar la causa</a>
            <a href="/unete" className="ld-btn ld-btn--ghost">Ser voluntario</a>
          </div>
        </motion.div>

        <div className="ld-scroll" aria-hidden="true"><span /></div>
      </motion.div>
    </section>
  );
}
