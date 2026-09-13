import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  rotation: number;
  vRot: number;
  type: 'petal' | 'star' | 'sparkle';
  color: string;
}

export const CursorParticleWand: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const animIdRef = useRef<number>(0);

  const colors = [
    'rgba(255, 125, 167, ', // Rose Glow
    'rgba(255, 42, 133, ',  // Neon Pink
    'rgba(255, 215, 0, ',   // Gold Stardust
    'rgba(252, 248, 249, ', // Silk White
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const spawnParticles = (x: number, y: number, speed: number) => {
      const count = Math.min(Math.floor(speed * 0.35) + 1, 4);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 1.6 + 0.3;
        const types: ('petal' | 'star' | 'sparkle')[] = ['petal', 'star', 'sparkle'];
        const type = types[Math.floor(Math.random() * types.length)];
        const baseColor = colors[Math.floor(Math.random() * colors.length)];

        particlesRef.current.push({
          x: x + (Math.random() - 0.5) * 8,
          y: y + (Math.random() - 0.5) * 8,
          vx: Math.cos(angle) * velocity + (Math.random() - 0.5) * 0.5,
          vy: Math.sin(angle) * velocity - 0.4, // slight upward float
          size: type === 'petal' ? Math.random() * 5 + 3 : Math.random() * 3 + 1.5,
          alpha: 1,
          life: 0,
          maxLife: Math.floor(Math.random() * 25) + 20,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.15,
          type,
          color: baseColor,
        });
      }
      if (particlesRef.current.length > 120) {
        particlesRef.current.splice(0, particlesRef.current.length - 120);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const current = { x: e.clientX, y: e.clientY };
      if (lastPosRef.current) {
        const dx = current.x - lastPosRef.current.x;
        const dy = current.y - lastPosRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 4) {
          spawnParticles(current.x, current.y, dist);
        }
      }
      lastPosRef.current = current;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const current = { x: touch.clientX, y: touch.clientY };
        spawnParticles(current.x, current.y, 8);
        lastPosRef.current = current;
      }
    };

    const handleClick = (e: MouseEvent) => {
      // Explosive burst of 4-point diamond stars and gold motes on click
      const burstCount = 18;
      for (let i = 0; i < burstCount; i++) {
        const angle = (Math.PI * 2 * i) / burstCount + (Math.random() - 0.5) * 0.35;
        const velocity = Math.random() * 4.5 + 2.0;
        const types: ('star' | 'sparkle' | 'petal')[] = ['star', 'sparkle', 'star'];
        const type = types[Math.floor(Math.random() * types.length)];
        const starColors = [
          'rgba(255, 215, 0, ',   // Gold diamond
          'rgba(255, 125, 167, ', // Rose Glow
          'rgba(255, 255, 255, ', // Brilliant White
          'rgba(255, 60, 140, ',  // Neon Magenta
        ];
        const color = starColors[Math.floor(Math.random() * starColors.length)];

        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity - 1.2,
          size: type === 'star' ? Math.random() * 6 + 4 : Math.random() * 3 + 2,
          alpha: 1,
          life: 0,
          maxLife: Math.floor(Math.random() * 30) + 25,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.25,
          type,
          color,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;
        p.vy += 0.018; // soft gravity
        p.vx *= 0.98; // fluid drag
        p.alpha = Math.max(0, 1 - p.life / p.maxLife);

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.alpha * 0.85;

        if (p.type === 'petal') {
          // Curved organic petal shape
          ctx.fillStyle = `${p.color}${p.alpha})`;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 1.4, p.size * 0.8, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'star') {
          // 4-point twinkling star
          ctx.fillStyle = `${p.color}${p.alpha})`;
          ctx.beginPath();
          const s = p.size;
          ctx.moveTo(0, -s * 1.5);
          ctx.quadraticCurveTo(0, 0, s * 1.5, 0);
          ctx.quadraticCurveTo(0, 0, 0, s * 1.5);
          ctx.quadraticCurveTo(0, 0, -s * 1.5, 0);
          ctx.quadraticCurveTo(0, 0, 0, -s * 1.5);
          ctx.fill();
        } else {
          // Sparkling circular mote with glow
          ctx.fillStyle = `${p.color}${p.alpha})`;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      animIdRef.current = requestAnimationFrame(render);
    };

    animIdRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animIdRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
    />
  );
};
