import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PokemonCardProps {
  pokemon: {
    id: number;
    name: string;
    types: string[];
    weaknesses: string[];
    imageUrl: string;
    shinyImageUrl: string;
    description: string;
    stats: {
      hp: number;
      attack: number;
      defense: number;
      speed: number;
    };
    weight: number;
    height: number;
  };
  direction: number;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, direction }) => {
  const { id, name, types, weaknesses, imageUrl, shinyImageUrl, stats, weight, height, description } = pokemon;
  const [isShiny, setIsShiny] = useState(false);

  const getGeneration = (id: number): { gen: string; colors: string[] } => {
    if (id <= 151) return { 
      gen: "Gen #1",
      colors: ['#F2F2F2', '#E8E8E8', '#D8D8D8', '#CCCCCC', '#E0E0E0'] // Silver
    };
    if (id <= 251) return {
      gen: "Gen #2",
      colors: ['#D69B60', '#E0A877', '#EAB48E'] // Bronze
    };
    if (id <= 386) return {
      gen: "Gen #3",
      colors: ['#FFE680', '#FFD94D', '#FFCC1A'] // Gold
    };
    if (id <= 493) return {
      gen: "Gen #4",
      colors: ['#F5F5F5', '#EDEDED', '#E6E6E6'] // Platinum
    };
    if (id <= 649) return {
      gen: "Gen #5",
      colors: ['#D5FAFF', '#C4F5FF', '#B3F0FF'] // Diamond
    };
    if (id <= 721) return {
      gen: "Gen #6",
      colors: ['#70E090', '#65D682', '#5ACC74'] // Emerald
    };
    if (id <= 809) return {
      gen: "Gen #7",
      colors: ['#F3D3A4', '#ECCB92', '#E5C380'] // Pearl
    };
    if (id <= 905) return {
      gen: "Gen #8",
      colors: ['#C58A94', '#B87884', '#AB6774'] // Ruby
    };
    if (id <= 1100) return {
      gen: "Gen #9",
      colors: ['#A5D500', '#96C400', '#87B400']  // Ruby
    };
    return {
      gen: "Gen #?",
      colors: ['#F2F2F2', '#E8E8E8', '#D8D8D8', '#CCCCCC', '#E0E0E0']  // Default Silver
    };
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC',
    };
    return colors[type] || '#A8A878';
  };

  const getDarkenedColor = (color: string, factor: number) => {
    const hex = color.replace('#', '');
    const r = Math.max(0, Math.min(255, parseInt(hex.slice(0, 2), 16) * (1 - factor)));
    const g = Math.max(0, Math.min(255, parseInt(hex.slice(2, 4), 16) * (1 - factor)));
    const b = Math.max(0, Math.min(255, parseInt(hex.slice(4, 6), 16) * (1 - factor)));
    return `rgb(${r}, ${g}, ${b})`;
  };

  const getGradientStyle = () => {
    const baseGradient = types.length > 1
      ? `linear-gradient(135deg, ${getTypeColor(types[0])}90, ${getTypeColor(types[1])}80)`
      : `linear-gradient(135deg, ${getTypeColor(types[0])}80, ${getDarkenedColor(getTypeColor(types[0]), 0.4)})`;

      return {
        background: baseGradient,
        backgroundSize: '200% 200%',
        animation: `gradientShift ${isShiny ? '1.5s' : '5s'} ease infinite`,
        border: isShiny
          ? '7px solid transparent' // Base para gradiente metálico
          : '7px solid rgba(255, 255, 255, 0.4)', // Reflexo suave na versão normal
      };
  };

  const getStatColor = (value: number) => {
    if (value < 46) return 'bg-red-500 animate-pulse-red';
    if (value < 80) return 'bg-yellow-500 animate-pulse-yellow';
    return 'bg-green-500 animate-pulse-green';
  };

  const renderStatBar = (statName: string, value: number) => (
    <div key={statName} className="mb-2">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium stat-label">{statName}</span>
        <span className="text-sm font-medium stat-value">{value}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full stat-bar ${getStatColor(value)}`}
          style={{ width: `${(value / 255) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  const shinyNameStyle = isShiny ? {
    background: 'linear-gradient(to right, #ffd700, #ff69b4, #4169e1, #ffd700)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundSize: '200% auto',
    animation: 'shine 3s linear infinite',
  } : {};

  const generation = getGeneration(id);

  const cardVariants = {
    enter: {
      x: direction * 300,
      opacity: 0
    },
    center: {
      x: 0,
      opacity: 1
    },
    exit: {
      x: direction * -300,
      opacity: 0
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pokemon.id}
        variants={cardVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          x: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 }
        }}
        className="relative bg-white/10 backdrop-blur-lg rounded-lg shadow-lg overflow-hidden w-full max-w-md small-screen-card border-reflect"
        style={getGradientStyle()}
      >
        <div className={`absolute inset-0 rounded-lg ${isShiny ? 'bg-gradient-to-br from-white/30 to-transparent' : ''}`} 
             style={{ mixBlendMode: 'overlay' }}>
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/5"></div>
        </div>
        <div className="relative p-4 -mb-5">
          <div className="flex justify-between items-start mb-4">
            <motion.div
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-black shadow-md"
              style={{
                background: `linear-gradient(135deg, ${generation.colors[0]}, ${generation.colors[1]}, ${generation.colors[2]})`,
                textShadow: '0px 1px 1px rgba(255, 255, 255, 0.5)'
              }}
            >
              {generation.gen}
            </motion.div>
            {isShiny && (
              <motion.div
                initial={{ opacity: 3, scale: 0 }}
                animate={{ opacity: 0, scale: 3 }}
                exit={{ opacity: 1, scale: 1 }}
                className="text-xl"
              >
                ✨
              </motion.div>
            )}
            <p className="text-gray-600 text-center pokemon-id">#{id.toString().padStart(3, '0')}</p>
          </div>
          <motion.img
            src={isShiny ? shinyImageUrl : imageUrl}
            alt={name}
            className="w-56 h-56 mx-auto cursor-pointer pokemon-image"
            onClick={() => setIsShiny(!isShiny)}
            animate={{ scale: 1.3, rotate: 6, y: -13 }}
            whileHover={{ scale: 1.35, rotate: 10 }}
            whileTap={{ scale: 0.3 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
          />
          <motion.h2 
            className="text-3xl font-semibold text-center mt-2 capitalize pokemon-name"
            style={shinyNameStyle}
          >
            {isShiny ? `Shiny ${name}` : name}
          </motion.h2>
          <div className="mt-2 text-center">
            <p className="text-gray-700 italic px-4 text-sm leading-relaxed">"{description}"</p>
          </div>
          <div className="mt-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold mb-1 section-title">Types:</h3>
                <div className="flex flex-wrap gap-2">
                  {types.map((type) => (
                    <motion.span
                      key={type}
                      className="px-2 py-1.5 rounded-full text-xs font-semibold text-white type-badge"
                      style={{ backgroundColor: getTypeColor(type) }}
                      whileHover={{ scale: 1.2 }}
                    >
                      {type}
                    </motion.span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <h3 className="font-semibold mb-1 section-title">Height:</h3>
                <motion.span
                  className="px-3 py-1.5 rounded-full text-xs font-semibold text-white inline-block type-badge"
                  style={{ backgroundColor: '#4A5568' }}
                  whileHover={{ scale: 1.2 }}
                >
                  {height} cm
                </motion.span>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold mb-1 section-title">Weaknesses:</h3>
                <div className="flex flex-wrap gap-2">
                  {weaknesses.map((weakness) => (
                    <motion.span
                      key={weakness}
                      className="px-2.5 py-1.5 rounded-full text-xs font-semibold text-white weakness-badge"
                      style={{ backgroundColor: getTypeColor(weakness) }}
                      whileHover={{ scale: 1.2 }}
                    >
                      {weakness}
                    </motion.span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <h3 className="font-semibold mb-1 section-title">Weight:</h3>
                <motion.span
                  className="px-3 py-1.5 rounded-full text-xs font-semibold text-white inline-block type-badge"
                  style={{ backgroundColor: '#4A5568' }}
                  whileHover={{ scale: 1.1 }}
                >
                  {weight} kg
                </motion.span>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex flex-col items-center my-8">
              <div className="relative w-full max-w-md">
              </div>
              <motion.div 
                className="w-full max-w-md rounded-lg shadow-lg p-4 stats-container"
                style={{
                    boxShadow: isShiny 
                    ? '0 0 20px rgba(255, 255, 255, 0.5), 0 0 30px rgba(200, 200, 200, 0.3)' 
                    : '0 2px 6px rgba(0, 0, 0, 0.1)',
                
                  background: isShiny 
                    ? `linear-gradient(145deg, rgba(255, 255, 255, 0.5), rgba(245, 245, 245, 0.3)), 
                      rgba(255, 255, 255, 0.2)` 
                    : `rgba(255, 255, 255, 0.5)`,
                
                  backdropFilter: 'blur(20px)',
                
                  WebkitBackdropFilter: 'blur(20px)',
                
                  transition: 'all 0.8s ease-in-out',
                
                  borderRadius: '12px',
                }}            
              >
                <h3 className="font-semibold text-2xl text-black-600 relative z-10 text-center mx-4"></h3>
                {renderStatBar('HP', stats.hp)}
                {renderStatBar('Attack', stats.attack)}
                {renderStatBar('Defense', stats.defense)}
                {renderStatBar('Speed', stats.speed)}            
              </motion.div>
            </div>          
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PokemonCard;