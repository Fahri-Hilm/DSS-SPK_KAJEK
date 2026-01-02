import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Menu, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

interface LayoutProps {
    children: React.ReactNode;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    onLogout: () => void;
    currentUser?: { username: string; display_name: string; email: string } | null;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, onLogout, currentUser }) => {
    const { theme, toggleTheme } = useTheme();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="relative flex min-h-screen overflow-hidden bg-dark-900 text-slate-200 selection:bg-blue-500/30">
            {/* Ambient Background Effects */}
            {/* Ambient Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] mix-blend-screen"
                />
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px] mix-blend-screen"
                />
                <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.4, 0.3], x: [0, 20, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute top-[20%] left-[60%] w-[30%] h-[30%] rounded-full bg-emerald-600/10 blur-[100px] mix-blend-screen"
                />
            </div>

            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                currentUser={currentUser}
            />

            <main className="relative z-10 flex-1 h-screen flex flex-col transition-all duration-300 overflow-hidden">

                {/* Top Header - Fixed/Sticky at top of Main Area */}
                <header className="h-20 flex-none flex justify-between items-center px-6 border-b border-white/5 bg-dark-900/50 backdrop-blur-md z-30">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="p-2 rounded-xl hover:bg-white/5 transition-colors md:hidden"
                        >
                            <Menu size={20} className="text-slate-300" />
                        </button>
                        <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent hidden sm:block">
                            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Panel
                        </h2>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-200 flex items-center gap-2 group"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? (
                                <Sun size={18} className="text-amber-300 group-hover:rotate-180 transition-transform duration-500" />
                            ) : (
                                <Moon size={18} className="text-indigo-400 group-hover:-rotate-12 transition-transform duration-300" />
                            )}
                        </button>
                        <button
                            onClick={onLogout}
                            className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/30 transition-all duration-200 flex items-center justify-center group"
                            aria-label="Logout"
                            title="Keluar Aplikasi"
                        >
                            <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                </header>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-x-hidden overflow-y-auto relative custom-scrollbar">
                    <div className="p-4 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-500 slide-in-from-bottom-4">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Layout;
