import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className = "", delay = 0 }) => {
  const words = text.split(' ');

  return (
    <div className={`overflow-hidden ${className}`}>
      {words.map((word, wordIndex) => (
        <motion.span
          key={wordIndex}
          className="inline-block mr-2"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: delay + wordIndex * 0.1,
            ease: [0.6, 0.01, -0.05, 0.95]
          }}
        >
          {word.split('').map((char, charIndex) => (
            <motion.span
              key={charIndex}
              className="inline-block"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: delay + wordIndex * 0.1 + charIndex * 0.02,
              }}
              whileHover={{ 
                scale: 1.2, 
                color: '#60a5fa',
                transition: { duration: 0.2 }
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.span>
      ))}
    </div>
  );
};

export default AnimatedText;
