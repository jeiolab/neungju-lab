import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  delay: number;
}

const COLORS = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];

const Confetti: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100, // vw
        y: -10, // start above screen
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 2,
      });
    }
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-3 h-3 rounded-full opacity-80"
          style={{
            left: `${p.x}vw`,
            backgroundColor: p.color,
            top: '-20px',
            animation: `fall 3s linear forwards ${p.delay}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(110vh) rotate(720deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Confetti;