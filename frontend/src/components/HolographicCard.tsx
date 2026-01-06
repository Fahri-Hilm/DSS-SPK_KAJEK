import React, { useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { clsx } from 'clsx';

interface HolographicCardProps {
    children: React.ReactNode;
    className?: string;
    intensity?: number; // 1 to 10 scale for effect intensity
}

const HolographicCard: React.FC<HolographicCardProps> = ({
    children,
    className,
    intensity = 5
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const rectRef = useRef<DOMRect | null>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Mouse position tracking
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth physics for the mouse movement
    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    // Calculate rotation based on mouse position relative to center
    // Higher intensity = more rotation
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [`${intensity * 2}deg`, `-${intensity * 2}deg`]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [`-${intensity * 2}deg`, `${intensity * 2}deg`]);

    // Spotlight gradient position
    // We map -0.5 to 0.5 range to 0% to 100% for the gradient
    const gradientX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
    const gradientY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

    // Dynamic sheen gradient
    const sheenGradient = useMotionTemplate`radial-gradient(
        circle at ${gradientX} ${gradientY},
        rgba(255, 255, 255, 0.15) 0%,
        rgba(255, 255, 255, 0.05) 20%,
        transparent 80%
    )`;

    const handleMouseEnter = () => {
        setIsHovered(true);
        if (ref.current) {
            rectRef.current = ref.current.getBoundingClientRect();
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!rectRef.current) return;

        const rect = rectRef.current;
        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Calculate normalized position (-0.5 to 0.5)
        const xPct = (mouseX / width) - 0.5;
        const yPct = (mouseY / height) - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
        rectRef.current = null;
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                transformStyle: "preserve-3d",
                rotateX,
                rotateY,
            }}
            className={clsx("relative perspective-1000", className)}
        >
            {/* Main Content */}
            <div className="relative z-10 h-full w-full">
                {children}
            </div>

            {/* Glossy Overlay (Spotlight) */}
            <motion.div
                className="absolute inset-0 rounded-2xl z-20 pointer-events-none opacity-0 transition-opacity duration-300"
                style={{ background: sheenGradient, opacity: isHovered ? 1 : 0 }}
            />

            {/* Border Glow for extra depth */}
            <motion.div
                className="absolute inset-0 rounded-2xl z-30 pointer-events-none border border-white/10"
                style={{
                    boxShadow: isHovered ? "0 0 20px rgba(59, 130, 246, 0.3)" : "none",
                    transition: "box-shadow 0.3s ease"
                }}
            />
        </motion.div>
    );
};

export default HolographicCard;
