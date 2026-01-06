import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Menu, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SystemBoot from './SystemBoot';
import ParallaxBackground from './ParallaxBackground';
import MagneticButton from './MagneticButton';

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

    // Boot Sequence State
    const [showBoot, setShowBoot] = useState(true);

    React.useEffect(() => {
        const hasBooted = sessionStorage.getItem('hasBooted');
        if (hasBooted) {
            setShowBoot(false);
        }
    }, []);

    const handleBootComplete = () => {
        setShowBoot(false);
        sessionStorage.setItem('hasBooted', 'true');
    };

    return (
        <div
            className="relative flex min-h-screen overflow-hidden transition-colors duration-500 ease-in-out selection:bg-blue-500/30"
            style={{
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)'
            }}
        >
            {/* Ambient Background Effects */}
            <ParallaxBackground />

            <AnimatePresence>
                {showBoot && <SystemBoot onComplete={handleBootComplete} />}
            </AnimatePresence>

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
                        <MagneticButton onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
                            <button
                                className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                            >
                                <Menu size={20} />
                            </button>
                        </MagneticButton>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-indigo-200">
                            SPK-KAJEK
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <MagneticButton onClick={toggleTheme}>
                            <button
                                className="p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-200 flex items-center gap-2 group"
                                aria-label="Toggle Theme"
                            >
                                {theme === 'dark' ? (
                                    <Sun size={18} className="text-amber-300 group-hover:rotate-180 transition-transform duration-500" />
                                ) : (
                                    <Moon size={18} className="text-indigo-400 group-hover:-rotate-12 transition-transform duration-300" />
                                )}
                            </button>
                        </MagneticButton>
                        <MagneticButton onClick={onLogout}>
                            <button
                                className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/30 transition-all duration-200 flex items-center justify-center group"
                                aria-label="Logout"
                                title="Keluar Aplikasi"
                            >
                                <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                            </button>
                        </MagneticButton>
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
