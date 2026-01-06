import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface MagneticButtonProps {
    children: React.ReactNode;
    className?: string;
    strength?: number; // How strong the magnetic pull is (higher = stronger pull range)
    onClick?: () => void;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({
    children,
    className = "",
    strength = 30, // Default strength
    onClick
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current?.getBoundingClientRect() || { left: 0, top: 0, width: 0, height: 0 };

        const hoverArea = 20; // Extra area around button to trigger effect if desired, usually bounds are enough

        // Calculate center of the element
        const centerX = left + width / 2;
        const centerY = top + height / 2;

        // Calculate distance from center
        const x = (clientX - centerX) / (width / 2); // Normalized -1 to 1 roughly
        const y = (clientY - centerY) / (height / 2);

        // Apply magnetic strength
        setPosition({ x: x * strength, y: y * strength });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    const { x, y } = position;

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            animate={{ x, y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            className={`inline-block cursor-pointer ${className}`}
        >
            {children}
        </motion.div>
    );
};

export default MagneticButton;
