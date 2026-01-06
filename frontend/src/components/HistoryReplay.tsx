import React, { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock Data Generator for demo purposes (since we might not have deep history yet)
const generateMockHistory = () => {
    const history = [];
    const vendors = ['Vultr', 'DO', 'Linode', 'AWS', 'GCP'];
    for (let month = 1; month <= 12; month++) {
        const point: any = { name: `Month ${month}` };
        vendors.forEach(v => {
            // Random walk-like score
            point[v] = 0.5 + Math.random() * 0.4;
        });
        history.push(point);
    }
    return history;
};

const HistoryReplay: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0); // View up to this index
    const fullData = useRef(generateMockHistory()).current;

    // Auto-play logic
    useEffect(() => {
        let interval: any;
        if (isPlaying) {
            interval = setInterval(() => {
                setCurrentIndex(prev => {
                    if (prev >= fullData.length - 1) {
                        setIsPlaying(false);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 800); // Speed of replay
        }
        return () => clearInterval(interval);
    }, [isPlaying, fullData.length]);

    const handleReset = () => {
        setIsPlaying(false);
        setCurrentIndex(0);
    };

    const currentData = fullData.slice(0, currentIndex + 1);

    return (
        <div className="glass-card p-6 rounded-3xl border border-white/5 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Clock size={20} className="text-amber-400" />
                        Time Travel Replay
                    </h3>
                    <p className="text-sm text-slate-400">Visualisasi evolusi skor vendor dari waktu ke waktu.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`p-3 rounded-xl transition-all ${isPlaying ? 'bg-amber-500/20 text-amber-400 animate-pulse' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                        {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
                    </button>
                    <button
                        onClick={handleReset}
                        className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <RotateCcw size={20} />
                    </button>
                </div>
            </div>

            {/* Timeline Progress Bar */}
            <div className="h-1 bg-dark-700 rounded-full overflow-hidden w-full relative">
                <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 to-orange-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentIndex + 1) / fullData.length) * 100}%` }}
                    transition={{ type: "spring", stiffness: 100 }}
                />
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={currentData}>
                        <defs>
                            <linearGradient id="colorSplit" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                            </linearGradient>
                            {/* Create dynamic gradients for each line could be cool too */}
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} domain={[0, 1]} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }}
                            itemStyle={{ color: '#e2e8f0' }}
                        />
                        {/* Render Lines for top vendors */}
                        <Area type="monotone" dataKey="Vultr" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
                        <Area type="monotone" dataKey="DO" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2} />
                        <Area type="monotone" dataKey="Linode" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-xs text-slate-500 block mb-1">Current Leader</span>
                    <span className="text-lg font-bold text-blue-400">Vultr</span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-xs text-slate-500 block mb-1">Fastest Growth</span>
                    <span className="text-lg font-bold text-emerald-400">DigiOcean</span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-xs text-slate-500 block mb-1">Most Stable</span>
                    <span className="text-lg font-bold text-purple-400">Linode</span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-xs text-slate-500 block mb-1">Data Points</span>
                    <span className="text-lg font-bold text-amber-400">{(currentIndex + 1) * 5}</span>
                </div>
            </div>
        </div>
    );
};

export default HistoryReplay;
