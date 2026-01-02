import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Key, Save, Settings as SettingsIcon, CheckCircle, AlertCircle, X, User, Mail, Bell, Globe, Moon } from 'lucide-react';
import { api } from '../services/api';

const SettingsView: React.FC = () => {
    // Toast State
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    // Password State
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Profile State
    const [displayName, setDisplayName] = useState('Administrator');
    const [email, setEmail] = useState('admin@spk-kajek.com');
    const [loading, setLoading] = useState(false);

    // Preferences State
    const [language, setLanguage] = useState('id');
    const [notifications, setNotifications] = useState(true);

    // Load profile on component mount
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const profile = await api.getProfile();
                setDisplayName(profile.display_name);
                setEmail(profile.email);
            } catch (error) {
                console.error('Failed to load profile:', error);
                showNotification('error', 'Gagal memuat profil');
            }
        };
        loadProfile();
    }, []);

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword.length < 6) {
            showNotification('error', 'Kata sandi baru minimal 6 karakter.');
            return;
        }
        if (newPassword !== confirmPassword) {
            showNotification('error', 'Konfirmasi kata sandi tidak cocok.');
            return;
        }

        setLoading(true);
        try {
            await api.changePassword(oldPassword, newPassword);
            showNotification('success', 'Kata sandi berhasil diperbarui!');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            const errorMessage = error?.response?.data?.detail || 'Gagal mengubah kata sandi';
            showNotification('error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.updateProfile(email, displayName);
            showNotification('success', 'Profil berhasil diperbarui!');
        } catch (error: any) {
            const errorMessage = error?.response?.data?.detail || 'Gagal memperbarui profil';
            showNotification('error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/10">
                    <SettingsIcon size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Pengaturan</h1>
                    <p className="text-slate-400">Kelola profil, preferensi, dan keamanan akun Anda.</p>
                </div>
            </div>

            {/* Notification Toast */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: '50%' }}
                        animate={{ opacity: 1, y: 0, x: '50%' }}
                        exit={{ opacity: 0, y: -20, x: '50%' }}
                        className={`fixed top-6 right-1/2 transform translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-md border ${notification.type === 'success'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'
                            : 'bg-red-500/10 border-red-500/20 text-red-200'
                            }`}
                    >
                        {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        <span className="font-medium">{notification.message}</span>
                        <button onClick={() => setNotification(null)} className="ml-2 opacity-70 hover:opacity-100">
                            <X size={16} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* 1. Profile & Preferences Section (Replaces Criteria) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-8 rounded-3xl border border-white/5 relative overflow-hidden group space-y-8"
                >
                    <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -translate-y-1/2 -translate-x-1/2 pointer-events-none group-hover:bg-emerald-500/20 transition-colors duration-500"></div>

                    {/* Profile Form */}
                    <div>
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <User className="text-emerald-400" size={24} />
                            <h2 className="text-xl font-bold text-white">Profil Pengguna</h2>
                        </div>
                        <form onSubmit={handleProfileUpdate} className="space-y-5 relative z-10">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400 ml-1">Nama Tampilan</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="text"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400 ml-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all flex items-center justify-center gap-2"
                            >
                                <Save size={18} />
                                Simpan Profil
                            </button>
                        </form>
                    </div>

                    <div className="border-t border-white/10 my-6"></div>

                    {/* Preferences Controls */}
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <SettingsIcon className="text-emerald-400" size={24} />
                            <h2 className="text-xl font-bold text-white">Preferensi</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                        <Globe size={18} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-slate-200">Bahasa</span>
                                        <span className="text-xs text-slate-500">Bahasa antarmuka</span>
                                    </div>
                                </div>
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="bg-black/40 border border-white/10 rounded-lg py-1.5 px-3 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
                                >
                                    <option value="id">Indonesia</option>
                                    <option value="en">English</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                                        <Bell size={18} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-slate-200">Notifikasi</span>
                                        <span className="text-xs text-slate-500">Info pembaruan sistem</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setNotifications(!notifications)}
                                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${notifications ? 'bg-emerald-500' : 'bg-slate-700'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${notifications ? 'translate-x-6' : 'translate-x-0'}`} />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* 2. Security Section (Kept as is, just styled consistent) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-8 rounded-3xl border border-white/5 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-blue-500/20 transition-colors duration-500"></div>

                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <Shield className="text-blue-400" size={24} />
                        <h2 className="text-xl font-bold text-white">Keamanan</h2>
                    </div>

                    <form onSubmit={handlePasswordChange} className="space-y-5 relative z-10">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400 ml-1">Kata Sandi Lama</label>
                            <div className="relative">
                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                                    placeholder="Masukkan kata sandi lama"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400 ml-1">Kata Sandi Baru</label>
                            <div className="relative">
                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                                    placeholder="Minimal 6 karakter"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400 ml-1">Konfirmasi Kata Sandi</label>
                            <div className="relative">
                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                                    placeholder="Ulangi kata sandi baru"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2 mt-4"
                        >
                            <Save size={18} />
                            Ubah Password
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default SettingsView;
