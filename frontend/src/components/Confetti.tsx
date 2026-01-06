import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const colors = ['#f59e0b', '#ef4444', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899'];

interface Particle {
    id: number;
    x: number;
    y: number;
    color: string;
    rotation: number;
    scale: number;
}

const Confetti: React.FC = () => {
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        const particleCount = 60;
        const newParticles: Particle[] = [];

        // Center burst origin
        const startX = window.innerWidth / 2;
        const startY = window.innerHeight / 2;

        for (let i = 0; i < particleCount; i++) {
            newParticles.push({
                id: i,
                x: (Math.random() - 0.5) * window.innerWidth * 1.5, // Spread wide
                y: (Math.random() - 0.5) * window.innerHeight * 1.5, // Spread high
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                scale: Math.random() * 0.5 + 0.5,
            });
        }

        setParticles(newParticles);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute w-3 h-3 rounded-sm"
                    initial={{
                        x: "50vw",
                        y: "50vh",
                        scale: 0,
                        opacity: 1
                    }}
                    animate={{
                        x: `calc(50vw + ${p.x}px)`,
                        y: `calc(50vh + ${p.y}px)`,
                        rotate: p.rotation + 720,
                        scale: p.scale,
                        opacity: 0
                    }}
                    transition={{
                        duration: Math.random() * 2 + 1.5, // 1.5 to 3.5 seconds
                        ease: [0.25, 0.1, 0.25, 1], // Cubic bezier for explosive pop
                    }}
                    style={{ backgroundColor: p.color }}
                />
            ))}
        </div>
    );
};

export default Confetti;
