import React, { useState, useEffect } from 'react';
import { api, WeightRequest } from '../services/api';
import { History, Clock, Trophy, Trash2, Save, Plus, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface HistoryItem {
    id: number;
    timestamp: string;
    title: string;
    description: string;
    weights: WeightRequest;
    total_alternatives: number;
    top_vendor: string;
    top_score: number;
    rankings: Array<{ Rank: number; Vendor: string; 'Nama Paket (Plan)': string; Score: number }>;
}

const HistoryView: React.FC = () => {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showSaveForm, setShowSaveForm] = useState(false);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        weights: { cpu: 0.25, ram: 0.25, disk: 0.25, price: 0.25 }
    });

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const data = await api.getHistory();
            setHistory(data);
        } catch (error) {
            console.error("Failed to fetch history", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.saveToHistory(formData);
            setShowSaveForm(false);
            setFormData({
                title: '',
                description: '',
                weights: { cpu: 0.25, ram: 0.25, disk: 0.25, price: 0.25 }
            });
            fetchHistory();
        } catch (error) {
            console.error("Failed to save", error);
            alert("Gagal menyimpan perhitungan");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Yakin ingin menghapus riwayat ini?")) return;
        try {
            await api.deleteHistory(id);
            fetchHistory();
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    const handleClearAll = async () => {
        if (!confirm("Yakin ingin menghapus SEMUA riwayat?")) return;
        try {
            await api.clearHistory();
            fetchHistory();
        } catch (error) {
            console.error("Failed to clear", error);
        }
    };

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const totalWeight = Object.values(formData.weights).reduce((a, b) => a + b, 0);
    const isValid = Math.abs(totalWeight - 1.0) < 0.01;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
                            <History size={24} />
                        </span>
                        Riwayat Perhitungan
                    </h2>
                    <p className="text-slate-400 mt-1">Simpan dan lihat riwayat analisa untuk referensi pengambilan keputusan</p>
                </div>
                <div className="flex gap-3">
                    {history.length > 0 && (
                        <button
                            onClick={handleClearAll}
                            className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-xl flex items-center gap-2 transition-all"
                        >
                            <Trash2 size={18} /> Hapus Semua
                        </button>
                    )}
                    <button
                        onClick={() => setShowSaveForm(!showSaveForm)}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-amber-900/30"
                    >
                        <Plus size={18} /> Simpan Perhitungan Baru
                    </button>
                </div>
            </div>

            {/* Save Form */}
            {showSaveForm && (
                <div className="bg-dark-800 rounded-2xl border border-dark-700 p-6 animate-in slide-in-from-top duration-300">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Save size={20} className="text-amber-400" />
                        Simpan Perhitungan ke Riwayat
                    </h3>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Judul *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 bg-dark-900 border border-dark-600 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                                    placeholder="Contoh: Analisa Q1 2025"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Deskripsi</label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 bg-dark-900 border border-dark-600 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                                    placeholder="Contoh: Fokus pada performa tinggi"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Bobot Kriteria (Total = 1.0)</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {Object.entries(formData.weights).map(([key, val]) => (
                                    <div key={key}>
                                        <label className="block text-xs text-slate-500 mb-1 capitalize">{key}</label>
                                        <input
                                            type="number"
                                            min="0" max="1" step="0.05"
                                            value={val}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                weights: { ...formData.weights, [key]: parseFloat(e.target.value) || 0 }
                                            })}
                                            className="w-full px-3 py-2 bg-dark-900 border border-dark-600 rounded-xl text-white text-center text-sm focus:border-amber-500 focus:outline-none"
                                        />
                                    </div>
                                ))}
                            </div>
                            {!isValid && (
                                <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                                    <AlertCircle size={14} /> Total bobot harus = 1.0 (saat ini: {totalWeight.toFixed(2)})
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setShowSaveForm(false)}
                                className="px-6 py-2 bg-dark-700 hover:bg-dark-600 text-slate-300 rounded-xl transition-all"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={saving || !isValid}
                                className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl transition-all disabled:opacity-50"
                            >
                                {saving ? "Menyimpan..." : "Simpan"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* History List */}
            {loading ? (
                <div className="bg-dark-800 rounded-2xl border border-dark-700 p-8 text-center text-slate-400">
                    Memuat riwayat...
                </div>
            ) : history.length === 0 ? (
                <div className="bg-dark-800 rounded-2xl border border-dark-700 border-dashed p-12 text-center">
                    <History className="mx-auto text-slate-600 mb-4" size={48} />
                    <h4 className="text-xl font-bold text-slate-300">Belum ada riwayat</h4>
                    <p className="text-slate-500 mt-2">Klik "Simpan Perhitungan Baru" untuk menyimpan hasil analisa pertama Anda</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {history.map((item) => (
                        <div
                            key={item.id}
                            className="bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden"
                        >
                            <button
                                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                                className="w-full p-4 flex items-center justify-between hover:bg-dark-700/30 transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl">
                                        <Clock size={20} />
                                    </div>
                                    <div className="text-left">
                                        <h4 className="font-bold text-white">{item.title}</h4>
                                        <p className="text-sm text-slate-400 mt-1">{formatDate(item.timestamp)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right hidden md:block">
                                        <div className="flex items-center gap-2 text-yellow-400">
                                            <Trophy size={16} />
                                            <span className="font-bold">{item.top_vendor}</span>
                                        </div>
                                        <p className="text-sm text-slate-400">Score: {item.top_score}</p>
                                    </div>
                                    {expandedId === item.id ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                                </div>
                            </button>

                            {expandedId === item.id && (
                                <div className="p-4 pt-0 border-t border-dark-700 space-y-4">
                                    {item.description && (
                                        <p className="text-slate-400 text-sm">{item.description}</p>
                                    )}

                                    {/* Weights */}
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm">CPU: {item.weights.cpu}</span>
                                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm">RAM: {item.weights.ram}</span>
                                        <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-sm">Disk: {item.weights.disk}</span>
                                        <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-lg text-sm">Harga: {item.weights.price}</span>
                                    </div>

                                    {/* Top 5 Rankings */}
                                    <div className="bg-dark-900/50 rounded-xl overflow-hidden">
                                        <div className="p-3 border-b border-dark-700 text-sm text-slate-400 font-medium">
                                            Top 5 Ranking ({item.total_alternatives} alternatif)
                                        </div>
                                        <table className="w-full text-sm">
                                            <tbody>
                                                {item.rankings.map((r, idx) => (
                                                    <tr key={idx} className={clsx("border-b border-dark-700/50 last:border-0", r.Rank === 1 && "bg-yellow-500/10")}>
                                                        <td className="p-3 w-12">
                                                            <span className={clsx(
                                                                "px-2 py-1 rounded-full text-xs font-bold",
                                                                r.Rank === 1 ? "bg-yellow-500/20 text-yellow-500" :
                                                                    r.Rank === 2 ? "bg-slate-500/20 text-slate-400" :
                                                                        r.Rank === 3 ? "bg-orange-500/20 text-orange-500" :
                                                                            "text-slate-500"
                                                            )}>#{r.Rank}</span>
                                                        </td>
                                                        <td className="p-3 font-medium text-white">{r.Vendor}</td>
                                                        <td className="p-3 text-slate-400">{r['Nama Paket (Plan)']}</td>
                                                        <td className="p-3 text-right text-cyan-400 font-mono">{r.Score.toFixed(4)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Delete Button */}
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="px-4 py-2 text-red-400 hover:bg-red-500/20 rounded-xl flex items-center gap-2 transition-all text-sm"
                                        >
                                            <Trash2 size={16} /> Hapus Riwayat Ini
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HistoryView;
