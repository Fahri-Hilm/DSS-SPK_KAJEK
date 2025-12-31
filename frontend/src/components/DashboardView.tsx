import React, { useEffect, useState } from 'react';
import { api, DataItem } from '../services/api';
import { Trophy, Sparkles, Activity, Server, DollarSign } from 'lucide-react';
import { clsx } from 'clsx';

const DashboardView: React.FC = () => {
    const [data, setData] = useState<DataItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await api.getData();
                setData(result);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-10 text-center text-slate-400">Loading Dashboard...</div>;

    const totalVendors = data.length;
    // Calculate average price if Price_val exists (might not be in initial data, but logic assumes it's there or we extract it)
    // For basic stats, let's just count for now as 'data' from excel endpoint might be raw.

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-end justify-between border-b border-dark-700 pb-6">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h2>
                    <p className="text-slate-400 mt-2">Selamat datang di Sistem Pendukung Keputusan Pemilihan VPS</p>
                </div>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-dark-800 rounded-full border border-dark-700">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-medium text-green-400">System Active</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={Server}
                    label="Total Vendor"
                    value={totalVendors.toString()}
                    color="text-blue-400"
                    bg="bg-blue-400/10 border-blue-400/20"
                />
                <StatCard
                    icon={Trophy}
                    label="Rekomendasi Utama"
                    value="N/A"
                    subtext="Jalankan Analisa"
                    color="text-yellow-400"
                    bg="bg-yellow-400/10 border-yellow-400/20"
                />
                <StatCard
                    icon={DollarSign}
                    label="Range Harga"
                    value="$5 - $250"
                    color="text-green-400"
                    bg="bg-green-400/10 border-green-400/20"
                />
                <StatCard
                    icon={Activity}
                    label="Total Kriteria"
                    value="4"
                    color="text-purple-400"
                    bg="bg-purple-400/10 border-purple-400/20"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-dark-800 rounded-2xl border border-dark-700 p-6">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                        Data Vendor Terbaru
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-dark-700">
                                    <th className="pb-4 pt-2 font-medium text-slate-400">Vendor</th>
                                    <th className="pb-4 pt-2 font-medium text-slate-400">Paket</th>
                                    <th className="pb-4 pt-2 font-medium text-slate-400">CPU</th>
                                    <th className="pb-4 pt-2 font-medium text-slate-400">RAM</th>
                                    <th className="pb-4 pt-2 font-medium text-slate-400">Harga</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {data.slice(0, 5).map((row, i) => (
                                    <tr key={i} className="group hover:bg-dark-700/50 transition-colors">
                                        <td className="py-4 font-medium text-white">{row.Vendor}</td>
                                        <td className="py-4 text-slate-300">{row['Nama Paket (Plan)']}</td>
                                        <td className="py-4 text-slate-400">Level {row.CPU_Level}</td>
                                        <td className="py-4 text-slate-400">Level {row.RAM_Level}</td>
                                        <td className="py-4 text-slate-400">Level {row.Price_Level}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 pt-4 border-t border-dark-700 text-center">
                        <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                            Lihat Semua Data →
                        </button>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white relative overflow-hidden">
                    <Sparkles className="absolute top-4 right-4 text-white/20" size={100} />
                    <h3 className="text-xl font-bold mb-4 relative z-10">Mulai Analisa</h3>
                    <p className="text-blue-100 mb-6 relative z-10 text-sm leading-relaxed">
                        Gunakan metode TOPSIS untuk menemukan VPS terbaik sesuai preferensi bobot Anda.
                    </p>
                    <button className="w-full py-3 bg-white text-blue-600 rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all relative z-10">
                        Ke Halaman Analisa
                    </button>
                </div>
            </div>
        </div>
    );
};

const StatCard: React.FC<{ icon: any, label: string, value: string, subtext?: string, color: string, bg: string }> = ({
    icon: Icon, label, value, subtext, color, bg
}) => (
    <div className={clsx("p-6 rounded-2xl border transition-all hover:scale-[1.02] cursor-default", bg)}>
        <div className="flex items-start justify-between mb-4">
            <div className={clsx("p-3 rounded-xl bg-dark-900/50 shadow-sm", color)}>
                <Icon size={24} />
            </div>
        </div>
        <div>
            <h4 className="text-3xl font-bold text-white mb-1">{value}</h4>
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">{label}</p>
            {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
        </div>
    </div>
);

export default DashboardView;
