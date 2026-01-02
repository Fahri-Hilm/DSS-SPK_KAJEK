import React from 'react';
import { motion } from 'framer-motion';

const LiquidLoader: React.FC = () => {
  return (
    <div className="w-6 h-6">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>
        <motion.path
          d="M20,50 Q30,30 50,40 Q70,30 80,50 Q70,70 50,60 Q30,70 20,50"
          fill="url(#liquidGradient)"
          animate={{
            d: [
              "M20,50 Q30,30 50,40 Q70,30 80,50 Q70,70 50,60 Q30,70 20,50",
              "M20,50 Q30,70 50,60 Q70,70 80,50 Q70,30 50,40 Q30,30 20,50",
              "M20,50 Q30,30 50,40 Q70,30 80,50 Q70,70 50,60 Q30,70 20,50"
            ]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </svg>
    </div>
  );
};

export default LiquidLoader;
