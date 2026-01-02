import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimatedText from './AnimatedText';

const InteractiveHero: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Dynamic background gradient */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(59,130,246,0.15) 0%, rgba(147,51,234,0.1) 30%, transparent 70%)`
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />

      {/* Floating orbs */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl"
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -100, 50, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + i * 10}%`,
          }}
        />
      ))}

      {/* Main content */}
      <motion.div
        className="text-center z-10 max-w-4xl mx-auto px-6"
        animate={{
          x: (mousePosition.x - 50) * 0.02,
          y: (mousePosition.y - 50) * 0.02,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          <AnimatedText
            text="SPK KAJEK"
            className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4"
          />
          
          <AnimatedText
            text="Decision Support System"
            className="text-xl md:text-2xl text-slate-300 mb-8"
            delay={0.5}
          />

          <motion.div
            className="text-slate-400 text-lg mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <AnimatedText
              text="Sistem Pendukung Keputusan untuk memilih VPS terbaik menggunakan metode TOPSIS"
              delay={1.2}
            />
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(59,130,246,0.3)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              Mulai Analisa
            </motion.button>
            
            <motion.button
              className="px-8 py-4 border border-slate-600 text-slate-300 rounded-xl font-bold hover:bg-slate-800 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Lihat Demo
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Interactive elements */}
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-2xl"
          animate={{
            scale: isHovered ? 1.5 : 1,
            opacity: isHovered ? 0.8 : 0.4,
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-slate-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 2, duration: 1, repeat: Infinity, repeatDelay: 0.5 }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm">Scroll untuk melanjutkan</span>
          <div className="w-6 h-10 border-2 border-slate-600 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-slate-400 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InteractiveHero;
