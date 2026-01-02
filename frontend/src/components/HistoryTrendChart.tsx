import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

interface HistoryItem {
    id: number;
    timestamp: string;
    top_score: number;
    top_vendor: string;
}

interface HistoryTrendChartProps {
    data: HistoryItem[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-slate-900/90 border border-white/10 backdrop-blur-md p-4 rounded-xl shadow-xl">
                <p className="text-slate-400 text-xs mb-1">{data.fullDate}</p>
                <p className="text-yellow-400 font-bold text-lg mb-1">{data.top_vendor}</p>
                <p className="text-blue-400 font-mono text-sm">
                    Score: {data.top_score.toFixed(4)}
                </p>
                <p className="text-slate-500 text-xs mt-2 italic">{data.title}</p>
            </div>
        );
    }
    return null;
};

const HistoryTrendChart: React.FC<HistoryTrendChartProps> = ({ data }) => {
    // Sort data by time ascending for the chart
    const chartData = [...data]
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        .map(item => ({
            ...item,
            date: new Date(item.timestamp).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
            fullDate: new Date(item.timestamp).toLocaleString(),
        }));

    if (chartData.length < 2) return null;

    return (
        <div className="glass-panel p-6 rounded-2xl mb-8">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="p-1.5 bg-blue-500/10 rounded-lg text-blue-400">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                        <polyline points="17 6 23 6 23 12"></polyline>
                    </svg>
                </span>
                Tren Skor Tertinggi
            </h3>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="#64748b"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#64748b"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            domain={[0, 1]}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)' }} />
                        <Area
                            type="monotone"
                            dataKey="top_score"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorScore)"
                            activeDot={{ r: 6, fill: "#eab308", stroke: "#fff", strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default HistoryTrendChart;
