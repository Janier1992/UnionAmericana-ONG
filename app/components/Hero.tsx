'use client';

import { motion } from 'framer-motion';

export default function Hero() {
  // Staggering variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    show: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { duration: 0.6 } 
    }
  };

  return (
    <section className="hero" id="inicio">
      <div className="hero__background" style={{ 
        backgroundImage: 'url(/images/hero_humanitarian.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.3
      }} />

      <div className="hero__map">
        <svg viewBox="0 0 1000 1200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g stroke="rgba(232,228,223,0.5)" strokeWidth="0.5" fill="none">
            <path d="M500 50 C520 55, 540 65, 530 100 C520 135, 480 180, 500 200 C520 220, 560 260, 540 300
                     C520 340, 480 380, 500 420 C520 460, 540 480, 520 520 C500 560, 470 600, 490 640
                     C510 680, 530 720, 520 760 C510 800, 490 840, 510 880 C530 920, 500 960, 480 1000
                     C470 1020, 460 1050, 450 1080 C440 1100, 420 1110, 400 1090 C380 1070, 390 1040,
                     410 1010 C430 980, 420 940, 440 900 C460 860, 450 820, 470 780 C490 740, 480 700,
                     460 660 C440 620, 450 580, 430 540 C410 500, 390 460, 410 420 C430 380, 450 340,
                     430 300 C410 260, 430 220, 450 180 C470 140, 480 100, 500 70 C500 60, 500 50,
                     500 50Z" strokeDasharray="2 4"/>
            <path d="M550 150 C580 160, 600 180, 610 220 C620 260, 600 300, 590 340 C580 380, 560 400,
                     590 440 C620 480, 580 520, 600 560"/>
            <path d="M400 200 C380 210, 360 230, 340 270 C320 310, 340 350, 330 390 C320 430, 340 460,
                     360 500"/>
          </g>
        </svg>
      </div>

      <motion.div 
        className="hero__content"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div className="hero__overline" variants={itemVariants}>
          <span className="overline">Fundada en 2026</span>
        </motion.div>
        
        <motion.h1 className="hero__title" variants={itemVariants}>
          La Unión<br />
          <em>Americana</em>
        </motion.h1>
        
        <motion.p className="hero__subtitle" variants={itemVariants}>
          &ldquo;América Latina no necesita el sueño americano.<br/>Necesita despertar el suyo propio.&rdquo;
        </motion.p>
        
        <motion.div className="hero__cta" variants={itemVariants}>
          <a href="#mision" className="btn btn-primary">Visión 2040</a>
          <a href="#pilares" className="btn btn-secondary">Nuestro Modelo</a>
        </motion.div>
      </motion.div>
    </section>
  );
}
