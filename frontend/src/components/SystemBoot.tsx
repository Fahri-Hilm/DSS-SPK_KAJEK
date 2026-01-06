import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, Database, BarChart2, CheckCircle, Activity, Layers, Cpu } from 'lucide-react';
import { clsx } from 'clsx';
import { useTheme } from '../context/ThemeContext'; // Ensure we use the global theme

interface SystemBootProps {
    onComplete: () => void;
}

const SystemBoot: React.FC<SystemBootProps> = ({ onComplete }) => {
    const [lines, setLines] = useState<string[]>([]);
    const [bootProgress, setBootProgress] = useState(0);
    const [phase, setPhase] = useState<'init' | 'processing' | 'ready'>('init');
    const { theme } = useTheme();

    // Professional DSS Boot Log
    const bootLog = [
        "INITIALIZING ANALYTICS ENGINE...",
        "CONNECTING TO VENDOR DATABASE...",
        "LOADING CRITERIA WEIGHTS (W1-W5)...",
        "NORMALIZING DATA MATRICES...",
        "CALIBRATING TOPSIS ALGORITHMS...",
        "VALIDATING DECISION MODELS...",
        "GENERATING REAL-TIME RANKINGS...",
        "PREPARING VISUALIZATION MODULES...",
        "DASHBOARD READY."
    ];

    useEffect(() => {
        // Line-by-line typing effect with faster, more professional timing
        let delay = 0;
        bootLog.forEach((line, index) => {
            delay += Math.random() * 200 + 150;
            setTimeout(() => {
                setLines(prev => [...prev, line]);
            }, delay);
        });

        // Progress bar simulation
        const progressInterval = setInterval(() => {
            setBootProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + 2;
            });
        }, 50);

        // Phase transitions
        setTimeout(() => setPhase('processing'), 1500);

        // Completion
        const totalDuration = 3500; // Increased slightly for readability but still snappy
        setTimeout(() => {
            setPhase('ready');
            setTimeout(onComplete, 800);
        }, totalDuration);

        return () => clearInterval(progressInterval);
    }, []);

    const modules = [
        { icon: Database, label: "DATA VENDOR", status: "SYNCED" },
        { icon: Layers, label: "CRITERIA", status: "LOADED" },
        { icon: Cpu, label: "ALGORITHM", status: "ACTIVE" },
        { icon: BarChart2, label: "VISUALIZER", status: "READY" },
    ];

    return (
        <motion.div
            className="fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center font-sans overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            transition={{ duration: 0.6 }}
        >
            {/* Soft Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-blue-950/20 to-slate-900 pointer-events-none"></div>

            <div className="w-full max-w-lg p-8 relative z-10 flex flex-col items-center">

                {/* Logo / Icon */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-8 p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 shadow-2xl shadow-blue-500/10"
                >
                    <Activity size={48} className="text-blue-400 animate-pulse" />
                </motion.div>

                {/* Main Progress Indicator */}
                <div className="w-full space-y-2 mb-8">
                    <div className="flex justify-between text-xs font-semibold text-blue-200/50 uppercase tracking-widest">
                        <span>System Initialization</span>
                        <span>{Math.round(bootProgress)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]"
                            style={{ width: `${bootProgress}%` }}
                        />
                    </div>
                </div>

                {/* Modules Grid */}
                <div className="grid grid-cols-2 gap-4 w-full mb-8">
                    {modules.map((mod, i) => (
                        <motion.div
                            key={mod.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: phase !== 'init' ? 1 : 0, y: phase !== 'init' ? 0 : 10 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5"
                        >
                            <mod.icon size={16} className="text-blue-400" />
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-400 font-bold tracking-wider">{mod.label}</span>
                                <span className="text-[10px] text-green-400">{mod.status}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Latest Log Line */}
                <div className="h-6 overflow-hidden">
                    <AnimatePresence mode="wait">
                        {lines.length > 0 && (
                            <motion.p
                                key={lines[lines.length - 1]}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-xs text-slate-500 font-mono text-center"
                            >
                                {lines[lines.length - 1]}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>

                {/* Final Success Flash */}
                <AnimatePresence>
                    {phase === 'ready' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm z-20 rounded-xl"
                        >
                            <motion.div
                                initial={{ scale: 0.5 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-500/30"
                            >
                                <CheckCircle size={32} className="text-white" />
                            </motion.div>
                            <h2 className="text-xl font-bold text-white tracking-tight">System Ready</h2>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </motion.div>
    );
};

export default SystemBoot;
