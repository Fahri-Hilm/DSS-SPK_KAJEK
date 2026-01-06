import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Zap, RotateCw } from 'lucide-react';
import { clsx } from 'clsx';

interface ReactorThemeProps {
    currentTheme: string;
    onThemeChange: (theme: string) => void;
}

const ReactorTheme: React.FC<ReactorThemeProps> = ({ currentTheme, onThemeChange }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isSpinning, setIsSpinning] = useState(false);

    const themes = [
        { id: 'dark', label: 'Dark Matter', color: 'blue', icon: Moon },
        { id: 'light', label: 'Solar Flare', color: 'amber', icon: Sun },
        { id: 'blue', label: 'Deep Ocean', color: 'cyan', icon: Zap },
    ];

    const activeThemeIndex = themes.findIndex(t => t.id === currentTheme);
    const activeTheme = themes[activeThemeIndex] || themes[0];

    const cycleTheme = () => {
        setIsSpinning(true);
        const nextIndex = (activeThemeIndex + 1) % themes.length;
        onThemeChange(themes[nextIndex].id);

        // Reset spin trigger after animation
        setTimeout(() => setIsSpinning(false), 500);
    };

    const getGlowColor = (color: string) => {
        switch (color) {
            case 'amber': return 'shadow-amber-500/50 border-amber-400/50';
            case 'cyan': return 'shadow-cyan-500/50 border-cyan-400/50';
            default: return 'shadow-blue-600/50 border-blue-500/50';
        }
    };

    const getBgColor = (color: string) => {
        switch (color) {
            case 'amber': return 'bg-amber-500';
            case 'cyan': return 'bg-cyan-500';
            default: return 'bg-blue-600';
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-black/20 rounded-3xl border border-white/5 relative overflow-hidden group">
            {/* Background Effects */}
            <div className={clsx(
                "absolute inset-0 transition-opacity duration-1000 opacity-20 bg-gradient-to-tr",
                activeTheme.color === 'amber' ? "from-amber-500/20 to-transparent" :
                    activeTheme.color === 'cyan' ? "from-cyan-500/20 to-transparent" :
                        "from-blue-600/20 to-transparent"
            )} />

            <h3 className="text-xl font-bold text-white mb-8 tracking-widest uppercase flex items-center gap-2">
                <RotateCw size={16} className={clsx("transition-all duration-700", isSpinning && "rotate-180")} />
                Reactor Core Theme
            </h3>

            {/* The Reactor */}
            <div
                className="relative w-48 h-48 cursor-pointer"
                onClick={cycleTheme}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Outer Ring */}
                <motion.div
                    className={clsx(
                        "absolute inset-0 rounded-full border-4 border-dashed",
                        activeTheme.color === 'amber' ? "border-amber-500/30" :
                            activeTheme.color === 'cyan' ? "border-cyan-500/30" :
                                "border-blue-500/30"
                    )}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, ease: "linear", repeat: Infinity }}
                />

                {/* Counter Ring */}
                <motion.div
                    className="absolute inset-4 rounded-full border-2 border-white/10"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, ease: "linear", repeat: Infinity }}
                />

                {/* Core Container */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        className={clsx(
                            "w-24 h-24 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-500 shadow-[0_0_50px_rgba(0,0,0,0.5)] border-2",
                            getGlowColor(activeTheme.color)
                        )}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        animate={{
                            boxShadow: isHovered
                                ? `0 0 80px ${activeTheme.color === 'amber' ? 'rgba(245, 158, 11, 0.6)' : activeTheme.color === 'cyan' ? 'rgba(6, 182, 212, 0.6)' : 'rgba(37, 99, 235, 0.6)'}`
                                : `0 0 30px ${activeTheme.color === 'amber' ? 'rgba(245, 158, 11, 0.3)' : activeTheme.color === 'cyan' ? 'rgba(6, 182, 212, 0.3)' : 'rgba(37, 99, 235, 0.3)'}`
                        }}
                    >
                        {/* Inner Plasma */}
                        <motion.div
                            className={clsx(
                                "w-16 h-16 rounded-full blur-md transition-colors duration-500",
                                getBgColor(activeTheme.color)
                            )}
                            animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />

                        {/* Icon Overlay */}
                        <div className="absolute z-10 text-white drop-shadow-lg">
                            <activeTheme.icon size={32} />
                        </div>
                    </motion.div>
                </div>

                {/* Floating Particles */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className={clsx("absolute w-1 h-1 rounded-full", getBgColor(activeTheme.color))}
                        initial={{ x: 0, y: 0, opacity: 0 }}
                        animate={{
                            x: (Math.random() - 0.5) * 150,
                            y: (Math.random() - 0.5) * 150,
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0]
                        }}
                        transition={{
                            duration: 2 + Math.random(),
                            repeat: Infinity,
                            delay: Math.random() * 2
                        }}
                        style={{ left: '50%', top: '50%' }}
                    />
                ))}
            </div>

            {/* Label */}
            <div className="mt-8 text-center">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Active Core</p>
                <motion.div
                    key={activeTheme.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={clsx(
                        "text-2xl font-black font-mono",
                        activeTheme.color === 'amber' ? "text-amber-400" :
                            activeTheme.color === 'cyan' ? "text-cyan-400" :
                                "text-blue-400"
                    )}
                >
                    {activeTheme.label}
                </motion.div>
                <p className="text-[10px] text-slate-600 mt-2">CLICK CORE TO SWITCH</p>
            </div>
        </div>
    );
};

export default ReactorTheme;
