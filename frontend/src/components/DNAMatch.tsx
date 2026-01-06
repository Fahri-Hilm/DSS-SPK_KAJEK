import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, X, Fingerprint, ScanEye } from 'lucide-react';
import { clsx } from 'clsx';
import HolographicCard from './HolographicCard';

interface DNAMatchProps {
    weights: any;
    vendor: any;
    maxValues: any; // { maxCPU, maxRAM, maxDisk, maxPrice, minPrice }
    onClose: () => void;
}

const DNAMatch: React.FC<DNAMatchProps> = ({ weights, vendor, maxValues, onClose }) => {
    const [harmonyScore, setHarmonyScore] = useState(0);

    // Calculate "Helix" points based on data
    const generateDNA = (isUser: boolean) => {
        const points = [];
        const steps = 50;

        // Amplitude/Frequency factors
        // User: Based on Weights (Higher weight = Higher Amplitude)
        // Vendor: Based on Normalized Attributes (Better spec = Higher Amplitude)

        let factors = [0, 0, 0, 0]; // CPU, RAM, Disk, Price

        if (isUser) {
            factors = [weights.cpu, weights.ram, weights.disk, weights.price];
        } else {
            // Validate maxValues to prevent division by zero
            const safeMaxCPU = maxValues.maxCPU || 1;
            const safeMaxRAM = maxValues.maxRAM || 1;
            const safeMaxDisk = maxValues.maxDisk || 1;
            const priceRange = (maxValues.maxPrice - maxValues.minPrice) || 1;

            factors = [
                vendor.CPU_val / safeMaxCPU,
                vendor.RAM_val / safeMaxRAM,
                vendor.DiskIO_val / safeMaxDisk,
                // Price is inverted (Lower is better)
                1 - ((vendor.Price_val - maxValues.minPrice) / priceRange)
            ];
        }

        // Generate wave points
        for (let i = 0; i < steps; i++) {
            // Mix the factors to create a unique wave signature
            const cycle = (i / steps) * Math.PI * 4; // 2 cycles

            // Composite wave from 4 factors
            const y1 = Math.sin(cycle) * factors[0];
            const y2 = Math.cos(cycle * 1.5) * factors[1];
            const y3 = Math.sin(cycle * 0.5) * factors[2];
            const y4 = Math.cos(cycle * 2) * factors[3];

            const avgY = (y1 + y2 + y3 + y4) / 4;
            points.push({ x: i, y: avgY * 50 }); // Scale to 50px height
        }
        return points;
    };

    const userDNA = generateDNA(true);
    const vendorDNA = generateDNA(false);

    useEffect(() => {
        // Calculate basic difference score (Euclidean distance style)
        let diffSum = 0;
        for (let i = 0; i < userDNA.length; i++) {
            diffSum += Math.abs(userDNA[i].y - vendorDNA[i].y);
        }
        // Normalize to 0-100%
        // Max possible diff roughly 100 per point * 50 points = 5000
        const maxDiff = 2000;
        const match = Math.max(0, 100 - (diffSum / maxDiff * 100));
        setHarmonyScore(match);
    }, []);

    const WavePath = ({ points, color }: any) => {
        // Create SVG path d string
        const path = points.map((p: any, i: number) =>
            `${i === 0 ? 'M' : 'L'} ${p.x * 12} ${50 + p.y}`
        ).join(' ');

        return (
            <motion.path
                d={path}
                stroke={color}
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
            />
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
            <div className="max-w-2xl w-full relative">
                <button onClick={onClose} className="absolute -top-12 right-0 text-slate-400 hover:text-white transition-colors">
                    <X size={32} />
                </button>

                <HolographicCard intensity={5} className="bg-dark-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="p-8">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                                <Fingerprint size={32} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Pencocokan Pola DNA</h2>
                                <p className="text-slate-400 text-sm">Menganalisis kecocokan dengan <span className="text-blue-400">{vendor.Vendor}</span></p>
                            </div>
                            <div className="ml-auto text-right">
                                <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">Skor Harmoni</div>
                                <div className="text-4xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
                                    {harmonyScore.toFixed(1)}%
                                </div>
                            </div>
                        </div>

                        {/* Visualization Area */}
                        <div className="relative h-64 bg-black/20 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center p-4">
                            {/* Grid Lines */}
                            <div className="absolute inset-0 grid grid-cols-12 opacity-10 pointer-events-none">
                                {[...Array(12)].map((_, i) => <div key={i} className="border-r border-white" />)}
                            </div>

                            <svg width="600" height="100" className="w-full h-full overflow-visible">
                                {/* User DNA (Blue) */}
                                <WavePath points={userDNA} color="#3b82f6" />
                                {/* Vendor DNA (Green) */}
                                <WavePath points={vendorDNA} color="#10b981" />
                            </svg>

                            {/* Legend */}
                            <div className="absolute bottom-4 left-4 flex gap-4 text-xs font-bold">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                                    <span className="text-blue-200">Kebutuhan Anda</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                    <span className="text-green-200">Kapabilitas Vendor</span>
                                </div>
                            </div>
                        </div>

                        {/* Analysis Text */}
                        <div className="mt-8 flex gap-4 items-start bg-blue-500/5 p-4 rounded-xl border border-blue-500/10">
                            <ScanEye className="text-blue-400 shrink-0 mt-1" />
                            <div>
                                <h4 className="text-blue-300 font-bold mb-1">Hasil Analisis</h4>
                                <p className="text-slate-300 text-sm leading-relaxed">
                                    {harmonyScore > 85 ?
                                        "Terdeteksi sinkronisasi tinggi. Kapabilitas vendor ini hampir selaras sempurna dengan prioritas bobot Anda, menciptakan kecocokan yang resonan." :
                                        harmonyScore > 60 ?
                                            "Sinkronisasi sedang. Ada beberapa perbedaan antara kebutuhan Anda dan profil vendor, tetapi atribut inti cocok dengan baik." :
                                            "Harmoni rendah. Gelombang profil vendor tidak sefase dengan kebutuhan Anda."
                                    }
                                </p>
                            </div>
                        </div>

                    </div>
                </HolographicCard>
            </div>
        </motion.div>
    );
};

export default DNAMatch;
