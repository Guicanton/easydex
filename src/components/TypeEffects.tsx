import React from 'react';
import { motion } from 'framer-motion';

interface TypeEffectsProps {
  type: string;
}

const TypeEffects: React.FC<TypeEffectsProps> = ({ type }) => {
  const getParticles = () => {
    switch (type.toLowerCase()) {
      case 'fire':
        return Array.from({ length: 12 }, (_, i) => (
          <motion.div
            key={`flame-${i}`}
            className="absolute w-2 h-2 rounded-full bg-orange-500/40"
            initial={{
              x: `${Math.random() * 100}%`,
              y: '100%',
              scale: 0.5,
              opacity: 0.4
            }}
            animate={{
              x: `${Math.random() * 100}%`,
              y: '-20%',
              scale: [0.5, 1.5, 0],
              opacity: [0.4, 0.8, 0]
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeOut",
              delay: Math.random() * 2
            }}
          />
        ));

      case 'water':
        return Array.from({ length: 15 }, (_, i) => (
          <motion.div
            key={`bubble-${i}`}
            className="absolute w-1.5 h-1.5 rounded-full bg-blue-400/30"
            initial={{
              x: `${Math.random() * 100}%`,
              y: '100%',
              scale: 0.3,
              opacity: 0.3
            }}
            animate={{
              x: `${Math.random() * 100}%`,
              y: '-10%',
              scale: [0.3, 0.6, 0.3],
              opacity: [0.3, 0.6, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3
            }}
          />
        ));

      case 'electric':
        return Array.from({ length: 8 }, (_, i) => (
          <motion.div
            key={`spark-${i}`}
            className="absolute h-px bg-yellow-300/60"
            style={{
              width: `${10 + Math.random() * 20}px`,
              rotate: `${Math.random() * 360}deg`
            }}
            initial={{
              x: '50%',
              y: '50%',
              scale: 0,
              opacity: 0
            }}
            animate={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              scale: [0, 1, 0],
              opacity: [0, 0.8, 0]
            }}
            transition={{
              duration: 0.5 + Math.random() * 0.5,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 2
            }}
          />
        ));

      case 'grass':
        return Array.from({ length: 10 }, (_, i) => (
          <motion.div
            key={`leaf-${i}`}
            className="absolute w-2 h-2 rotate-45 bg-green-500/30"
            initial={{
              x: `${Math.random() * 100}%`,
              y: '100%',
              rotate: 0,
              scale: 0.3,
              opacity: 0.3
            }}
            animate={{
              x: `${Math.random() * 100}%`,
              y: '-10%',
              rotate: 360,
              scale: [0.3, 0.6, 0.3],
              opacity: [0.3, 0.6, 0]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 4
            }}
          />
        ));

      case 'psychic':
        return Array.from({ length: 6 }, (_, i) => (
          <motion.div
            key={`ring-${i}`}
            className="absolute border border-pink-500/30 rounded-full"
            style={{
              width: '40px',
              height: '40px'
            }}
            initial={{
              x: '50%',
              y: '50%',
              scale: 0,
              opacity: 0
            }}
            animate={{
              scale: [0, 2, 3],
              opacity: [0.6, 0.3, 0]
            }}
            transition={{
              duration: 2 + Math.random(),
              repeat: Infinity,
              ease: "easeOut",
              delay: Math.random() * 2
            }}
          />
        ));

      case 'ghost':
        return Array.from({ length: 8 }, (_, i) => (
          <motion.div
            key={`wisp-${i}`}
            className="absolute w-2 h-2 bg-purple-500/20 rounded-full"
            initial={{
              x: '50%',
              y: '50%',
              scale: 0,
              opacity: 0
            }}
            animate={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              scale: [0, 1.5, 0],
              opacity: [0, 0.4, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3
            }}
          />
        ));

      case 'ice':
        return Array.from({ length: 10 }, (_, i) => (
          <motion.div
            key={`crystal-${i}`}
            className="absolute w-1 h-1 bg-blue-100/40"
            style={{ rotate: `${Math.random() * 360}deg` }}
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              scale: 0,
              opacity: 0
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
          />
        ));

      default:
        return null;
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {getParticles()}
    </div>
  );
};

export default TypeEffects;