'use client';

import { useEffect, useRef } from 'react';

/**
 * Fondo animado "red de naciones": puntos de luz que flotan, se conectan entre
 * sí con un destello que corre por cada enlace y reaccionan suavemente al cursor.
 * - Se pausa cuando no es visible o la pestaña está en segundo plano.
 * - Respeta prefers-reduced-motion (dibuja un cuadro estático).
 * - Menos nodos en pantallas pequeñas para cuidar el rendimiento.
 */

type Node = { x: number; y: number; vx: number; vy: number; r: number; hub: boolean; phase: number };

const LINK_DISTANCE = 170;
const MOUSE_RADIUS = 190;

export default function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    let raf = 0;
    let onScreen = true;
    const mouse = { x: -9999, y: -9999 };

    const build = () => {
      const count = Math.round(Math.min(72, Math.max(20, (width * height) / 24000)));
      nodes = Array.from({ length: count }, (_, i) => {
        const hub = i % 7 === 0;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
          r: hub ? 3.4 : 1.6 + Math.random() * 1.2,
          hub,
          phase: Math.random() * Math.PI * 2,
        };
      });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
      draw(performance.now());
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      // Enlaces con destello que corre a lo largo de la línea
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 14]);
      ctx.lineDashOffset = reduceMotion ? 0 : -time * 0.02;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DISTANCE) {
            const alpha = (1 - dist / LINK_DISTANCE) * 0.55;
            ctx.strokeStyle = `rgba(124, 203, 255, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        // Enlaces hacia el cursor
        const mdx = a.x - mouse.x;
        const mdy = a.y - mouse.y;
        const md = Math.hypot(mdx, mdy);
        if (md < MOUSE_RADIUS) {
          ctx.strokeStyle = `rgba(111, 224, 58, ${(1 - md / MOUSE_RADIUS) * 0.7})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
      ctx.setLineDash([]);

      // Nodos que laten
      for (const n of nodes) {
        const pulse = reduceMotion ? 1 : 1 + 0.35 * Math.sin(time * 0.002 + n.phase);
        const radius = n.r * pulse;
        const color = n.hub ? '111, 224, 58' : '124, 203, 255';
        ctx.fillStyle = `rgba(${color}, 0.16)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius * 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(${color}, 0.95)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = (time: number) => {
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20) n.x = width + 20;
        if (n.x > width + 20) n.x = -20;
        if (n.y < -20) n.y = height + 20;
        if (n.y > height + 20) n.y = -20;

        // Leve atracción hacia el cursor
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const d = Math.hypot(dx, dy);
        if (d < MOUSE_RADIUS && d > 1) {
          n.x += (dx / d) * 0.35;
          n.y += (dy / d) * 0.35;
        }
      }
      draw(time);
    };

    const loop = (time: number) => {
      if (onScreen && !document.hidden) step(time);
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    resize();
    window.addEventListener('resize', resize);
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
    });
    observer.observe(canvas);

    if (!reduceMotion) {
      window.addEventListener('mousemove', onMove, { passive: true });
      window.addEventListener('mouseleave', onLeave);
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="ld-network" aria-hidden="true" />;
}
