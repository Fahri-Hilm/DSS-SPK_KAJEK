import React, { useState, useEffect } from 'react';
import { api, WeightRequest } from '../services/api';
import { Play, TrendingUp, Award, Zap, Users, Box, BarChart3, DollarSign, Scale, Archive, Save, Tag, X, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, LineChart, Line, CartesianGrid } from 'recharts';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import Chart3D from './Chart3D';
import LiquidLoader from './LiquidLoader';
import ParticleBackground from './ParticleBackground';

const AnalysisView: React.FC = () => {
    interface PresetProfile {
        name: string;
        weights: WeightRequest;
        icon: React.ReactNode;
    }

    const [weights, setWeights] = useState<WeightRequest>({
        cpu: 0.25,
        ram: 0.25,
        disk: 0.25,
        price: 0.25
    });
    const [results, setResults] = useState<any>(null);
    const [calculating, setCalculating] = useState(false);
    const [sensitivityData, setSensitivityData] = useState<any[]>([]);
    const [showSensitivity, setShowSensitivity] = useState(false);
    const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
    const [chartMode, setChartMode] = useState<'2d' | '3d'>('2d');
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false); // Success popup state
    const [saveTitle, setSaveTitle] = useState('');
    const [saveDesc, setSaveDesc] = useState('');
    const [saveTags, setSaveTags] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleCalculate = async () => {
        setCalculating(true);
        try {
            const data = await api.calculate(weights);
            setResults(data);
            // Run sensitivity analysis automatically
            await runSensitivityAnalysis();
        } catch (error) {
            console.error(error);
        } finally {
            setCalculating(false);
        }
    };

    const runSensitivityAnalysis = async () => {
        const sensitivityPoints = [];
        // Vary CPU weight from 0.1 to 0.5, keeping others proportional
        for (let cpuW = 0.1; cpuW <= 0.5; cpuW += 0.1) {
            const remaining = 1 - cpuW;
            const otherW = remaining / 3;
            const testWeights = { cpu: cpuW, ram: otherW, disk: otherW, price: otherW };
            try {
                const data = await api.calculate(testWeights);
                const point: any = { cpuWeight: `${(cpuW * 100).toFixed(0)}%` };
                data.rankings.slice(0, 5).forEach((r: any) => {
                    point[r.Vendor] = r.Score;
                });
                sensitivityPoints.push(point);
            } catch (e) {
                console.error(e);
            }
        }
        setSensitivityData(sensitivityPoints);
    };

    const toggleVendorSelection = (vendor: string) => {
        setSelectedVendors(prev =>
            prev.includes(vendor)
                ? prev.filter(v => v !== vendor)
                : prev.length < 3 ? [...prev, vendor] : prev
        );
    };

    // Prepare 3D chart data
    const get3DData = () => {
        if (!results) return [];
        return results.rankings.slice(0, 10).map((r: any) => ({
            vendor: r.Vendor,
            cpu: r.CPU_val,
            ram: r.RAM_val,
            disk: r.DiskIO_val,
            price: r.Price_val,
            score: r.Score
        }));
    };

    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
    const isValid = Math.abs(totalWeight - 1.0) < 0.01;

    // Prepare radar data for selected vendors
    const getRadarData = () => {
        if (!results || selectedVendors.length === 0) return [];
        const vendors = results.rankings.filter((r: any) => selectedVendors.includes(r.Vendor));

        // Normalize values for radar chart (0-100 scale)
        const maxCPU = Math.max(...results.rankings.map((r: any) => r.CPU_val));
        const maxRAM = Math.max(...results.rankings.map((r: any) => r.RAM_val));
        const maxDisk = Math.max(...results.rankings.map((r: any) => r.DiskIO_val));
        const minPrice = Math.min(...results.rankings.map((r: any) => r.Price_val));
        const maxPrice = Math.max(...results.rankings.map((r: any) => r.Price_val));

        return [
            { subject: 'CPU', ...vendors.reduce((acc: any, v: any) => ({ ...acc, [v.Vendor]: (v.CPU_val / maxCPU) * 100 }), {}), fullMark: 100 },
            { subject: 'RAM', ...vendors.reduce((acc: any, v: any) => ({ ...acc, [v.Vendor]: (v.RAM_val / maxRAM) * 100 }), {}), fullMark: 100 },
            { subject: 'Disk I/O', ...vendors.reduce((acc: any, v: any) => ({ ...acc, [v.Vendor]: (v.DiskIO_val / maxDisk) * 100 }), {}), fullMark: 100 },
            { subject: 'Harga', ...vendors.reduce((acc: any, v: any) => ({ ...acc, [v.Vendor]: ((maxPrice - v.Price_val) / (maxPrice - minPrice)) * 100 }), {}), fullMark: 100 },
        ];
    };

    const radarColors = ['#3b82f6', '#10b981', '#f59e0b'];

    // Weight presets
    const [presets] = useState<PresetProfile[]>([
        { name: 'Performa Tinggi', weights: { cpu: 0.4, ram: 0.4, disk: 0.1, price: 0.1 }, icon: <Zap size={16} /> },
        { name: 'Hemat Biaya', weights: { cpu: 0.1, ram: 0.1, disk: 0.1, price: 0.7 }, icon: <DollarSign size={16} /> },
        { name: 'Seimbang', weights: { cpu: 0.25, ram: 0.25, disk: 0.25, price: 0.25 }, icon: <Scale size={16} /> },
        { name: 'Storage Heavy', weights: { cpu: 0.1, ram: 0.2, disk: 0.6, price: 0.1 }, icon: <Archive size={16} /> },
    ]);

    // Restore from history if available
    useEffect(() => {
        const restored = localStorage.getItem('restore_weights');
        if (restored) {
            try {
                const parsedWeights = JSON.parse(restored);
                setWeights(parsedWeights);
                // Clear after restoring so it doesn't persist on refresh unintentionally
                localStorage.removeItem('restore_weights');
            } catch (e) {
                console.error("Failed to restore weights", e);
            }
        }
    }, []);



    const applyPreset = (preset: PresetProfile) => {
        setWeights(preset.weights);
    };

    const handleSaveHistory = async () => {
        if (!saveTitle.trim()) return;
        setIsSaving(true);
        try {
            await api.saveToHistory({
                title: saveTitle,
                description: saveDesc,
                weights: weights,
                tags: saveTags.split(',').map(t => t.trim()).filter(t => t)
            });
            setShowSaveModal(false); // Close the input modal
            setSaveTitle('');
            setSaveDesc('');
            setSaveTags('');

            // Show proper success modal instead of alert
            setShowSuccessModal(true);
            // Auto close after 3 seconds
            setTimeout(() => setShowSuccessModal(false), 3000);

        } catch (error) {
            console.error(error);
            alert('Gagal menyimpan riwayat');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="relative">
            <ParticleBackground particleCount={8} />
            <div className="space-y-8 animate-in fade-in duration-500 relative z-10">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Control Panel */}
                    <div className="w-full md:w-1/3 space-y-6">
                        <div className="glass-panel p-6 rounded-2xl">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <span className="p-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20"><TrendingUp size={20} /></span>
                                Bobot Kriteria
                            </h3>

                            <div className="space-y-6">
                                {Object.entries(weights).map(([key, val]) => (
                                    <div key={key}>
                                        <div className="flex justify-between mb-2">
                                            <label className="text-sm font-medium text-slate-300 capitalize">{key}</label>
                                            <span className="text-sm font-bold text-blue-400">{(val * 100).toFixed(0)}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0" max="1" step="0.05"
                                            value={val}
                                            onChange={(e) => setWeights({ ...weights, [key]: parseFloat(e.target.value) })}
                                            className="w-full h-2 bg-dark-900/50 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Preset Buttons */}
                            <div className="mt-6 pt-6 border-t border-white/5">
                                <label className="text-sm text-slate-400 mb-3 block">Preset Bobot</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {presets.map((preset) => (
                                        <button
                                            key={preset.name}
                                            onClick={() => applyPreset(preset)}
                                            className="px-3 py-2 glass-input hover:bg-white/5 rounded-xl text-sm text-slate-300 flex items-center justify-center gap-2 transition-all hover:border-blue-500/30"
                                        >
                                            <span>{preset.icon}</span>
                                            <span>{preset.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-white/5">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-slate-400">Total Bobot</span>
                                    <span className={clsx("font-bold text-lg", isValid ? "text-emerald-400" : "text-red-400")}>
                                        {(totalWeight * 100).toFixed(0)}%
                                    </span>
                                </div>

                                <button
                                    onClick={handleCalculate}
                                    disabled={!isValid || calculating}
                                    className={clsx(
                                        "w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-xl",
                                        isValid
                                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-900/40"
                                            : "bg-dark-800 text-slate-500 cursor-not-allowed border border-white/5"
                                    )}
                                >
                                    {calculating ? (
                                        <>
                                            <LiquidLoader />
                                            <span className="ml-2">Memproses...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Play size={18} className="group-hover:scale-110 transition-transform" />
                                            Hitung TOPSIS
                                        </>
                                    )}
                                </button>

                                {results && (
                                    <button
                                        onClick={() => setShowSaveModal(true)}
                                        className="w-full mt-3 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white group"
                                    >
                                        <Save size={18} className="text-blue-400 group-hover:scale-110 transition-transform" />
                                        Simpan Hasil Analisa
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Comparison Mode Toggle */}
                        {results && (
                            <div className="glass-panel p-6 rounded-2xl">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Users size={18} className="text-purple-400" />
                                    Bandingkan Vendor
                                </h3>
                                <p className="text-sm text-slate-400 mb-4">Pilih 2-3 vendor untuk perbandingan radar chart</p>
                                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                                    {results.rankings.map((r: any) => (
                                        <button
                                            key={r.Vendor}
                                            onClick={() => toggleVendorSelection(r.Vendor)}
                                            className={clsx(
                                                "w-full px-3 py-2 rounded-lg text-left text-sm flex items-center justify-between transition-all border",
                                                selectedVendors.includes(r.Vendor)
                                                    ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                                                    : "bg-transparent border-transparent text-slate-400 hover:bg-white/5"
                                            )}
                                        >
                                            <span>#{r.Rank} {r.Vendor}</span>
                                            {selectedVendors.includes(r.Vendor) && <span>✓</span>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Results Panel */}
                    <div className="w-full md:w-2/3">
                        {results ? (
                            <div className="space-y-6">
                                {/* Top Recommendation */}
                                <div className="relative overflow-hidden rounded-2xl p-8 group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-md border border-yellow-500/20 rounded-2xl"></div>
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>

                                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                                        <div className="flex items-center gap-5">
                                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform duration-500">
                                                <Award className="text-white" size={40} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500 text-dark-900 border border-yellow-400 uppercase tracking-wider">Top #1</span>
                                                </div>
                                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-1">{results.top_recommendation.Vendor}</h2>
                                                <p className="text-slate-300">{results.top_recommendation['Nama Paket (Plan)']}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-yellow-500/80 uppercase tracking-widest font-semibold mb-1">TOPSIS Score</div>
                                            <div className="text-5xl font-bold text-white tracking-tight">{results.top_recommendation.Score.toFixed(4)}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Score Progress Bars */}
                                <div className="glass-panel p-6 rounded-2xl">
                                    <h4 className="text-lg font-bold text-white mb-6">Live Rankings</h4>
                                    <div className="space-y-4">
                                        {results.rankings.slice(0, 8).map((r: any, idx: number) => (
                                            <div key={r.Vendor} className="flex items-center gap-4 group">
                                                <span className={clsx(
                                                    "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 border transition-colors",
                                                    idx === 0 ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/30" :
                                                        idx === 1 ? "bg-slate-400/10 text-slate-300 border-slate-400/30" :
                                                            idx === 2 ? "bg-orange-500/10 text-orange-400 border-orange-500/30" :
                                                                "bg-dark-800/50 text-slate-500 border-white/5"
                                                )}>#{r.Rank}</span>
                                                <div className="flex-1">
                                                    <div className="flex justify-between text-sm mb-2">
                                                        <span className="text-slate-200 font-medium group-hover:text-white transition-colors">{r.Vendor}</span>
                                                        <span className="text-slate-400 group-hover:text-blue-400 transition-colors font-mono">{(r.Score * 100).toFixed(2)}%</span>
                                                    </div>
                                                    <div className="h-2 bg-dark-900/50 rounded-full overflow-hidden border border-white/5">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${r.Score * 100}%` }}
                                                            transition={{ duration: 1, delay: idx * 0.1 }}
                                                            className={clsx("h-full rounded-full",
                                                                idx === 0 ? "bg-gradient-to-r from-yellow-500 to-orange-500" :
                                                                    idx === 1 ? "bg-gradient-to-r from-slate-400 to-slate-200" :
                                                                        idx === 2 ? "bg-gradient-to-r from-orange-400 to-orange-500" :
                                                                            "bg-blue-600"
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Charts Row */}
                                <div className="space-y-6">
                                    {/* Chart Mode Toggle */}
                                    <div className="flex justify-center">
                                        <div className="glass-panel p-1 rounded-xl flex">
                                            <button
                                                onClick={() => setChartMode('2d')}
                                                className={clsx(
                                                    "px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 text-sm font-medium",
                                                    chartMode === '2d'
                                                        ? "bg-blue-600 text-white shadow-lg"
                                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                                )}
                                            >
                                                <BarChart3 size={16} />
                                                2D Charts
                                            </button>
                                            <button
                                                onClick={() => setChartMode('3d')}
                                                className={clsx(
                                                    "px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 text-sm font-medium",
                                                    chartMode === '3d'
                                                        ? "bg-blue-600 text-white shadow-lg"
                                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                                )}
                                            >
                                                <Box size={16} />
                                                3D Visualization
                                            </button>
                                        </div>
                                    </div>

                                    {chartMode === '3d' ? (
                                        /* 3D Chart */
                                        <div className="glass-panel p-6 rounded-2xl">
                                            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                                <Box size={20} className="text-blue-400" />
                                                3D Multi-Dimensional Analysis
                                            </h4>
                                            <p className="text-sm text-slate-400 mb-4">
                                                Visualisasi 3D menampilkan perbandingan vendor berdasarkan semua kriteria.
                                                Gerakkan mouse untuk rotasi.
                                            </p>
                                            <motion.div
                                                className="flex justify-center"
                                                initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                                                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                                transition={{ duration: 0.6, ease: "easeInOut" }}
                                            >
                                                <Chart3D data={get3DData()} width={700} height={400} />
                                            </motion.div>
                                        </div>
                                    ) : (
                                        /* 2D Charts */
                                        <motion.div
                                            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                                        >
                                            {/* Bar Chart */}
                                            <div className="glass-panel p-6 rounded-2xl hover:border-blue-500/30 transition-all duration-300">
                                                <h4 className="text-lg font-bold text-white mb-6">Ranking Score</h4>
                                                <div className="h-64">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <BarChart data={results.rankings.slice(0, 5)} layout="vertical">
                                                            <defs>
                                                                <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                                                                    <stop offset="0%" stopColor="#60a5fa" stopOpacity={1} />
                                                                    <stop offset="100%" stopColor="#a78bfa" stopOpacity={1} />
                                                                </linearGradient>
                                                            </defs>
                                                            <XAxis type="number" hide />
                                                            <YAxis dataKey="Vendor" type="category" width={100} tick={{ fill: '#cbd5e1', fontSize: 12 }} />
                                                            <Tooltip
                                                                contentStyle={{
                                                                    backgroundColor: 'rgba(3, 7, 18, 0.9)',
                                                                    borderColor: 'rgba(255,255,255,0.1)',
                                                                    color: '#f1f5f9',
                                                                    borderRadius: '12px',
                                                                    backdropFilter: 'blur(10px)'
                                                                }}
                                                                itemStyle={{ color: '#60a5fa' }}
                                                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                                            />
                                                            <Bar
                                                                dataKey="Score"
                                                                fill="url(#barGradient)"
                                                                radius={[0, 8, 8, 0]}
                                                                animationDuration={1500}
                                                                opacity={1}
                                                            />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </div>

                                            {/* Radar Chart - Comparison */}
                                            <div className="glass-panel p-6 rounded-2xl hover:border-purple-500/30 transition-all duration-300">
                                                <h4 className="text-lg font-bold text-white mb-6">
                                                    Perbandingan Kriteria {selectedVendors.length > 0 && `(${selectedVendors.length})`}
                                                </h4>
                                                <div className="h-64">
                                                    {selectedVendors.length >= 1 ? (
                                                        <ResponsiveContainer width="100%" height="100%">
                                                            <RadarChart outerRadius={90} data={getRadarData()}>
                                                                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                                                {selectedVendors.map((vendor, i) => (
                                                                    <Radar
                                                                        key={vendor}
                                                                        name={vendor}
                                                                        dataKey={vendor}
                                                                        stroke={radarColors[i]}
                                                                        fill={radarColors[i]}
                                                                        fillOpacity={0.4}
                                                                        strokeWidth={2}
                                                                    />
                                                                ))}
                                                                <Legend />
                                                                <Tooltip
                                                                    contentStyle={{
                                                                        backgroundColor: 'rgba(3, 7, 18, 0.9)',
                                                                        borderColor: 'rgba(255,255,255,0.1)',
                                                                        borderRadius: '8px',
                                                                        backdropFilter: 'blur(8px)'
                                                                    }}
                                                                />
                                                            </RadarChart>
                                                        </ResponsiveContainer>
                                                    ) : (
                                                        <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center gap-2">
                                                            <Users size={32} className="text-slate-600 opacity-50" />
                                                            <div className="text-sm">
                                                                Pilih vendor di panel kiri<br />untuk membandingkan
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Sensitivity Analysis */}
                                <div className="glass-panel p-6 rounded-2xl">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-lg font-bold text-white flex items-center gap-2">
                                            <Zap size={18} className="text-yellow-400" />
                                            Sensitivity Analysis
                                        </h4>
                                        <button
                                            onClick={() => setShowSensitivity(!showSensitivity)}
                                            className="text-sm px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                                        >
                                            {showSensitivity ? 'Sembunyikan' : 'Tampilkan Analisa'}
                                        </button>
                                    </div>
                                    {showSensitivity && sensitivityData.length > 0 && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            className="overflow-hidden"
                                        >
                                            <p className="text-sm text-slate-400 mb-6">
                                                Simulasi perubahan ranking jika bobot <strong>CPU</strong> dinaikkan (0.1 - 0.5).
                                            </p>
                                            <div className="h-64">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={sensitivityData}>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                                        <XAxis dataKey="cpuWeight" tick={{ fill: '#64748b', fontSize: 12 }} />
                                                        <YAxis domain={[0, 1]} tick={{ fill: '#64748b', fontSize: 12 }} />
                                                        <Tooltip
                                                            contentStyle={{
                                                                backgroundColor: 'rgba(3, 7, 18, 0.9)',
                                                                borderColor: 'rgba(255,255,255,0.1)',
                                                                borderRadius: '8px',
                                                                backdropFilter: 'blur(8px)'
                                                            }}
                                                        />
                                                        <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                                        {Object.keys(sensitivityData[0] || {}).filter(k => k !== 'cpuWeight').slice(0, 5).map((vendor, i) => (
                                                            <Line
                                                                key={vendor}
                                                                type="monotone"
                                                                dataKey={vendor}
                                                                stroke={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][i]}
                                                                strokeWidth={3}
                                                                dot={{ r: 4, fill: '#1e293b', strokeWidth: 2 }}
                                                                activeDot={{ r: 6 }}
                                                            />
                                                        ))}
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Table */}
                                <div className="glass-card rounded-2xl overflow-hidden">
                                    <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                                        <table className="w-full">
                                            <thead className="bg-white/5 border-b border-white/5 sticky top-0 backdrop-blur-md z-10">
                                                <tr>
                                                    <th className="px-4 py-4 text-slate-400 font-semibold text-sm uppercase tracking-wider text-center w-20">Rank</th>
                                                    <th className="px-6 py-4 text-slate-400 font-semibold text-sm uppercase tracking-wider text-left">Vendor</th>
                                                    <th className="px-4 py-4 text-slate-400 font-semibold text-sm uppercase tracking-wider text-center w-32">Score</th>
                                                    <th className="px-4 py-4 text-slate-400 font-semibold text-sm uppercase tracking-wider text-center w-24">CPU</th>
                                                    <th className="px-4 py-4 text-slate-400 font-semibold text-sm uppercase tracking-wider text-center w-24">RAM</th>
                                                    <th className="px-6 py-4 text-slate-400 font-semibold text-sm uppercase tracking-wider text-right w-28">Harga</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {results.rankings.map((row: any) => (
                                                    <tr key={row.Rank} className={clsx(
                                                        "hover:bg-white/5 cursor-pointer transition-colors group",
                                                        selectedVendors.includes(row.Vendor) && "bg-purple-500/10 hover:bg-purple-500/20"
                                                    )} onClick={() => toggleVendorSelection(row.Vendor)}>
                                                        <td className="px-4 py-4 text-center">
                                                            <span className={clsx(
                                                                "inline-flex w-10 h-10 rounded-lg items-center justify-center font-bold text-sm border",
                                                                row.Rank === 1 ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/30" :
                                                                    row.Rank === 2 ? "bg-slate-500/20 text-slate-400 border-slate-500/30" :
                                                                        row.Rank === 3 ? "bg-orange-500/20 text-orange-500 border-orange-500/30" :
                                                                            "text-slate-500 border-transparent"
                                                            )}>#{row.Rank}</span>
                                                        </td>
                                                        <td className="px-6 py-4 font-medium text-slate-200 group-hover:text-white transition-colors text-left">{row.Vendor}</td>
                                                        <td className="px-4 py-4 text-blue-400 font-bold text-center">{row.Score.toFixed(4)}</td>
                                                        <td className="px-4 py-4 text-center text-slate-400">{row.CPU_val}</td>
                                                        <td className="px-4 py-4 text-center text-slate-400">{row.RAM_val}</td>
                                                        <td className="px-6 py-4 text-right text-slate-300 font-mono">${row.Price_val}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full min-h-[400px] flex flex-col items-center justify-center glass-panel rounded-2xl border-dashed border-white/10 opacity-70">
                                <div className="p-6 bg-dark-900/50 rounded-full mb-6 border border-white/5 shadow-2xl">
                                    <Play className="text-slate-500" size={40} />
                                </div>
                                <h4 className="text-2xl font-bold text-slate-200 mb-2">Belum ada hasil analisa</h4>
                                <p className="text-slate-500 mt-2 text-center max-w-sm leading-relaxed">
                                    Sesuaikan bobot di panel sebelah kiri dan klik tombol <span className="text-blue-400 font-medium">Hitung TOPSIS</span> untuk menemukan VPS terbaik.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Success Modal */}
                <AnimatePresence>
                    {showSuccessModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                onClick={() => setShowSuccessModal(false)}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="relative bg-dark-900 border border-white/10 rounded-2xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center"
                            >
                                <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mb-4">
                                    <CheckCircle2 size={32} strokeWidth={3} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Berhasil Disimpan!</h3>
                                <p className="text-slate-400 mb-6">
                                    Hasil analisa telah berhasil ditambahkan ke riwayat Anda.
                                </p>
                                <button
                                    onClick={() => setShowSuccessModal(false)}
                                    className="px-6 py-2 bg-white text-dark-900 font-bold rounded-xl hover:bg-slate-200 transition-colors w-full"
                                >
                                    Oke, Paham
                                </button>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Save Modal */}
                <AnimatePresence>
                    {showSaveModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                                onClick={() => setShowSaveModal(false)}
                            />
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-dark-900 border border-white/10 rounded-2xl w-full max-w-md relative z-10 shadow-2xl p-6 glass-panel"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Save size={20} className="text-blue-400" />
                                        Simpan Riwayat
                                    </h3>
                                    <button onClick={() => setShowSaveModal(false)} className="text-slate-400 hover:text-white">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Judul Analisa</label>
                                        <input
                                            autoFocus
                                            type="text"
                                            className="w-full px-4 py-2 glass-input rounded-xl text-slate-200 outline-none focus:border-blue-500/50"
                                            placeholder="Contoh: Analisa VPS High Performance"
                                            value={saveTitle}
                                            onChange={(e) => setSaveTitle(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Deskripsi (Opsional)</label>
                                        <textarea
                                            className="w-full px-4 py-2 glass-input rounded-xl text-slate-200 outline-none focus:border-blue-500/50 min-h-[80px]"
                                            placeholder="Catatan tambahan..."
                                            value={saveDesc}
                                            onChange={(e) => setSaveDesc(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Tags (Pisahkan dengan koma)</label>
                                        <div className="relative">
                                            <Tag className="absolute left-3 top-2.5 text-slate-500" size={16} />
                                            <input
                                                type="text"
                                                className="w-full pl-10 pr-4 py-2 glass-input rounded-xl text-slate-200 outline-none focus:border-blue-500/50"
                                                placeholder="game, web, murah"
                                                value={saveTags}
                                                onChange={(e) => setSaveTags(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex gap-3">
                                    <button
                                        onClick={() => setShowSaveModal(false)}
                                        className="flex-1 px-4 py-2 rounded-xl text-slate-300 hover:bg-white/5 transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={handleSaveHistory}
                                        disabled={!saveTitle.trim() || isSaving}
                                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSaving ? 'Menyimpan...' : 'Simpan'}
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AnalysisView;
