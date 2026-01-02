import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Trash2, RotateCcw, FileDown, Search, Filter, Calendar, Tag, ArrowRight, CheckCircle2, MoreVertical, X, Sparkles, Scale, TrendingUp, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface HistoryItem {
    id: number;
    timestamp: string;
    title: string;
    description: string;
    tags: string[];
    weights: {
        cpu: number;
        ram: number;
        disk: number;
        price: number;
    };
    total_alternatives: number;
    top_vendor: string;
    top_score: number;
    rankings: any[];
}

import HistoryTrendChart from './HistoryTrendChart';

const HistoryView: React.FC = () => {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [showComparison, setShowComparison] = useState(false);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            setLoading(true);
            const data = await api.getHistory();
            setHistory(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Hapus riwayat ini?')) {
            try {
                await api.deleteHistory(id);
                loadHistory();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleClearAll = async () => {
        if (confirm('Bersihkan SEMUA riwayat? Tindakan ini tidak dapat dibatalkan.')) {
            try {
                await api.clearHistory();
                loadHistory();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleRestore = (item: HistoryItem) => {
        localStorage.setItem('restore_weights', JSON.stringify(item.weights));
        alert(`Bobot "${item.title}" telah dimuat. Silakan buka menu Analysis.`);
    };

    const toggleSelection = (id: number) => {
        setSelectedItems(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleExportPDF = (item: HistoryItem) => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(20);
        doc.setTextColor(40, 40, 40);
        doc.text("SPK Kajek - Laporan Analisa", 14, 22);

        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text(`Title: ${item.title}`, 14, 32);
        doc.text(`Date: ${new Date(item.timestamp).toLocaleString()}`, 14, 38);
        doc.text(`Top Candidate: ${item.top_vendor} (Score: ${item.top_score})`, 14, 44);

        // Weights
        doc.setFillColor(240, 240, 250);
        doc.rect(14, 50, 180, 20, 'F');
        doc.setFontSize(10);
        doc.text(`Weights used: CPU: ${(item.weights.cpu * 100)}%, RAM: ${(item.weights.ram * 100)}%, Disk: ${(item.weights.disk * 100)}%, Price: ${(item.weights.price * 100)}%`, 16, 62);

        // Rankings Table
        const tableColumn = ["Rank", "Vendor", "Plan", "Score"];
        const tableRows = item.rankings.map(r => [r.Rank, r.Vendor, r['Nama Paket (Plan)'], r.Score.toFixed(4)]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 75,
            theme: 'grid',
            headStyles: { fillColor: [59, 130, 246] }
        });

        doc.save(`spk-report-${item.id}.pdf`);
    };

    const filteredHistory = history.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.tags && item.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));

        let matchesDate = true;
        if (startDate || endDate) {
            const itemDate = new Date(item.timestamp);
            const start = startDate ? new Date(startDate) : new Date('1970-01-01');
            const end = endDate ? new Date(endDate) : new Date('2100-01-01');

            // Set end date to end of day
            end.setHours(23, 59, 59, 999);

            matchesDate = itemDate >= start && itemDate <= end;
        }

        return matchesSearch && matchesDate;
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Group by Date for Timeline
    const groupedHistory = filteredHistory.reduce((groups, item) => {
        const date = new Date(item.timestamp).toLocaleDateString(undefined, {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
        if (!groups[date]) groups[date] = [];
        groups[date].push(item);
        return groups;
    }, {} as Record<string, HistoryItem[]>);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Riwayat Analisa</h2>
                    <p className="text-slate-400">Arsip perhitungan dan pengambilan keputusan sebelumnya.</p>
                </div>
                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-48">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Cari judul/tag..."
                            className="w-full pl-10 pr-4 py-2 glass-input rounded-xl text-sm text-slate-200 outline-none focus:border-blue-500/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Date Range Inputs */}
                    <div className="flex items-center gap-2 bg-slate-900/40 rounded-xl p-1.5 border border-white/5 hover:border-blue-500/20 transition-all">
                        <div className="pl-2 text-slate-500">
                            <Calendar size={14} />
                        </div>
                        <div className="relative">
                            <input
                                type="date"
                                className="bg-transparent border-none text-xs text-slate-300 outline-none focus:ring-0 w-28 px-1 [color-scheme:dark] font-mono opacity-70 hover:opacity-100 transition-opacity"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <span className="text-slate-600 text-xs">to</span>
                        <div className="relative">
                            <input
                                type="date"
                                className="bg-transparent border-none text-xs text-slate-300 outline-none focus:ring-0 w-28 px-1 [color-scheme:dark] font-mono opacity-70 hover:opacity-100 transition-opacity"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                        {(startDate || endDate) && (
                            <button
                                onClick={() => { setStartDate(''); setEndDate(''); }}
                                className="p-1 text-slate-500 hover:text-red-400 rounded-md hover:bg-white/5 ml-1"
                                title="Reset Tanggal"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                    {history.length > 0 && (
                        <button
                            onClick={handleClearAll}
                            className="px-3 py-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                            title="Hapus Semua"
                        >
                            <Trash2 size={18} />
                        </button>
                    )}
                    {selectedItems.length >= 2 && (
                        <button
                            onClick={() => setShowComparison(true)}
                            className="px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-500 transition-colors flex items-center gap-2"
                        >
                            <Scale size={16} /> Bandingkan ({selectedItems.length})
                        </button>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-slate-500">Memuat riwayat...</div>
            ) : Object.keys(groupedHistory).length === 0 ? (
                <div className="text-center py-20 glass-panel rounded-2xl">
                    <div className="bg-slate-800/50 p-4 rounded-full inline-block mb-4">
                        <Calendar className="text-slate-500" size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-slate-300">Belum ada riwayat</h3>
                    <p className="text-slate-500 mt-2">Lakukan perhitungan di menu Analysis untuk menyimpan riwayat.</p>
                </div>
            ) : (
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">

                    {/* Stats Summary */}
                    <div className="relative md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="glass-panel p-5 rounded-2xl border border-white/5 flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Total Analisa</div>
                                <div className="text-2xl font-bold text-white">{history.length}</div>
                            </div>
                        </div>
                        <div className="glass-panel p-5 rounded-2xl border border-white/5 flex items-center gap-4">
                            <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-400">
                                <Award size={24} />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Vendor Favorit</div>
                                <div className="text-2xl font-bold text-white">
                                    {history.length > 0
                                        ? Object.entries(history.reduce((acc, curr) => {
                                            acc[curr.top_vendor] = (acc[curr.top_vendor] || 0) + 1;
                                            return acc;
                                        }, {} as Record<string, number>))
                                            .sort(([, a], [, b]) => b - a)[0][0]
                                        : '-'
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="glass-panel p-5 rounded-2xl border border-white/5 flex items-center gap-4">
                            <div className="p-3 bg-green-500/10 rounded-xl text-green-400">
                                <Scale size={24} />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Rata-rata Skor</div>
                                <div className="text-2xl font-bold text-white">
                                    {history.length > 0
                                        ? (history.reduce((acc, curr) => acc + curr.top_score, 0) / history.length).toFixed(4)
                                        : '0.0000'
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Trend Chart */}
                    <div className="relative md:col-span-2 mb-12">
                        <HistoryTrendChart data={history} />
                    </div>
                    {Object.entries(groupedHistory).map(([date, items]) => (
                        <div key={date} className="relative">
                            <div className="sticky top-20 z-10 mb-6 flex items-center justify-center">
                                <span className="glass-panel px-4 py-1.5 rounded-full text-xs font-semibold text-slate-400 border border-white/10 shadow-lg backdrop-blur-md">
                                    {date}
                                </span>
                            </div>

                            <div className="space-y-12">
                                {items.map((item, idx) => {
                                    // Use global index to ensure consistent Zig-Zag across different date groups
                                    const globalIdx = filteredHistory.findIndex(h => h.id === item.id);
                                    const isLeft = globalIdx % 2 === 0;

                                    return (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: globalIdx * 0.05 }}
                                            className={clsx(
                                                "relative flex items-center justify-between md:justify-normal group",
                                                // Zig-Zag Logic:
                                                // Even (0, 2): Normal -> Card Left, Filler Right
                                                // Odd (1, 3): Reverse -> Card Right, Filler Left
                                                isLeft ? "md:flex-row" : "md:flex-row-reverse",
                                                "flex-col gap-8"
                                            )}
                                        >
                                            {/* Timeline Dot */}
                                            <div className="absolute left-0 md:left-1/2 w-10 h-10 -ml-5 md:-ml-5 flex items-center justify-center z-20">
                                                <div className={clsx(
                                                    "w-4 h-4 rounded-full border-2 transition-all duration-300 bg-dark-900",
                                                    selectedItems.includes(item.id)
                                                        ? "border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] scale-125"
                                                        : "border-slate-600 group-hover:border-blue-500"
                                                )}></div>
                                            </div>

                                            {/* Content Card */}
                                            <div className={clsx(
                                                "w-full md:w-[calc(50%-2rem)] glass-panel p-5 rounded-2xl border border-white/5 hover:border-blue-500/20 transition-all duration-300 group-hover:bg-white/[0.02] relative",
                                                selectedItems.includes(item.id) && "ring-1 ring-blue-500/40 bg-blue-500/5",
                                                // Add connector line to spine
                                                isLeft ? "md:mr-auto" : "md:ml-auto"
                                            )}>
                                                {/* Connector Line (Desktop) */}
                                                <div className={clsx(
                                                    "hidden md:block absolute top-1/2 w-8 h-px bg-slate-700/50",
                                                    isLeft ? "-right-8" : "-left-8"
                                                )} />

                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="font-bold text-white text-lg">{item.title}</h3>
                                                            {item.tags?.map(tag => (
                                                                <span key={tag} className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-[10px] rounded-md font-medium">#{tag}</span>
                                                            ))}
                                                        </div>
                                                        <p className="text-slate-400 text-sm line-clamp-2">{item.description || "Tidak ada deskripsi"}</p>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => toggleSelection(item.id)}
                                                            className={clsx(
                                                                "p-2 rounded-lg transition-colors",
                                                                selectedItems.includes(item.id) ? "text-blue-400 bg-blue-500/10" : "text-slate-500 hover:text-white"
                                                            )}
                                                            title="Pilih untuk bandingkan"
                                                        >
                                                            {selectedItems.includes(item.id) ? <CheckCircle2 size={18} /> : <div className="w-4 h-4 rounded-full border border-current" />}
                                                        </button>

                                                        <div className="relative group/menu">
                                                            <button className="p-2 text-slate-500 hover:text-white rounded-lg hover:bg-white/5">
                                                                <MoreVertical size={18} />
                                                            </button>
                                                            {/* Dropdown Menu */}
                                                            <div className="absolute right-0 top-full mt-2 w-48 glass-panel rounded-xl shadow-xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-30 overflow-hidden flex flex-col p-1">
                                                                <button
                                                                    onClick={() => handleRestore(item)}
                                                                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-lg text-left"
                                                                >
                                                                    <RotateCcw size={14} /> Gunakan Bobot Ini
                                                                </button>
                                                                <button
                                                                    onClick={() => handleExportPDF(item)}
                                                                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-lg text-left"
                                                                >
                                                                    <FileDown size={14} /> Export PDF
                                                                </button>
                                                                <div className="h-px bg-white/10 my-1"></div>
                                                                <button
                                                                    onClick={() => handleDelete(item.id)}
                                                                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg text-left"
                                                                >
                                                                    <Trash2 size={14} /> Hapus
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 mb-4">
                                                    <div className="bg-white/5 rounded-xl p-3">
                                                        <div className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Sparkles size={12} /> Top Pick</div>
                                                        <div className="font-bold text-yellow-400">{item.top_vendor}</div>
                                                        <div className="text-xs text-slate-400">Score: {item.top_score}</div>
                                                    </div>
                                                    <div className="bg-white/5 rounded-xl p-3">
                                                        <div className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Scale size={12} /> Prioritas</div>
                                                        <div className="flex gap-1 flex-wrap">
                                                            {Object.entries(item.weights).sort(([, a], [, b]) => b - a).slice(0, 2).map(([k, v]) => (
                                                                <span key={k} className="text-xs px-1.5 py-0.5 bg-slate-700/50 rounded capitalize text-slate-300">
                                                                    {k}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="text-xs text-slate-500 text-right">
                                                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>

                                            {/* Filler Content (Opposite Side) */}
                                            <div className={clsx(
                                                "hidden md:flex w-full md:w-[calc(50%-2rem)] flex-col justify-center",
                                                isLeft ? "items-start text-left pl-12" : "items-end text-right pr-12"
                                            )}>
                                                <div className="text-5xl font-bold text-slate-700/80 group-hover:text-slate-600 transition-colors select-none tracking-tighter">
                                                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className={clsx("w-2 h-2 rounded-full", isLeft ? "bg-blue-500" : "bg-yellow-500")}></span>
                                                    <span className="text-sm font-medium text-slate-400">
                                                        Rank #1: <span className="text-slate-200">{item.top_vendor}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Comparison Modal */}
            <AnimatePresence>
                {showComparison && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setShowComparison(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-dark-900 border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl flex flex-col"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-dark-900/95 backdrop-blur z-20">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Scale className="text-purple-400" /> Perbandingan Riwayat
                                </h3>
                                <button onClick={() => setShowComparison(false)} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                {history.filter(h => selectedItems.includes(h.id)).map((item, idx) => (
                                    <div key={item.id} className="glass-panel p-6 rounded-2xl relative">
                                        <div className={clsx("absolute top-0 left-0 w-full h-1", idx === 0 ? "bg-blue-500" : "bg-purple-500")}></div>
                                        <h4 className="font-bold text-lg text-white mb-2">{item.title}</h4>
                                        <div className="text-sm text-slate-400 mb-6">{new Date(item.timestamp).toLocaleString()}</div>

                                        <div className="space-y-4">
                                            <div>
                                                <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">Bobot Kriteria</div>
                                                <div className="h-40">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                                                            { subject: 'CPU', A: item.weights.cpu, fullMark: 1 },
                                                            { subject: 'RAM', A: item.weights.ram, fullMark: 1 },
                                                            { subject: 'Disk', A: item.weights.disk, fullMark: 1 },
                                                            { subject: 'Price', A: item.weights.price, fullMark: 1 },
                                                        ]}>
                                                            <PolarGrid stroke="#334155" />
                                                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                                            <PolarRadiusAxis angle={30} domain={[0, 1]} tick={false} axisLine={false} />
                                                            <Radar name={item.title} dataKey="A" stroke={idx === 0 ? "#3b82f6" : "#a855f7"} fill={idx === 0 ? "#3b82f6" : "#a855f7"} fillOpacity={0.5} />
                                                        </RadarChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </div>

                                            <div className="border-t border-white/5 pt-4">
                                                <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl mb-2">
                                                    <span className="text-sm text-slate-300">Top Candidate</span>
                                                    <span className="font-bold text-yellow-400">{item.top_vendor}</span>
                                                </div>
                                                <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl">
                                                    <span className="text-sm text-slate-300">Score</span>
                                                    <span className="font-mono text-blue-400">{item.top_score}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default HistoryView;
