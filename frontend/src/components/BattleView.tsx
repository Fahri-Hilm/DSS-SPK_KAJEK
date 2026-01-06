import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Trophy, Zap, Cpu, Server, DollarSign, X } from 'lucide-react';
import { clsx } from 'clsx';
import HolographicCard from './HolographicCard';

interface BattleViewProps {
    vendor1: any;
    vendor2: any;
    onClose: () => void;
}

const BattleView: React.FC<BattleViewProps> = ({ vendor1, vendor2, onClose }) => {
    const [winner, setWinner] = useState<any>(null);
    const [showFight, setShowFight] = useState(true);

    useEffect(() => {
        // Determine winner based on Score
        if (vendor1 && vendor2) {
            setWinner(vendor1.Score > vendor2.Score ? vendor1 : vendor2);
        }

        // Intro animation timer
        const timer = setTimeout(() => setShowFight(false), 2000);
        return () => clearTimeout(timer);
    }, [vendor1, vendor2]);

    if (!vendor1 || !vendor2) return null;

    const ComparisonRow = ({ label, val1, val2, icon: Icon, format = (v: any) => v, better = 'high' }: any) => {
        const isV1Better = better === 'high' ? val1 > val2 : val1 < val2;
        const isV2Better = better === 'high' ? val2 > val1 : val2 < val1;
        const isEqual = val1 === val2;

        return (
            <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0 relative">
                {/* V1 Value */}
                <div className={clsx("w-1/3 text-right font-mono text-lg transition-all",
                    isV1Better ? "text-green-400 font-bold scale-110" : "text-slate-400"
                )}>
                    {format(val1)}
                </div>

                {/* Label */}
                <div className="w-1/3 flex flex-col items-center justify-center text-slate-500 gap-1 z-10">
                    <Icon size={16} className="text-blue-500/50" />
                    <span className="text-xs uppercase tracking-wider font-semibold">{label}</span>
                </div>

                {/* V2 Value */}
                <div className={clsx("w-1/3 text-left font-mono text-lg transition-all",
                    isV2Better ? "text-green-400 font-bold scale-110" : "text-slate-400"
                )}>
                    {format(val2)}
                </div>

                {/* Power Bar Background */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: isV1Better ? '50%' : '0%' }}
                        className="h-full bg-green-500 right-1/2 absolute top-0 bottom-0"
                    />
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: isV2Better ? '50%' : '0%' }}
                        className="h-full bg-green-500 left-1/2 absolute top-0 bottom-0"
                    />
                </div>
            </div>
        );
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
                <div className="max-w-4xl w-full relative">
                    <button
                        onClick={onClose}
                        className="absolute -top-12 right-0 text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={32} />
                    </button>

                    {/* FIGHT Overlay */}
                    <AnimatePresence>
                        {showFight && (
                            <motion.div
                                initial={{ scale: 0, rotate: -45 }}
                                animate={{ scale: [1, 1.5, 1], rotate: 0 }}
                                exit={{ opacity: 0, scale: 2 }}
                                className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
                            >
                                <h1 className="text-9xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 drop-shadow-[0_0_50px_rgba(239,68,68,0.8)] animate-pulse">
                                    VS
                                </h1>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <HolographicCard intensity={3} className="overflow-hidden bg-dark-900 border border-white/10 rounded-3xl shadow-2xl">
                        <div className="grid grid-cols-2 min-h-[500px] relative">

                            {/* Vendor 1 Side */}
                            <div className="relative p-8 flex flex-col items-center border-r border-white/5 bg-gradient-to-br from-blue-900/20 to-transparent">
                                <div className="w-24 h-24 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6 border border-blue-500/30">
                                    <Server size={48} className="text-blue-400" />
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-2 text-center">{vendor1.Vendor}</h2>
                                <div className="px-3 py-1 bg-blue-500/20 rounded-full text-blue-300 text-xs font-bold mb-8">
                                    CHALLENGER 1
                                </div>

                                {winner === vendor1 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 2.2 }}
                                        className="mt-auto px-6 py-2 bg-yellow-500 text-black font-black rounded-full flex items-center gap-2 shadow-[0_0_30px_rgba(234,179,8,0.5)]"
                                    >
                                        <Trophy size={20} /> WINNER
                                    </motion.div>
                                )}
                            </div>

                            {/* Vendor 2 Side */}
                            <div className="relative p-8 flex flex-col items-center bg-gradient-to-bl from-red-900/20 to-transparent">
                                <div className="w-24 h-24 rounded-2xl bg-red-500/20 flex items-center justify-center mb-6 border border-red-500/30">
                                    <Server size={48} className="text-red-400" />
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-2 text-center">{vendor2.Vendor}</h2>
                                <div className="px-3 py-1 bg-red-500/20 rounded-full text-red-300 text-xs font-bold mb-8">
                                    CHALLENGER 2
                                </div>

                                {winner === vendor2 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 2.2 }}
                                        className="mt-auto px-6 py-2 bg-yellow-500 text-black font-black rounded-full flex items-center gap-2 shadow-[0_0_30px_rgba(234,179,8,0.5)]"
                                    >
                                        <Trophy size={20} /> WINNER
                                    </motion.div>
                                )}
                            </div>

                            {/* Center Stats Column */}
                            <div className="absolute inset-0 flex flex-col justify-center px-12 pointer-events-none">
                                <div className="bg-dark-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 pointer-events-auto">
                                    <ComparisonRow
                                        label="TOPSIS Score"
                                        val1={vendor1.Score}
                                        val2={vendor2.Score}
                                        icon={Zap}
                                        format={(v: number) => v.toFixed(4)}
                                    />
                                    <ComparisonRow
                                        label="CPU Cores"
                                        val1={vendor1.CPU_val}
                                        val2={vendor2.CPU_val}
                                        icon={Cpu}
                                    />
                                    <ComparisonRow
                                        label="RAM (GB)"
                                        val1={vendor1.RAM_val}
                                        val2={vendor2.RAM_val}
                                        icon={Server}
                                    />
                                    <ComparisonRow
                                        label="Price ($)"
                                        val1={vendor1.Price_val}
                                        val2={vendor2.Price_val}
                                        icon={DollarSign}
                                        better="low"
                                    />
                                </div>
                            </div>
                        </div>
                    </HolographicCard>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default BattleView;
