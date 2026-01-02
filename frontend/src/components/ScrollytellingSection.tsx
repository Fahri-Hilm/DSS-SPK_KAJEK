import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { TrendingUp, Award, BarChart3, Target } from 'lucide-react';

interface ScrollytellingProps {
  data: any[];
  results: any;
}

const ScrollytellingSection: React.FC<ScrollytellingProps> = ({ data, results }) => {
  const { scrollYProgress } = useScroll();
  const [currentStep, setCurrentStep] = useState(0);

  const opacity1 = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const opacity2 = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);
  const opacity3 = useTransform(scrollYProgress, [0.4, 0.6], [0, 1]);
  const opacity4 = useTransform(scrollYProgress, [0.6, 0.8], [0, 1]);

  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1.2]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const steps = [
    {
      title: "Data Collection",
      description: "Mengumpulkan data dari berbagai vendor VPS",
      icon: BarChart3,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Kriteria Analysis", 
      description: "Menentukan bobot untuk CPU, RAM, Disk I/O, dan Harga",
      icon: Target,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "TOPSIS Calculation",
      description: "Menghitung score menggunakan metode TOPSIS",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Best Recommendation",
      description: results ? `${results.top_recommendation?.Vendor} adalah pilihan terbaik` : "Menentukan rekomendasi terbaik",
      icon: Award,
      color: "from-yellow-500 to-orange-500"
    }
  ];

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((latest) => {
      const step = Math.floor(latest * 4);
      setCurrentStep(Math.min(step, 3));
    });
    return unsubscribe;
  }, [scrollYProgress]);

  return (
    <div className="relative h-[400vh] bg-gradient-to-b from-dark-900 to-dark-800">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20" />
        
        {/* Background particles */}
        <motion.div
          className="absolute inset-0"
          style={{ scale, opacity: opacity1 }}
        >
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </motion.div>

        {/* Main content */}
        <motion.div 
          className="text-center z-10 max-w-4xl mx-auto px-6"
          style={{ y }}
        >
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Step indicator */}
            <div className="flex justify-center space-x-4 mb-8">
              {steps.map((_, i) => (
                <motion.div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i <= currentStep ? 'bg-blue-500' : 'bg-gray-600'
                  }`}
                  animate={{ scale: i === currentStep ? 1.5 : 1 }}
                />
              ))}
            </div>

            {/* Current step content */}
            <motion.div
              className={`p-8 rounded-3xl bg-gradient-to-br ${steps[currentStep].color} bg-opacity-20 backdrop-blur-sm border border-white/10`}
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                {React.createElement(steps[currentStep].icon, { size: 40, className: "text-white" })}
              </motion.div>
              
              <motion.h2 
                className="text-4xl font-bold text-white mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {steps[currentStep].title}
              </motion.h2>
              
              <motion.p 
                className="text-xl text-gray-200 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {steps[currentStep].description}
              </motion.p>

              {/* Progress indicator */}
              <motion.div 
                className="mt-6 text-sm text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Step {currentStep + 1} of {steps.length}
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-white/50 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ScrollytellingSection;
