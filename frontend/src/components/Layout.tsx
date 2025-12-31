import React from 'react';
import Sidebar from './Sidebar';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="flex min-h-screen bg-dark-900 text-slate-200">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-dark-900 p-4 md:p-8 transition-all duration-300">
                {/* Top Bar with Theme Toggle */}
                <div className="flex justify-end mb-6">
                    <button
                        onClick={toggleTheme}
                        className="p-3 rounded-xl bg-dark-800 border border-dark-700 hover:bg-dark-700 transition-all flex items-center gap-2 text-sm"
                        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {theme === 'dark' ? (
                            <>
                                <Sun size={18} className="text-yellow-400" />
                                <span className="hidden md:inline text-slate-300">Light Mode</span>
                            </>
                        ) : (
                            <>
                                <Moon size={18} className="text-blue-400" />
                                <span className="hidden md:inline text-slate-300">Dark Mode</span>
                            </>
                        )}
                    </button>
                </div>
                <div className="max-w-7xl mx-auto animate-in fade-in duration-500 slide-in-from-bottom-4">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
