
import React, { useEffect, useState } from 'react';
import { Sparkles, TrendingUp, Zap, DollarSign, Award, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Recommendation {
    Vendor: string;
    Score: number;
    CPU_val: number;
    RAM_val: number;
    DiskIO_val: number;
    Price_val: number;
    [key: string]: any;
}

interface SmartInsightCardProps {
    recommendation: Recommendation;
    weights: { cpu: number; ram: number; disk: number; price: number };
}

const SmartInsightCard: React.FC<SmartInsightCardProps> = ({ recommendation, weights }) => {
    const [insight, setInsight] = useState<string>("");
    const [highlight, setHighlight] = useState<string>("");

    useEffect(() => {
        generateInsight();
    }, [recommendation, weights]);

    const generateInsight = () => {
        // Simple logic to generate "AI" insight
        const maxWeight = Math.max(weights.cpu, weights.ram, weights.disk, weights.price);
        let reason = "";
        let feature = "";

        if (weights.price === maxWeight) {
            reason = "pilihan paling efisien secara biaya";
            feature = "Best Value";
        } else if (weights.cpu === maxWeight || weights.ram === maxWeight) {
            reason = "performa komputasi tertinggi untuk workload berat";
            feature = "Top Performance";
        } else if (weights.disk === maxWeight) {
            reason = "kapasitas dan kecepatan storage optimal";
            feature = "Storage King";
        } else {
            reason = "keseimbangan terbaik antar semua kriteria";
            feature = "Balanced Choice";
        }

        setInsight(`${recommendation.Vendor} terpilih sebagai rekomendasi #1 karena menawarkan ${reason}.`);
        setHighlight(feature);
    };

    return (
        <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-30 blur group-hover:opacity-60 transition duration-500"></div>
            <div className="relative glass-panel rounded-2xl p-6 overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Sparkles size={100} />
                </div>

                <div className="flex items-start gap-4 relatie z-10">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-400 shadow-lg shadow-blue-500/10">
                        <Sparkles size={24} className="animate-pulse-custom" />
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
                                AI Smart Insight
                            </h3>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wider">
                                {highlight}
                            </span>
                        </div>

                        <p className="text-slate-300 leading-relaxed text-sm">
                            {insight}
                        </p>

                        <div className="mt-4 flex gap-2">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-black/20 px-2 py-1 rounded-lg border border-white/5">
                                <TrendingUp size={12} className="text-green-400" />
                                <span>Score: {(recommendation.Score * 100).toFixed(2)}%</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-black/20 px-2 py-1 rounded-lg border border-white/5">
                                <DollarSign size={12} className="text-yellow-400" />
                                <span>${recommendation.Price_val}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SmartInsightCard;
