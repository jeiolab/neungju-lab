import React, { useEffect, useState } from 'react';

const Confetti: React.FC = () => {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string }[]>([]);

  useEffect(() => {
    const colors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];
    const newParticles = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p, i) => (
        <div
          key={p.id}
          className="absolute w-3 h-3 rounded-full animate-float"
          style={{
            left: `${p.x}%`,
            top: `${Math.random() * 100}%`,
            backgroundColor: p.color,
            animation: `float ${2 + Math.random() * 3}s linear infinite`,
            opacity: 0.8
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
