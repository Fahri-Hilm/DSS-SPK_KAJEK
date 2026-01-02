import React from 'react';
import { motion } from 'framer-motion';

interface MorphingChartProps {
  data: any[];
  chartType: 'bar' | '3d' | 'radar';
  onTypeChange: (type: 'bar' | '3d' | 'radar') => void;
}

const MorphingChart: React.FC<MorphingChartProps> = ({ data, chartType, onTypeChange }) => {
  const chartTypes = [
    { type: 'bar' as const, label: '2D Bar', icon: '📊' },
    { type: '3d' as const, label: '3D View', icon: '🎲' },
    { type: 'radar' as const, label: 'Radar', icon: '🎯' },
  ];

  return (
    <div className="space-y-4">
      {/* Chart Type Selector */}
      <div className="flex justify-center">
        <div className="bg-dark-800 p-1 rounded-xl border border-dark-700 flex">
          {chartTypes.map(({ type, label, icon }) => (
            <motion.button
              key={type}
              onClick={() => onTypeChange(type)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                chartType === type
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-dark-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{icon}</span>
              <span className="text-sm">{label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Chart Container with Morphing Animation */}
      <div className="relative h-96 bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden">
        <motion.div
          key={chartType}
          initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
          transition={{ 
            duration: 0.6, 
            ease: "easeInOut",
            type: "spring",
            stiffness: 100
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {/* Placeholder for actual charts */}
          <div className="text-center">
            <motion.div
              className="text-6xl mb-4"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {chartTypes.find(c => c.type === chartType)?.icon}
            </motion.div>
            <h3 className="text-xl font-bold text-white mb-2">
              {chartTypes.find(c => c.type === chartType)?.label} Chart
            </h3>
            <p className="text-slate-400">
              Morphing animation untuk {data.length} data points
            </p>
          </div>
        </motion.div>

        {/* Morphing Background Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(59,130,246,0.1) 0%, rgba(147,51,234,0.1) 100%)",
              "linear-gradient(135deg, rgba(147,51,234,0.1) 0%, rgba(59,130,246,0.1) 100%)",
              "linear-gradient(45deg, rgba(59,130,246,0.1) 0%, rgba(147,51,234,0.1) 100%)"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};

export default MorphingChart;
