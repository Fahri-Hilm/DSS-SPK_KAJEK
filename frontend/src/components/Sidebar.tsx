
import React, { useState } from 'react';
import { Home, BarChart2, Calculator, Database, History, BookOpen, ChevronLeft, ChevronRight, Menu, Settings, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';
import MagneticButton from './MagneticButton';

const cn = (...inputs: (string | undefined | null | false)[]) => twMerge(clsx(inputs));

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    collapsed?: boolean;
    onToggle?: () => void;
    currentUser?: { username: string; display_name: string; email: string } | null;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, collapsed = false, onToggle, currentUser }) => {
    const [isOpen, setIsOpen] = useState(true);

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'analysis', label: 'Analisa & Ranking', icon: BarChart2 },
        { id: 'calculation', label: 'Perhitungan', icon: Calculator },
        { id: 'data', label: 'Data Vendor', icon: Database },
        { id: 'history', label: 'Riwayat', icon: History },
        { id: 'documentation', label: 'Dokumentasi', icon: BookOpen },
        { id: 'settings', label: 'Pengaturan', icon: Settings },

    ];

    const sidebarVariants = {
        expanded: {
            width: 256,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 40,
                mass: 0.8,
                velocity: 0
            }
        },
        collapsed: {
            width: 80,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 40,
                mass: 0.8,
                velocity: 0
            }
        }
    };

    const textVariants = {
        expanded: {
            opacity: 1,
            x: 0,
            display: "block",
            transition: {
                opacity: { duration: 0.15, ease: "easeOut" },
                x: { duration: 0.15, ease: "easeOut" }
            }
        },
        collapsed: {
            opacity: 0,
            x: -10,
            transitionEnd: { display: "none" },
            transition: {
                opacity: { duration: 0.1, ease: "easeIn" },
                x: { duration: 0.1, ease: "easeIn" }
            }
        }
    };

    return (
        <>
            {/* Mobile Toggle */}
            <button
                className="fixed top-4 left-4 z-50 p-2 bg-dark-700 rounded-lg md:hidden hover:scale-110 transition-transform duration-200"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar Container */}
            {/* Sidebar Container */}
            <motion.div
                className={cn(
                    "fixed inset-y-0 left-0 z-50 glass-panel border-r border-white/5 border-y-0 border-l-0 rounded-none flex flex-col bg-dark-900/95 overflow-hidden md:relative md:h-screen will-change-[width]",
                    // Mobile handling remains CSS based for simplicity or can be upgraded too, focusing on desktop smooth collapse first
                    isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
                variants={sidebarVariants}
                animate={collapsed ? "collapsed" : "expanded"}
                initial={false}
                style={{ transform: "translateZ(0)" }} // Force GPU acceleration
            >
                {/* Header */}
                <div className="flex items-center justify-between h-20 px-6 mb-2 flex-shrink-0">
                    <AnimatePresence mode='wait'>
                        {!collapsed && (
                            <motion.div
                                className="flex flex-col gap-0.5 overflow-hidden whitespace-nowrap"
                                variants={textVariants}
                                initial="collapsed"
                                animate="expanded"
                                exit="collapsed"
                            >
                                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent tracking-tight">
                                    SPK KAJEK
                                </h1>
                                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Dashboard</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Desktop Toggle */}
                    <button
                        onClick={onToggle}
                        className={cn(
                            "hidden md:flex p-1.5 rounded-lg hover:bg-white/10 transition-all duration-200 group items-center justify-center flex-shrink-0 relative z-20",
                            collapsed ? "mx-auto" : ""
                        )}
                        title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    >
                        {collapsed ? (
                            <ChevronRight size={18} className="text-slate-400 group-hover:text-blue-300" />
                        ) : (
                            <ChevronLeft size={18} className="text-slate-400 group-hover:text-blue-300" />
                        )}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-3 space-y-2 flex-1 overflow-y-auto custom-scrollbar overflow-x-hidden">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;

                        return (
                            <MagneticButton key={item.id} className="w-full relative group" strength={20}>
                                <button
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        if (window.innerWidth < 768) setIsOpen(false);
                                    }}
                                    className={cn(
                                        "w-full flex items-center p-3 rounded-xl transition-all duration-200 relative overflow-hidden flex-shrink-0 cursor-pointer",
                                        collapsed ? "justify-center" : "justify-start gap-3",
                                        isActive
                                            ? "text-white shadow-lg shadow-blue-500/20"
                                            : "text-slate-400 hover:text-slate-100"
                                    )}
                                    title={collapsed ? item.label : undefined}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        />
                                    )}

                                    <Icon size={20} className={clsx(
                                        "transition-transform duration-300",
                                        isActive ? "text-blue-400 scale-110" : "group-hover:scale-110"
                                    )} />

                                    {!collapsed && (
                                        <span className="font-medium tracking-wide">
                                            {item.label}
                                        </span>
                                    )}

                                    {isActive && !collapsed && (
                                        <motion.div
                                            className="absolute inset-0 bg-blue-400/5"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        />
                                    )}
                                </button>

                                {/* Tooltip for collapsed state */}
                                {collapsed && (
                                    <div className="absolute left-full top-0 ml-3.5 px-3 py-2 bg-slate-900 border border-white/10 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-xl backdrop-blur-md">
                                        {item.label}
                                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-900 border-l border-b border-white/10 rotate-45"></div>
                                    </div>
                                )}
                            </MagneticButton>
                        );
                    })}
                </nav>

                {/* Footer - User Info */}
                <AnimatePresence>
                    {!collapsed && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-4 mx-4 mb-2 border-t border-white/5 overflow-hidden"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                    {currentUser?.display_name?.charAt(0) || 'A'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-white truncate">
                                        {currentUser?.display_name || 'Administrator'}
                                    </div>
                                    <div className="text-xs text-slate-500 truncate">
                                        @{currentUser?.username || 'admin'}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default Sidebar;
