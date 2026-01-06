import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, ChevronRight, Crown } from 'lucide-react';
import { clsx } from 'clsx';
import HolographicCard from './HolographicCard';

interface TournamentViewProps {
    vendors: any[]; // Expects sorted vendors (Rank 1 to N)
    onClose: () => void;
}

const TournamentView: React.FC<TournamentViewProps> = ({ vendors, onClose }) => {
    // Seeding Logic: 1v8, 4v5, 3v6, 2v7 (Standard bracket)
    const [rounds, setRounds] = useState<any[]>([]);
    const [winner, setWinner] = useState<any>(null);

    useEffect(() => {
        if (!vendors || vendors.length < 8) return;

        // Take top 8
        const top8 = vendors.slice(0, 8);

        // Quarter Finals Setup (Seeded)
        // Match 1: #1 vs #8
        // Match 2: #4 vs #5
        // Match 3: #3 vs #6
        // Match 4: #2 vs #7
        const qf = [
            { id: 'qf1', p1: top8[0], p2: top8[7] }, // 1 vs 8
            { id: 'qf2', p1: top8[3], p2: top8[4] }, // 4 vs 5
            { id: 'qf3', p1: top8[2], p2: top8[5] }, // 3 vs 6
            { id: 'qf4', p1: top8[1], p2: top8[6] }, // 2 vs 7
        ];

        // Determine winners for Semis (based on Score)
        const s1_p1 = qf[0].p1.Score > qf[0].p2.Score ? qf[0].p1 : qf[0].p2;
        const s1_p2 = qf[1].p1.Score > qf[1].p2.Score ? qf[1].p1 : qf[1].p2;

        const s2_p1 = qf[2].p1.Score > qf[2].p2.Score ? qf[2].p1 : qf[2].p2;
        const s2_p2 = qf[3].p1.Score > qf[3].p2.Score ? qf[3].p1 : qf[3].p2;

        const sf = [
            { id: 'sf1', p1: s1_p1, p2: s1_p2 },
            { id: 'sf2', p1: s2_p1, p2: s2_p2 },
        ];

        // Final
        const f_p1 = sf[0].p1.Score > sf[0].p2.Score ? sf[0].p1 : sf[0].p2;
        const f_p2 = sf[1].p1.Score > sf[1].p2.Score ? sf[1].p1 : sf[1].p2;

        const final = [
            { id: 'f1', p1: f_p1, p2: f_p2 }
        ];

        const champion = final[0].p1.Score > final[0].p2.Score ? final[0].p1 : final[0].p2;

        setRounds([qf, sf, final]);
        setWinner(champion);

    }, [vendors]);

    const MatchCard = ({ match, delay, isFinal = false }: any) => {
        const winner = match.p1.Score > match.p2.Score ? match.p1 : match.p2;

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: delay, duration: 0.5 }}
                className={clsx(
                    "relative flex flex-col gap-1 p-3 rounded-xl border border-white/10 bg-dark-900/80 backdrop-blur-md min-w-[200px]",
                    isFinal ? "shadow-[0_0_30px_rgba(234,179,8,0.2)] border-yellow-500/30" : "shadow-lg"
                )}
            >
                {/* Player 1 */}
                <div className={clsx(
                    "flex justify-between items-center p-2 rounded-lg text-sm transition-colors",
                    match.p1 === winner ? (isFinal ? "bg-yellow-500/20 text-yellow-300 font-bold" : "bg-green-500/20 text-green-300 font-bold") : "text-slate-500"
                )}>
                    <span>{match.p1.Vendor}</span>
                    <span className="text-xs opacity-70">{match.p1.Score.toFixed(3)}</span>
                </div>

                {/* VS Divider */}
                <div className="h-px w-full bg-white/5 my-1" />

                {/* Player 2 */}
                <div className={clsx(
                    "flex justify-between items-center p-2 rounded-lg text-sm transition-colors",
                    match.p2 === winner ? (isFinal ? "bg-yellow-500/20 text-yellow-300 font-bold" : "bg-green-500/20 text-green-300 font-bold") : "text-slate-500"
                )}>
                    <span>{match.p2.Vendor}</span>
                    <span className="text-xs opacity-70">{match.p2.Score.toFixed(3)}</span>
                </div>

                {/* Connector Lines (Visual Only - Simplified) */}
                {!isFinal && (
                    <div className="absolute -right-6 top-1/2 w-6 h-px bg-white/10" />
                )}
            </motion.div>
        );
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-x-auto"
            >
                <div className="absolute top-6 right-6 z-50">
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="min-w-[1000px] flex gap-12 items-center justify-center h-full p-8">

                    {/* Quarter Finals */}
                    <div className="flex flex-col gap-8 justify-around h-[80%]">
                        <h3 className="text-center text-slate-500 uppercase tracking-widest text-xs font-bold mb-4">Quarter Finals</h3>
                        {rounds[0]?.map((m: any, i: number) => (
                            <MatchCard key={m.id} match={m} delay={i * 0.1} />
                        ))}
                    </div>

                    {/* Semi Finals */}
                    <div className="flex flex-col gap-32 justify-around h-[60%]">
                        <h3 className="text-center text-slate-500 uppercase tracking-widest text-xs font-bold mb-4">Semi Finals</h3>
                        {rounds[1]?.map((m: any, i: number) => (
                            <MatchCard key={m.id} match={m} delay={0.5 + (i * 0.1)} />
                        ))}
                    </div>

                    {/* Final */}
                    <div className="flex flex-col justify-center h-full">
                        <h3 className="text-center text-yellow-500 uppercase tracking-widest text-xs font-bold mb-8">Grand Final</h3>
                        {rounds[2]?.map((m: any) => (
                            <div key={m.id} className="relative">
                                {/* Trophy Icon */}
                                <motion.div
                                    initial={{ scale: 0, y: -50 }}
                                    animate={{ scale: 1, y: 0 }}
                                    transition={{ delay: 1.5, type: "spring" }}
                                    className="absolute -top-16 left-1/2 -translate-x-1/2 text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]"
                                >
                                    <Trophy size={48} />
                                </motion.div>
                                <HolographicCard intensity={8}>
                                    <MatchCard match={m} delay={1} isFinal={true} />
                                </HolographicCard>
                            </div>
                        ))}
                    </div>

                    {/* Champion Display */}
                    {winner && (
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 2 }}
                            className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-yellow-500/20 to-transparent border border-yellow-500/30 rounded-3xl ml-12"
                        >
                            <Crown size={64} className="text-yellow-400 mb-4 animate-bounce-custom" />
                            <h2 className="text-sm text-yellow-200 uppercase tracking-widest mb-2">The Champion</h2>
                            <h1 className="text-4xl font-black text-white mb-2">{winner.Vendor}</h1>
                            <div className="px-4 py-1 rounded-full bg-yellow-500 text-black font-bold text-sm">
                                Score: {winner.Score.toFixed(4)}
                            </div>
                        </motion.div>
                    )}

                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default TournamentView;
