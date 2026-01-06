import React, { useEffect, useState } from 'react';
import { api, DataItem } from '../services/api';
import { Trophy, Sparkles, Activity, Server, DollarSign, ArrowRight, Zap, Info, Database } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, animate, AnimatePresence } from 'framer-motion';
import LiquidLoader from './LiquidLoader';
import ParticleBackground from './ParticleBackground';
import AnimatedText from './AnimatedText';


interface DashboardViewProps {
    onNavigate: (tab: string) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
    const [data, setData] = useState<DataItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await api.getData();
                setData(result);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center relative bg-dark-900">
                <ParticleBackground particleCount={10} />
                <div className="text-center z-10">
                    <LiquidLoader />
                    <p className="text-slate-400 mt-4">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    const totalVendors = data.length;

    return (
        <div className="relative min-h-[80vh] text-slate-100 overflow-visible">
            {/* Keeping it for extra flair if desired, or relying on Layout's background */}

            <div className="relative z-10 w-full space-y-8 animate-in fade-in duration-700">

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pt-4">
                    <StatCard
                        icon={Server}
                        label="Total Vendor"
                        value={totalVendors.toString()}
                        trend="+2 New"
                        trendUp={true}
                        color="text-blue-400"
                        bg="glass-card hover-glow"
                        border="border-blue-500/10"
                        delay={0}
                    />
                    <StatCard
                        icon={Activity}
                        label="Active Criteria"
                        value="4"
                        subtext="CPU, RAM, Disk, Price"
                        color="text-purple-400"
                        bg="glass-card hover-glow"
                        border="border-purple-500/10"
                        delay={100}
                    />
                    <StatCard
                        icon={DollarSign}
                        label="Price Range"
                        value="$5 - $250"
                        subtext="Monthly Rates"
                        color="text-emerald-400"
                        bg="glass-card hover-glow"
                        border="border-emerald-500/10"
                        delay={200}
                    />
                    <StatCard
                        icon={Trophy}
                        label="Analysis Status"
                        value="Standby"
                        subtext="Ready to Calculate"
                        color="text-amber-400"
                        bg="glass-card hover-glow"
                        border="border-amber-500/10"
                        delay={300}
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* Left: Data Table (Span 2) */}
                    <motion.div
                        className="lg:col-span-2 glass-card rounded-3xl p-1 flex flex-col hover:shadow-2xl transition-shadow duration-500"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="p-6 flex items-center justify-between border-b border-white/5">
                            <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                                    <Database size={20} />
                                </div>
                                Latest Vendors
                            </h3>
                            <button
                                onClick={() => onNavigate('data')}
                                className="text-sm font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-2 group px-3 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer"
                            >
                                View All
                                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                        <div className="p-2 overflow-x-auto flex-1">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-xs text-slate-400 uppercase tracking-widest border-b border-white/5">
                                        <th className="p-4 font-semibold">Vendor Name</th>
                                        <th className="p-4 font-semibold">Plan</th>
                                        <th className="p-4 font-semibold text-center">CPU</th>
                                        <th className="p-4 font-semibold text-center">RAM</th>
                                        <th className="p-4 font-semibold text-center">Price</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {data.slice(0, 5).map((row, i) => (
                                        <tr key={i} className="group hover:bg-white/5 transition-colors cursor-pointer">
                                            <td className="p-4 font-medium text-slate-200 group-hover:text-blue-300 transition-colors">
                                                {row.Vendor}
                                            </td>
                                            <td className="p-4 text-slate-400 font-light">
                                                {row['Nama Paket (Plan)']}
                                            </td>
                                            <td className="p-4 text-center">
                                                <LevelBadge level={Number(row.CPU_Level)} color="blue" />
                                            </td>
                                            <td className="p-4 text-center">
                                                <LevelBadge level={Number(row.RAM_Level)} color="purple" />
                                            </td>
                                            <td className="p-4 text-center">
                                                <LevelBadge level={Number(row.Price_Level)} color="emerald" inverse />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                    {/* Right: CTA Card (Span 1) */}
                    <div className="flex flex-col gap-6 sticky top-24">
                        <TiltCard
                            className="glass-card rounded-3xl p-8 relative overflow-hidden group"
                        >
                            {/* Gradient Blobs */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/30 transition-colors duration-500 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/20 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/25">
                                    <Zap className="text-white fill-current" size={28} />
                                </div>

                                <h3 className="text-3xl font-bold mb-3 leading-tight text-white">
                                    Siap Menganalisa?
                                </h3>

                                <p className="text-slate-300 text-sm leading-relaxed mb-8 font-light">
                                    Atur preferensi Anda dan jalankan algoritma TOPSIS untuk menemukan VPS terbaik yang sesuai kebutuhan.
                                </p>

                                <button
                                    className="w-full py-4 bg-white text-dark-900 rounded-xl font-bold shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group/btn relative overflow-hidden ring-2 ring-white/50 ring-offset-2 ring-offset-blue-600/20 cursor-pointer"
                                    onClick={() => onNavigate('analysis')}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-white opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                    <span className="relative z-10 flex items-center gap-2">
                                        Mulai Analisa
                                        <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </span>
                                </button>
                            </div>
                        </TiltCard>

                        {/* Guide Card */}
                        <motion.div
                            className="glass-panel rounded-2xl p-6 flex gap-4 items-start"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="p-2 rounded-lg bg-slate-800/50 text-slate-400 shrink-0">
                                <Info size={20} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-200 mb-1">Panduan Cepat</h4>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Masukkan bobot (1-5) untuk setiap kriteria agar algoritma peringkat sesuai dengan prioritas Anda.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Sub-components ---

interface StatCardProps {
    icon: any;
    label: string;
    value: string;
    subtext?: string;
    trend?: string;
    trendUp?: boolean;
    color: string;
    bg: string;
    border: string;
    delay?: number;
}

const SpotlightCard: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className = "", delay = 0 }) => {
    const divRef = React.useRef<HTMLDivElement>(null);
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = React.useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;
        const rect = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleFocus = () => {
        setOpacity(1);
    };

    const handleBlur = () => {
        setOpacity(0);
    };

    const handleMouseEnter = () => {
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    return (
        <motion.div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={clsx(
                "relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 transition-all duration-300",
                className
            )}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: delay * 0.001 }}
        >
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(59,130,246,0.1), transparent 40%)`,
                }}
            />
            <div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    opacity,
                    background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(59,130,246,0.4), transparent 40%)`,
                    maskImage: `linear-gradient(black, black) content-box, linear-gradient(black, black)`,
                    WebkitMaskImage: `linear-gradient(black, black) content-box, linear-gradient(black, black)`,
                    maskComposite: `exclude`,
                    WebkitMaskComposite: `xor`,
                }}
            />
            <div className="relative h-full">{children}</div>
        </motion.div>
    );
};

const TiltCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => {
    const x = React.useRef(0);
    const y = React.useRef(0);
    const ref = React.useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.current = xPct;
        y.current = yPct;

        ref.current.style.transform = `perspective(1000px) rotateX(${-yPct * 10}deg) rotateY(${xPct * 10}deg)`;
    };

    const handleMouseLeave = () => {
        if (!ref.current) return;
        x.current = 0;
        y.current = 0;
        ref.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={clsx("transition-transform duration-200 ease-out preserve-3d", className)}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
        >
            {children}
        </motion.div>
    );
};



const CountUp: React.FC<{ value: number | string; duration?: number; prefix?: string; suffix?: string }> = ({ value, duration = 2, prefix = "", suffix = "" }) => {
    const nodeRef = React.useRef<HTMLSpanElement>(null);
    const motionValue = React.useRef(0); // Store previous value if needed, but for simple mount animation:

    useEffect(() => {
        const node = nodeRef.current;
        if (!node) return;

        // Extract numeric part if possible, otherwise just display string
        const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, "")) : value;

        if (isNaN(numericValue)) {
            node.textContent = String(value);
            return;
        }

        const controls = animate(0, numericValue, {
            duration: duration,
            ease: "easeOut",
            onUpdate: (v) => {
                // Determine format
                // If original had decimals, keep decimals. Rough heuristic.
                const isFloat = String(value).includes('.');
                const formatted = isFloat ? v.toFixed(1) : Math.round(v).toString();
                node.textContent = prefix + formatted + suffix;
            }
        });

        return () => controls.stop();
    }, [value, duration, prefix, suffix]);

    // Handle range case specifically for "$5 - $250" or similar COMPLEX strings that are not single numbers
    // If the value is a range string like "$5 - $250", we skip animation or parse differently.
    // For simplicity, if it contains non-numeric chars other than standard prefix/suffix, we might just render it static or specialized.
    // Let's stick to simple number animation for now. If value is complex, just render it.
    const isComplex = typeof value === 'string' && value.includes(' - ');
    if (isComplex) return <span>{value}</span>;

    return <span ref={nodeRef} />;
};

const StatCard: React.FC<StatCardProps> = ({
    icon: Icon, label, value, subtext, trend, trendUp, color, bg, border, delay = 0
}) => (
    <SpotlightCard
        delay={delay}
        className={clsx(
            "group hover:shadow-lg hover:-translate-y-1",
            bg,
            border
        )}
    >
        <div className="p-6 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
                <div className={clsx("p-2.5 rounded-xl bg-dark-900/40 backdrop-blur-sm shadow-sm ring-1 ring-white/5 transition-colors group-hover:bg-white/10", color)}>
                    <Icon size={20} />
                </div>
                {trend && (
                    <span className={clsx(
                        "text-xs font-medium px-2 py-1 rounded-full border flex items-center gap-1",
                        trendUp ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
                    )}>
                        {trend}
                    </span>
                )}
            </div>
            <div>
                <h4 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-1 group-hover:scale-[1.02] origin-left transition-transform">
                    {/* Heuristic to check if value is animatable number */}
                    {(typeof value === 'number' || (typeof value === 'string' && !isNaN(parseFloat(value)))) && !String(value).includes('$') ? (
                        <CountUp value={value} />
                    ) : (
                        value // Render directly if currency range or complex string
                    )}
                </h4>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider opacity-80">{label}</p>
                {subtext && <p className="text-xs text-slate-500 mt-1.5 border-t border-white/5 pt-1.5">{subtext}</p>}
            </div>
        </div>
    </SpotlightCard>
);

const LevelBadge: React.FC<{ level: number, color: 'blue' | 'purple' | 'emerald' | 'amber', inverse?: boolean }> = ({ level, color, inverse }) => {
    // Determine color classes
    const colors = {
        blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    };

    // Generate bars based on level (max 5)
    return (
        <div className="flex flex-col items-center gap-1">
            <div className={clsx("px-2 py-0.5 rounded text-[10px] font-bold border", colors[color])}>
                Lvl {level}
            </div>
            <div className="flex gap-0.5 h-1">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className={clsx(
                            "w-1.5 rounded-sm transition-all",
                            i < level
                                ? (color === 'blue' ? 'bg-blue-500' : color === 'purple' ? 'bg-purple-500' : color === 'emerald' ? 'bg-emerald-500' : 'bg-amber-500')
                                : "bg-dark-700"
                        )}
                    />
                ))}
            </div>
        </div>
    );
};

export default DashboardView;
