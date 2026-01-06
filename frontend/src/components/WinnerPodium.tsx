import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown, Star, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import HolographicCard from './HolographicCard';

interface WinnerPodiumProps {
    winners: any[]; // Expects top 3 vendors
    onClose: () => void;
}

const WinnerPodium: React.FC<WinnerPodiumProps> = ({ winners, onClose }) => {
    // Ensure we have at least 3 items (fill with placeholders if needed)
    const top3 = [
        winners[0] || { Vendor: '?', Score: 0 },
        winners[1] || { Vendor: '?', Score: 0 },
        winners[2] || { Vendor: '?', Score: 0 }
    ];

    return (
        <div className="relative w-full max-w-5xl aspect-video flex items-center justify-center perspective-1000 rounded-3xl bg-gradient-to-b from-slate-900 to-black border border-white/10 overflow-visible">
            {/* Ambient Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(59,130,246,0.15),transparent_50%)]" />

            {/* Spotlights */}
            <div className="absolute top-0 left-1/4 w-32 h-full bg-gradient-to-b from-yellow-500/10 to-transparent rotate-12 blur-3xl transform origin-top" />
            <div className="absolute top-0 right-1/4 w-32 h-full bg-gradient-to-b from-blue-500/10 to-transparent -rotate-12 blur-3xl transform origin-top" />

            <div className="relative pt-20 flex items-end justify-center gap-4 z-10 transform-style-3d rotate-x-10">

                {/* 2nd Place (Left) */}
                <PodiumStand
                    rank={2}
                    vendor={top3[1]}
                    height="h-64"
                    color="cyan"
                    delay={0.2}
                />

                {/* 1st Place (Center) */}
                <PodiumStand
                    rank={1}
                    vendor={top3[0]}
                    height="h-80"
                    color="yellow"
                    delay={0}
                    isWinner
                />

                {/* 3rd Place (Right) */}
                <PodiumStand
                    rank={3}
                    vendor={top3[2]}
                    height="h-56"
                    color="orange"
                    delay={0.4}
                />
            </div>

            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
                Close View
            </button>
        </div>
    );
};

interface PodiumStandProps {
    rank: number;
    vendor: any;
    height: string;
    color: 'yellow' | 'cyan' | 'orange';
    delay: number;
    isWinner?: boolean;
}

const PodiumStand: React.FC<PodiumStandProps> = ({ rank, vendor, height, color, delay, isWinner }) => {
    const colorClasses = {
        yellow: {
            bg: 'from-yellow-500/20 to-yellow-600/5',
            border: 'border-yellow-500/30',
            text: 'text-yellow-400',
            glow: 'shadow-yellow-500/20',
            icon: <Crown className="w-12 h-12 text-yellow-500 mb-2 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
        },
        cyan: {
            bg: 'from-cyan-500/20 to-cyan-600/5',
            border: 'border-cyan-500/30',
            text: 'text-cyan-400',
            glow: 'shadow-cyan-500/20',
            icon: <Trophy className="w-8 h-8 text-cyan-500 mb-2" />
        },
        orange: {
            bg: 'from-orange-500/20 to-orange-600/5',
            border: 'border-orange-500/30',
            text: 'text-orange-400',
            glow: 'shadow-orange-500/20',
            icon: <Star className="w-8 h-8 text-orange-500 mb-2" />
        }
    };

    const styles = colorClasses[color];

    return (
        <motion.div
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
                type: "spring",
                damping: 12,
                stiffness: 100,
                delay: delay
            }}
            className="flex flex-col items-center"
        >
            {/* Avatar / Icon Floating above */}
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: delay }}
                className="mb-4 flex flex-col items-center"
            >
                {styles.icon}
                <div className={clsx(
                    "px-4 py-2 rounded-xl backdrop-blur-md border shadow-lg text-center min-w-[140px]",
                    "bg-dark-800/80",
                    styles.border,
                    styles.glow
                )}>
                    <div className={clsx("font-bold text-lg truncate max-w-[180px]", isWinner ? "text-white" : "text-slate-200")}>
                        {vendor.Vendor}
                    </div>
                    <div className={clsx("text-sm font-mono", styles.text)}>
                        {(vendor.Score * 100).toFixed(2)}%
                    </div>
                </div>
            </motion.div>

            {/* The Podium Box */}
            <div className={clsx(
                "relative w-40 rounded-t-lg backdrop-blur-sm border-t border-x flex flex-col items-center justify-start pt-4",
                height,
                "bg-gradient-to-b",
                styles.bg,
                styles.border
            )}>
                {/* Rank Number */}
                <div className={clsx(
                    "text-6xl font-black opacity-20 select-none",
                    styles.text
                )}>
                    {rank}
                </div>

                {/* Reflection/Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />

                {/* Front Face Glow */}
                <div className={clsx(
                    "absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black/50 to-transparent"
                )} />
            </div>

            {/* Floor Reflection Shadow */}
            <div className={clsx(
                "w-32 h-4 rounded-[100%] bg-black/50 blur-md mt-[-10px]",
                "scale-x-125"
            )} />

            {isWinner && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1 }}
                    className="absolute -top-12"
                >
                    <Sparkles className="text-yellow-200 w-full h-full animate-pulse" />
                </motion.div>
            )}
        </motion.div>
    );
};

export default WinnerPodium;
