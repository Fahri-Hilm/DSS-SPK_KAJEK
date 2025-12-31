import React, { useState, useEffect } from 'react';
import { api, DataItem, VendorRequest } from '../services/api';
import { Plus, Trash2, Database, RefreshCw, Edit2, Check, X } from 'lucide-react';
import { clsx } from 'clsx';

const DataView: React.FC = () => {
    const [data, setData] = useState<DataItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editData, setEditData] = useState<VendorRequest>({
        vendor: '',
        nama_paket: '',
        cpu_level: 1,
        ram_level: 1,
        diskio_level: 1,
        price_level: 1
    });
    const [formData, setFormData] = useState<VendorRequest>({
        vendor: '',
        nama_paket: '',
        cpu_level: 1,
        ram_level: 1,
        diskio_level: 1,
        price_level: 1
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await api.getData();
            setData(result);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.addVendor(formData);
            setFormData({ vendor: '', nama_paket: '', cpu_level: 1, ram_level: 1, diskio_level: 1, price_level: 1 });
            setShowForm(false);
            fetchData();
        } catch (error) {
            console.error("Failed to add vendor", error);
            alert("Gagal menambahkan vendor");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (no: number) => {
        if (!confirm("Yakin ingin menghapus vendor ini?")) return;
        try {
            await api.deleteVendor(no);
            fetchData();
        } catch (error) {
            console.error("Failed to delete vendor", error);
            alert("Gagal menghapus vendor");
        }
    };

    const startEdit = (row: DataItem) => {
        setEditingId(row.No || 0);
        setEditData({
            vendor: row.Vendor,
            nama_paket: row['Nama Paket (Plan)'],
            cpu_level: Number(row.CPU_Level),
            ram_level: Number(row.RAM_Level),
            diskio_level: Number(row.DiskIO_Level),
            price_level: Number(row.Price_Level)
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
    };

    const saveEdit = async () => {
        if (!editingId) return;
        try {
            await api.updateVendor(editingId, editData);
            setEditingId(null);
            fetchData();
        } catch (error) {
            console.error("Failed to update vendor", error);
            alert("Gagal mengupdate vendor");
        }
    };

    const levelOptions = [1, 2, 3, 4, 5];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="p-2 bg-purple-500/20 text-purple-400 rounded-lg">
                            <Database size={24} />
                        </span>
                        Data Vendor
                    </h2>
                    <p className="text-slate-400 mt-1">Kelola data alternatif - klik ikon edit untuk mengubah inline</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchData} className="px-4 py-2 bg-dark-700 hover:bg-dark-600 text-slate-300 rounded-xl flex items-center gap-2 transition-all">
                        <RefreshCw size={18} /> Refresh
                    </button>
                    <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-900/30">
                        <Plus size={18} /> Tambah Vendor
                    </button>
                </div>
            </div>

            {/* Add Form */}
            {showForm && (
                <div className="bg-dark-800 rounded-2xl border border-dark-700 p-6 animate-in slide-in-from-top duration-300">
                    <h3 className="text-lg font-bold text-white mb-4">Tambah Vendor Baru</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Nama Vendor</label>
                            <input type="text" required value={formData.vendor} onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                                className="w-full px-4 py-2 bg-dark-900 border border-dark-600 rounded-xl text-white focus:border-blue-500 focus:outline-none" placeholder="Contoh: AWS" />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Nama Paket</label>
                            <input type="text" required value={formData.nama_paket} onChange={(e) => setFormData({ ...formData, nama_paket: e.target.value })}
                                className="w-full px-4 py-2 bg-dark-900 border border-dark-600 rounded-xl text-white focus:border-blue-500 focus:outline-none" placeholder="Contoh: EC2 t3.medium" />
                        </div>
                        {['cpu_level', 'ram_level', 'diskio_level', 'price_level'].map((key) => (
                            <div key={key}>
                                <label className="block text-sm text-slate-400 mb-2">{key.replace('_level', '').toUpperCase()} Level</label>
                                <select value={(formData as any)[key]} onChange={(e) => setFormData({ ...formData, [key]: parseInt(e.target.value) })}
                                    className="w-full px-4 py-2 bg-dark-900 border border-dark-600 rounded-xl text-white focus:border-blue-500 focus:outline-none">
                                    {levelOptions.map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                            </div>
                        ))}
                        <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-3 mt-4">
                            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 bg-dark-700 hover:bg-dark-600 text-slate-300 rounded-xl transition-all">Batal</button>
                            <button type="submit" disabled={submitting} className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl transition-all disabled:opacity-50">{submitting ? "Menyimpan..." : "Simpan"}</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Data Table with Inline Edit */}
            <div className="bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-slate-400">Memuat data...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-dark-900/50">
                                <tr>
                                    <th className="p-4 text-slate-400 font-medium">No</th>
                                    <th className="p-4 text-slate-400 font-medium">Vendor</th>
                                    <th className="p-4 text-slate-400 font-medium">Nama Paket</th>
                                    <th className="p-4 text-slate-400 font-medium text-center">CPU</th>
                                    <th className="p-4 text-slate-400 font-medium text-center">RAM</th>
                                    <th className="p-4 text-slate-400 font-medium text-center">Disk</th>
                                    <th className="p-4 text-slate-400 font-medium text-center">Harga</th>
                                    <th className="p-4 text-slate-400 font-medium text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-700">
                                {data.map((row, idx) => {
                                    const isEditing = editingId === row.No;
                                    return (
                                        <tr key={idx} className={clsx("hover:bg-dark-700/50", isEditing && "bg-blue-500/10")}>
                                            <td className="p-4 text-slate-500">{row.No || idx + 1}</td>
                                            <td className="p-4">
                                                {isEditing ? (
                                                    <input type="text" value={editData.vendor} onChange={(e) => setEditData({ ...editData, vendor: e.target.value })}
                                                        className="w-full px-2 py-1 bg-dark-900 border border-dark-600 rounded text-white text-sm" />
                                                ) : <span className="font-medium text-white">{row.Vendor}</span>}
                                            </td>
                                            <td className="p-4">
                                                {isEditing ? (
                                                    <input type="text" value={editData.nama_paket} onChange={(e) => setEditData({ ...editData, nama_paket: e.target.value })}
                                                        className="w-full px-2 py-1 bg-dark-900 border border-dark-600 rounded text-white text-sm" />
                                                ) : <span className="text-slate-300">{row['Nama Paket (Plan)']}</span>}
                                            </td>
                                            {['cpu_level', 'ram_level', 'diskio_level', 'price_level'].map((key, i) => {
                                                const levelKey = ['CPU_Level', 'RAM_Level', 'DiskIO_Level', 'Price_Level'][i];
                                                const colors = ['blue', 'green', 'purple', 'orange'];
                                                return (
                                                    <td key={key} className="p-4 text-center">
                                                        {isEditing ? (
                                                            <select value={(editData as any)[key]} onChange={(e) => setEditData({ ...editData, [key]: parseInt(e.target.value) })}
                                                                className="px-2 py-1 bg-dark-900 border border-dark-600 rounded text-white text-sm">
                                                                {levelOptions.map(l => <option key={l} value={l}>{l}</option>)}
                                                            </select>
                                                        ) : (
                                                            <span className={`px-2 py-1 bg-${colors[i]}-500/20 text-${colors[i]}-400 rounded-lg text-sm`}>L{(row as any)[levelKey]}</span>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                            <td className="p-4 text-center">
                                                {isEditing ? (
                                                    <div className="flex justify-center gap-1">
                                                        <button onClick={saveEdit} className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg"><Check size={18} /></button>
                                                        <button onClick={cancelEdit} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"><X size={18} /></button>
                                                    </div>
                                                ) : (
                                                    <div className="flex justify-center gap-1">
                                                        <button onClick={() => startEdit(row)} className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg" title="Edit"><Edit2 size={18} /></button>
                                                        <button onClick={() => handleDelete(row.No || idx + 1)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg" title="Hapus"><Trash2 size={18} /></button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Info Card */}
            <div className="bg-dark-800/50 rounded-2xl border border-dark-700 p-6">
                <h4 className="text-lg font-bold text-white mb-3">Panduan Level</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div><div className="text-blue-400 font-medium mb-1">CPU (Benefit)</div><div className="text-slate-400">L1: 2 core → L5: 10 core</div></div>
                    <div><div className="text-green-400 font-medium mb-1">RAM (Benefit)</div><div className="text-slate-400">L1: 2 GB → L5: 32 GB</div></div>
                    <div><div className="text-purple-400 font-medium mb-1">Disk I/O (Benefit)</div><div className="text-slate-400">L1: 150 → L5: 1000 MB/s</div></div>
                    <div><div className="text-orange-400 font-medium mb-1">Harga (Cost)</div><div className="text-slate-400">L1: $15 → L5: $250</div></div>
                </div>
            </div>
        </div>
    );
};

export default DataView;
