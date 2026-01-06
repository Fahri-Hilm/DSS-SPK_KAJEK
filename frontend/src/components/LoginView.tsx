import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Lock, User, Eye, EyeOff, BarChart2, ArrowRight, XCircle, AlertCircle } from 'lucide-react';

interface LoginViewProps {
    onLogin: (username: string, password: string) => Promise<void>;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
    const { theme, toggleTheme } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isShaking, setIsShaking] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        // Reset boot flag to ensure animation plays on new session
        sessionStorage.removeItem('hasBooted');

        try {
            await onLogin(email, password);
        } catch (err: any) {
            const errorMessage = err?.response?.data?.detail || "Kredensial tidak valid! Silakan periksa kembali.";
            setError(errorMessage);
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 500);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center overflow-hidden relative bg-dark-950 text-slate-200 selection:bg-blue-500 selection:text-white">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-grid-slate-800/[0.05] opacity-50" style={{ backgroundSize: '30px 30px' }}></div>
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-transparent pointer-events-none"></div>

            {/* Error Notification Toast */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            x: isShaking ? [-10, 10, -10, 10, 0] : 0
                        }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-6 py-4 rounded-2xl bg-red-500/90 dark:bg-red-500/90 light:bg-red-50 border border-red-500/50 dark:border-red-500/50 light:border-red-300 backdrop-blur-xl shadow-2xl shadow-red-500/30 max-w-md"
                    >
                        <div className="p-2 rounded-full bg-red-600/20 dark:bg-red-600/20 light:bg-red-100">
                            <AlertCircle className="text-red-50 dark:text-red-50 light:text-red-600" size={24} />
                        </div>
                        <div className="flex flex-col flex-1">
                            <span className="text-red-50 dark:text-red-50 light:text-red-900 font-bold text-sm">Login Gagal</span>
                            <span className="text-red-100 dark:text-red-100 light:text-red-700 text-xs mt-0.5">{error}</span>
                        </div>
                        <button
                            onClick={() => setError(null)}
                            className="p-1.5 hover:bg-red-500/30 dark:hover:bg-red-500/30 light:hover:bg-red-200 rounded-full transition-colors text-red-100 dark:text-red-100 light:text-red-600"
                        >
                            <XCircle size={18} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Optimized Animated Blobs - will-change for performance */}
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
                className="absolute -bottom-1/3 -left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] mix-blend-screen will-change-transform"
                style={{ transform: 'translateZ(0)' }}
            />
            <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.3, 0.2] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2, repeatType: "reverse" }}
                className="absolute -top-1/3 -right-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[100px] mix-blend-screen will-change-transform"
                style={{ transform: 'translateZ(0)' }}
            />

            {/* Theme Toggle (Absolute Top Right) */}
            <button
                onClick={toggleTheme}
                className="fixed top-6 right-6 p-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-slate-400 hover:text-blue-400 transition-colors z-50 shadow-lg"
            >
                {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <div className="container max-w-7xl mx-auto px-4 py-8 flex items-center justify-center min-h-screen relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 w-full max-w-6xl items-center">

                    {/* Left Side: Branding & Visuals */}
                    <div className="hidden lg:flex flex-col justify-center space-y-10 pr-16 text-left">
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4 mb-8">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                                    <BarChart2 className="text-white" size={32} />
                                </div>
                                <h1 className="text-4xl font-bold tracking-wider text-white">SPK KAJEK</h1>
                            </div>
                            <h2 className="text-6xl font-extrabold leading-tight text-white">
                                Solusi Cerdas <br />
                                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-lg">Pemilihan Cloud VPS</span>
                            </h2>
                            <p className="text-xl text-slate-400 max-w-md leading-relaxed">
                                Optimalkan infrastruktur digital. Pilih VPS terbaik berdasarkan performa dan harga dengan metode TOPSIS.
                            </p>
                        </div>
                    </div>

                    {/* Right Side: Login Form */}
                    <div className="flex justify-center lg:justify-end w-full">
                        <motion.div
                            animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
                            transition={{ type: "spring", stiffness: 300, damping: 10 }}
                            className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                            <div className="mb-10 text-center">
                                <h3 className="text-3xl font-bold text-white mb-2">Selamat Datang!</h3>
                                <p className="text-slate-400">Masuk untuk mengakses dasbor Anda.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-blue-200 ml-1">Nama Pengguna atau Email</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User className={`transition-colors ${error ? 'text-red-400' : 'text-slate-400 group-focus-within:text-blue-400'}`} size={20} />
                                        </div>
                                        <input
                                            type="text"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className={`block w-full pl-12 pr-4 py-3.5 bg-black/80 border rounded-xl text-white font-bold text-lg tracking-wide placeholder-slate-600 focus:outline-none focus:ring-2 transition-all duration-200 ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : 'border-white/20 focus:border-blue-500/80 focus:ring-blue-500/20'}`}
                                            placeholder=""
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between ml-1">
                                        <label className="text-sm font-bold text-blue-200">Kata Sandi</label>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className={`transition-colors ${error ? 'text-red-400' : 'text-slate-400 group-focus-within:text-blue-400'}`} size={20} />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className={`block w-full pl-12 pr-12 py-3.5 bg-black/80 border rounded-xl text-white font-bold text-lg tracking-wide placeholder-slate-600 focus:outline-none focus:ring-2 transition-all duration-200 ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : 'border-white/20 focus:border-blue-500/80 focus:ring-blue-500/20'}`}
                                            placeholder=""
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-slate-500 hover:text-blue-400 transition-colors focus:outline-none"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    <div className="flex justify-end pt-1">
                                        <a href="#" className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors">Lupa Kata Sandi?</a>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center items-center py-4 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold tracking-wide shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-3">
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Memproses...</span>
                                        </div>
                                    ) : (
                                        <>
                                            Masuk ke Dasbor
                                            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Social Login Options */}
                            <div className="my-8 relative flex items-center justify-center">
                                <div className="border-t border-white/10 dark:border-white/10 light:border-slate-200 absolute inset-0"></div>
                                <span className="px-4 bg-dark-900 dark:bg-dark-900 light:bg-white text-slate-500 dark:text-slate-500 light:text-slate-600 font-medium relative text-sm">
                                    Atau lanjutkan dengan
                                </span>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <button
                                    type="button"
                                    className="flex items-center justify-center px-4 py-3 border border-white/10 dark:border-white/10 light:border-slate-300 rounded-xl bg-white/5 dark:bg-white/5 light:bg-white hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-slate-50 text-sm font-medium text-slate-300 dark:text-slate-300 light:text-slate-700 transition-all duration-200 gap-3 w-full group"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path
                                            fill="currentColor"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M5.84 14.16c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.14H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.86l2.85-2.22.81-.48z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.14l3.66 2.84c.87-2.6 3.3-4.6 6.16-4.6z"
                                        />
                                    </svg>
                                    <span className="group-hover:translate-x-0.5 transition-transform">Lanjutkan dengan Google</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginView;
