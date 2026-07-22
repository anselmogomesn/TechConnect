import { useEffect, useRef } from 'react';

interface Particle {
  x: number; y: number; vx: number; vy: number;
  size: number; alpha: number; life: number; maxLife: number;
  type: 'particle' | 'code' | 'glow';
  char?: string;
}

export function TechBackground({ variant = 'auth' }: { variant?: 'auth' | 'app' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particles: Particle[] = [];

    const chars = '01'.split('');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initParticles = () => {
      particles = [];
      const count = variant === 'auth' ? 80 : 30;
      for (let i = 0; i < count; i++) {
        const type = Math.random() > 0.7 ? 'code' : Math.random() > 0.5 ? 'glow' : 'particle';
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: type === 'glow' ? Math.random() * 80 + 40 : Math.random() * 2 + 1,
          alpha: type === 'glow' ? Math.random() * 0.08 + 0.02 : Math.random() * 0.4 + 0.1,
          life: 0,
          maxLife: Math.random() * 300 + 200,
          type,
          char: type === 'code' ? chars[Math.floor(Math.random() * chars.length)] : undefined,
        });
      }
    };

    resize();
    initParticles();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const fade = Math.min(p.life / 100, 1) * Math.min((p.maxLife - p.life) / 100, 1);
        const alpha = p.alpha * Math.max(0, fade);

        if (p.type === 'glow') {
          // Glowing orbs
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          gradient.addColorStop(0, `rgba(99, 102, 241, ${alpha * 0.5})`);
          gradient.addColorStop(0.5, `rgba(139, 92, 246, ${alpha * 0.2})`);
          gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
          ctx.fillStyle = gradient;
          ctx.fillRect(p.x - p.size, p.y - p.size, p.size * 2, p.size * 2);
        } else if (p.type === 'code') {
          // Floating binary digits
          ctx.font = `${p.size * 8}px "JetBrains Mono", monospace`;
          ctx.fillStyle = `rgba(99, 102, 241, ${alpha * 0.3})`;
          ctx.fillText(p.char || '0', p.x, p.y);
        } else {
          // Small dots
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(99, 102, 241, ${alpha * 0.4})`;
          ctx.fill();
        }

        // Reset particle
        if (p.life >= p.maxLife) {
          const type = Math.random() > 0.7 ? 'code' : Math.random() > 0.5 ? 'glow' : 'particle';
          particles[i] = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: type === 'glow' ? Math.random() * 80 + 40 : Math.random() * 2 + 1,
            alpha: type === 'glow' ? Math.random() * 0.08 + 0.02 : Math.random() * 0.4 + 0.1,
            life: 0,
            maxLife: Math.random() * 300 + 200,
            type,
            char: type === 'code' ? chars[Math.floor(Math.random() * chars.length)] : undefined,
          };
        }
      });

      // Connection lines between close particles
      if (variant === 'auth') {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `rgba(99, 102, 241, ${0.05 * (1 - dist / 150)})`;
              ctx.stroke();
            }
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
