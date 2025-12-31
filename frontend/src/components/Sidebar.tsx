import React, { useState } from 'react';
import { Home, BarChart2, Calculator, Database, History, BookOpen, HelpCircle, Menu, X, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: (string | undefined | null | false)[]) => twMerge(clsx(inputs));

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
    const [isOpen, setIsOpen] = useState(true);

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'analysis', label: 'Analisa & Ranking', icon: BarChart2 },
        { id: 'calculation', label: 'Perhitungan', icon: Calculator },
        { id: 'data', label: 'Data Vendor', icon: Database },
        { id: 'history', label: 'Riwayat', icon: History },
        { id: 'documentation', label: 'Dokumentasi', icon: BookOpen },
        { id: 'help', label: 'Bantuan', icon: HelpCircle },
    ];

    return (
        <>
            <button
                className="fixed top-4 left-4 z-50 p-2 bg-dark-700 rounded-lg md:hidden"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-40 w-64 bg-dark-800 border-r border-dark-700 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex items-center justify-center h-20 border-b border-dark-700">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        SPK KAJEK
                    </h1>
                </div>

                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    if (window.innerWidth < 768) setIsOpen(false);
                                }}
                                className={cn(
                                    "w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200",
                                    isActive
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50"
                                        : "text-slate-400 hover:bg-dark-700 hover:text-white"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon size={20} />
                                    <span className="font-medium">{item.label}</span>
                                </div>
                                {isActive && <ChevronRight size={16} />}
                            </button>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-dark-700">
                    <div className="text-xs text-center text-slate-500">
                        © 2025 PT Kajek Indonesia
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
