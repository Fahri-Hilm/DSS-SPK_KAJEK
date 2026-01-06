import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

const ParallaxBackground: React.FC = () => {
    // Mouse position state
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Smooth spring animation for mouse movement
    const springConfig = { stiffness: 50, damping: 20 };
    const mouseX = useSpring(0, springConfig);
    const mouseY = useSpring(0, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            // Normalize coordinates to -1 to 1
            const x = (clientX / window.innerWidth) * 2 - 1;
            const y = (clientY / window.innerHeight) * 2 - 1;

            mouseX.set(x);
            mouseY.set(y);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    // Layer movement factors (negative moves opposite to mouse, positive moves with mouse)
    // Deep shapes move less (background), closer shapes move more (foreground effect)

    // Background Layer 1 (Slowest - Far)
    const layer1X = useTransform(mouseX, [-1, 1], [-20, 20]);
    const layer1Y = useTransform(mouseY, [-1, 1], [-20, 20]);

    // Background Layer 2 (Medium - Mid)
    const layer2X = useTransform(mouseX, [-1, 1], [40, -40]); // Moves opposite
    const layer2Y = useTransform(mouseY, [-1, 1], [40, -40]);

    // Foreground Accent (Fastest - Near)
    const layer3X = useTransform(mouseX, [-1, 1], [-60, 60]);
    const layer3Y = useTransform(mouseY, [-1, 1], [-60, 60]);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Layer 1: Deep Blue Blob */}
            <motion.div
                className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-600/5 rounded-full blur-[100px] mix-blend-screen"
                style={{ x: layer1X, y: layer1Y }}
            />

            {/* Layer 2: Purple Nebula (Moves Opposite) */}
            <motion.div
                className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] bg-purple-600/5 rounded-full blur-[120px] mix-blend-screen"
                style={{ x: layer2X, y: layer2Y }}
            />

            {/* Layer 3: Accent Highlights (Dynamic) */}
            <motion.div
                className="absolute top-[30%] left-[60%] w-[20vw] h-[20vw] bg-emerald-500/5 rounded-full blur-[80px] mix-blend-screen"
                style={{ x: layer3X, y: layer3Y }}
            />

            {/* Grid Pattern Overlay (Static but adds texture) */}
            <div className="absolute inset-0 bg-grid-white/[0.02] opacity-50" />
        </div>
    );
};

export default ParallaxBackground;
