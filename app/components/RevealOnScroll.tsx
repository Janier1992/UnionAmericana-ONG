'use client';

import { useEffect, useRef } from 'react';

export function useRevealOnScroll() {
  const revealObserver = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    revealObserver.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.current?.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => revealObserver.current?.observe(el));

    return () => revealObserver.current?.disconnect();
  }, []);
}

export function useParallax() {
  useEffect(() => {
    const handleScroll = () => {
      const map = document.querySelector('.hero__map');
      if (!map) return;
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      if (scrollY < vh * 1.2) {
        (map as HTMLElement).style.transform = `translateY(${scrollY * 0.3}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
}

export function useSmoothScroll() {
  useEffect(() => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      const handler = (e: Event) => {
        const target = document.querySelector(anchor.getAttribute('href')!);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          document.querySelector('.nav-menu')?.classList.remove('active');
        }
      };
      anchor.addEventListener('click', handler);
      return () => anchor.removeEventListener('click', handler);
    });
  }, []);
}
