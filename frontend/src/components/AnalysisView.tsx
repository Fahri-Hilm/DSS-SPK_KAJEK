import React, { useState } from 'react';
import { api, WeightRequest } from '../services/api';
import { Play, TrendingUp, Award, Zap, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, LineChart, Line } from 'recharts';
import { clsx } from 'clsx';

const AnalysisView: React.FC = () => {
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
    const presets = [
        { name: 'Balanced', icon: '⚖️', weights: { cpu: 0.25, ram: 0.25, disk: 0.25, price: 0.25 } },
        { name: 'Performance', icon: '🚀', weights: { cpu: 0.35, ram: 0.35, disk: 0.20, price: 0.10 } },
        { name: 'Budget', icon: '💰', weights: { cpu: 0.15, ram: 0.15, disk: 0.15, price: 0.55 } },
        { name: 'Storage', icon: '💾', weights: { cpu: 0.15, ram: 0.15, disk: 0.55, price: 0.15 } },
    ];

    const applyPreset = (preset: typeof presets[0]) => {
        setWeights(preset.weights);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Control Panel */}
                <div className="w-full md:w-1/3 space-y-6">
                    <div className="bg-dark-800 rounded-2xl border border-dark-700 p-6">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <span className="p-2 bg-blue-500/20 text-blue-400 rounded-lg"><TrendingUp size={20} /></span>
                            Bobot Kriteria
                        </h3>

                        <div className="space-y-6">
                            {Object.entries(weights).map(([key, val]) => (
                                <div key={key}>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-sm font-medium text-slate-300 capitalize">{key}</label>
                                        <span className="text-sm text-slate-400">{(val * 100).toFixed(0)}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0" max="1" step="0.05"
                                        value={val}
                                        onChange={(e) => setWeights({ ...weights, [key]: parseFloat(e.target.value) })}
                                        className="w-full h-2 bg-dark-900 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Preset Buttons */}
                        <div className="mt-6 pt-6 border-t border-dark-700">
                            <label className="text-sm text-slate-400 mb-3 block">Preset Bobot</label>
                            <div className="grid grid-cols-2 gap-2">
                                {presets.map((preset) => (
                                    <button
                                        key={preset.name}
                                        onClick={() => applyPreset(preset)}
                                        className="px-3 py-2 bg-dark-900 hover:bg-dark-700 border border-dark-600 rounded-xl text-sm text-slate-300 flex items-center justify-center gap-2 transition-all hover:border-blue-500/50"
                                    >
                                        <span>{preset.icon}</span>
                                        <span>{preset.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-dark-700">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-slate-400">Total Bobot</span>
                                <span className={clsx("font-bold", isValid ? "text-green-400" : "text-red-400")}>
                                    {(totalWeight * 100).toFixed(0)}%
                                </span>
                            </div>

                            <button
                                onClick={handleCalculate}
                                disabled={!isValid || calculating}
                                className={clsx(
                                    "w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all",
                                    isValid
                                        ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/40"
                                        : "bg-dark-700 text-slate-500 cursor-not-allowed"
                                )}
                            >
                                {calculating ? "Memproses..." : <><Play size={18} /> Hitung TOPSIS</>}
                            </button>
                        </div>
                    </div>

                    {/* Comparison Mode Toggle */}
                    {results && (
                        <div className="bg-dark-800 rounded-2xl border border-dark-700 p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Users size={18} className="text-purple-400" />
                                Bandingkan Vendor
                            </h3>
                            <p className="text-sm text-slate-400 mb-4">Pilih 2-3 vendor untuk perbandingan radar chart</p>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {results.rankings.map((r: any) => (
                                    <button
                                        key={r.Vendor}
                                        onClick={() => toggleVendorSelection(r.Vendor)}
                                        className={clsx(
                                            "w-full px-3 py-2 rounded-lg text-left text-sm flex items-center justify-between transition-all",
                                            selectedVendors.includes(r.Vendor)
                                                ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                                : "bg-dark-900 text-slate-400 hover:bg-dark-700"
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
                            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                                        <Award className="text-white" size={32} />
                                    </div>
                                    <div>
                                        <div className="text-yellow-400 font-bold tracking-wider text-sm uppercase mb-1">Rekomendasi Terbaik</div>
                                        <h2 className="text-3xl font-bold text-white">{results.top_recommendation.Vendor}</h2>
                                        <p className="text-slate-300">{results.top_recommendation['Nama Paket (Plan)']}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-slate-400 mb-1">TOPSIS Score</div>
                                    <div className="text-4xl font-bold text-white">{results.top_recommendation.Score.toFixed(4)}</div>
                                </div>
                            </div>

                            {/* Score Progress Bars */}
                            <div className="bg-dark-800 p-6 rounded-2xl border border-dark-700">
                                <h4 className="text-lg font-bold text-white mb-4">Score Progress</h4>
                                <div className="space-y-3">
                                    {results.rankings.slice(0, 8).map((r: any, idx: number) => (
                                        <div key={r.Vendor} className="flex items-center gap-3">
                                            <span className={clsx(
                                                "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0",
                                                idx === 0 ? "bg-yellow-500/20 text-yellow-500" :
                                                    idx === 1 ? "bg-slate-500/20 text-slate-400" :
                                                        idx === 2 ? "bg-orange-500/20 text-orange-500" :
                                                            "bg-dark-700 text-slate-500"
                                            )}>#{r.Rank}</span>
                                            <div className="flex-1">
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-white font-medium">{r.Vendor}</span>
                                                    <span className="text-blue-400">{(r.Score * 100).toFixed(1)}%</span>
                                                </div>
                                                <div className="h-2 bg-dark-900 rounded-full overflow-hidden">
                                                    <div
                                                        className={clsx("h-full rounded-full transition-all duration-500",
                                                            idx === 0 ? "bg-gradient-to-r from-yellow-500 to-orange-500" :
                                                                idx === 1 ? "bg-gradient-to-r from-slate-400 to-slate-500" :
                                                                    idx === 2 ? "bg-gradient-to-r from-orange-400 to-orange-500" :
                                                                        "bg-blue-500"
                                                        )}
                                                        style={{ width: `${r.Score * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Charts Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Bar Chart */}
                                <div className="bg-dark-800 p-6 rounded-2xl border border-dark-700">
                                    <h4 className="text-lg font-bold text-white mb-4">Ranking Score</h4>
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={results.rankings.slice(0, 5)} layout="vertical">
                                                <XAxis type="number" hide />
                                                <YAxis dataKey="Vendor" type="category" width={100} tick={{ fill: '#94a3b8' }} />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#1a1f2e', borderColor: '#334155', color: '#f1f5f9' }}
                                                    itemStyle={{ color: '#60a5fa' }}
                                                />
                                                <Bar dataKey="Score" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Radar Chart - Comparison */}
                                <div className="bg-dark-800 p-6 rounded-2xl border border-dark-700">
                                    <h4 className="text-lg font-bold text-white mb-4">
                                        Perbandingan Kriteria {selectedVendors.length > 0 && `(${selectedVendors.length})`}
                                    </h4>
                                    <div className="h-64">
                                        {selectedVendors.length >= 2 ? (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <RadarChart outerRadius={80} data={getRadarData()}>
                                                    <PolarGrid stroke="#334155" />
                                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#475569' }} />
                                                    {selectedVendors.map((vendor, i) => (
                                                        <Radar key={vendor} name={vendor} dataKey={vendor} stroke={radarColors[i]} fill={radarColors[i]} fillOpacity={0.3} />
                                                    ))}
                                                    <Legend />
                                                </RadarChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="h-full flex items-center justify-center text-slate-500 text-center">
                                                Pilih minimal 2 vendor di panel kiri untuk melihat perbandingan radar
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Sensitivity Analysis */}
                            <div className="bg-dark-800 p-6 rounded-2xl border border-dark-700">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                                        <Zap size={18} className="text-yellow-400" />
                                        Sensitivity Analysis
                                    </h4>
                                    <button
                                        onClick={() => setShowSensitivity(!showSensitivity)}
                                        className="text-sm text-blue-400 hover:text-blue-300"
                                    >
                                        {showSensitivity ? 'Sembunyikan' : 'Tampilkan'}
                                    </button>
                                </div>
                                {showSensitivity && sensitivityData.length > 0 && (
                                    <>
                                        <p className="text-sm text-slate-400 mb-4">
                                            Grafik menunjukkan bagaimana perubahan bobot CPU mempengaruhi ranking vendor
                                        </p>
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={sensitivityData}>
                                                    <XAxis dataKey="cpuWeight" tick={{ fill: '#94a3b8' }} />
                                                    <YAxis domain={[0, 1]} tick={{ fill: '#94a3b8' }} />
                                                    <Tooltip contentStyle={{ backgroundColor: '#1a1f2e', borderColor: '#334155' }} />
                                                    <Legend />
                                                    {Object.keys(sensitivityData[0] || {}).filter(k => k !== 'cpuWeight').slice(0, 5).map((vendor, i) => (
                                                        <Line key={vendor} type="monotone" dataKey={vendor} stroke={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][i]} strokeWidth={2} dot={false} />
                                                    ))}
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Table */}
                            <div className="bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-dark-900/50">
                                        <tr>
                                            <th className="p-4 text-slate-400 font-medium">Rank</th>
                                            <th className="p-4 text-slate-400 font-medium">Vendor</th>
                                            <th className="p-4 text-slate-400 font-medium">Score</th>
                                            <th className="p-4 text-slate-400 font-medium">CPU</th>
                                            <th className="p-4 text-slate-400 font-medium">RAM</th>
                                            <th className="p-4 text-slate-400 font-medium text-right">Harga</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-dark-700">
                                        {results.rankings.map((row: any) => (
                                            <tr key={row.Rank} className={clsx(
                                                "hover:bg-dark-700/50 cursor-pointer transition-all",
                                                selectedVendors.includes(row.Vendor) && "bg-purple-500/10"
                                            )} onClick={() => toggleVendorSelection(row.Vendor)}>
                                                <td className="p-4">
                                                    <span className={clsx(
                                                        "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                                                        row.Rank === 1 ? "bg-yellow-500/20 text-yellow-500" :
                                                            row.Rank === 2 ? "bg-slate-500/20 text-slate-400" :
                                                                row.Rank === 3 ? "bg-orange-500/20 text-orange-500" :
                                                                    "text-slate-500"
                                                    )}>#{row.Rank}</span>
                                                </td>
                                                <td className="p-4 font-medium text-white">{row.Vendor}</td>
                                                <td className="p-4 text-blue-400 font-bold">{row.Score.toFixed(4)}</td>
                                                <td className="p-4 text-slate-300">{row.CPU_val} core</td>
                                                <td className="p-4 text-slate-300">{row.RAM_val} GB</td>
                                                <td className="p-4 text-right text-slate-300">${row.Price_val}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-dark-800 rounded-2xl border border-dark-700 border-dashed">
                            <div className="p-4 bg-dark-900 rounded-full mb-4">
                                <Play className="text-slate-600" size={32} />
                            </div>
                            <h4 className="text-xl font-bold text-slate-300">Belum ada hasil analisa</h4>
                            <p className="text-slate-500 mt-2 text-center max-w-sm">
                                Sesuaikan bobot di panel sebelah kiri dan klik tombol "Hitung TOPSIS" untuk melihat rekomendasi.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnalysisView;
