import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PokemonDetailProps {
  pokemon: {
    id: number;
    name: string;
    types: string[];
    weaknesses: string[];
    imageUrl: string;
    shinyImageUrl: string;
    moves: string[];
  };
  onBack: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const PokemonDetail: React.FC<PokemonDetailProps> = ({ pokemon, onBack, onNext, onPrev }) => {
  const { id, name, types, weaknesses, imageUrl, shinyImageUrl, moves } = pokemon;

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

  const gradientStyle = {
    background: types.length > 1
      ? `linear-gradient(135deg, ${getTypeColor(types[0])}80 0%, ${getTypeColor(types[0])}80 50%, ${getTypeColor(types[1])}80 50%, ${getTypeColor(types[1])}80 100%)`
      : `${getTypeColor(types[0])}80`,
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden" style={gradientStyle}>
      <div className="p-4">
        <button onClick={onBack} className="mb-4 text-blue-500 hover:underline">
          &larr; Back to list
        </button>
        <div className="flex justify-between items-center mb-4">
          <button onClick={onPrev} className="text-2xl">&larr;</button>
          <h2 className="text-2xl font-semibold text-center capitalize">{name}</h2>
          <button onClick={onNext} className="text-2xl">&rarr;</button>
        </div>
        <p className="text-gray-600 text-center mb-4">#{id.toString().padStart(3, '0')}</p>
        <div className="flex justify-center space-x-4 mb-4">
          <img src={imageUrl} alt={name} className="w-48 h-48" />
          <img src={shinyImageUrl} alt={`Shiny ${name}`} className="w-48 h-48" />
        </div>
        <div className="mb-4">
          <h3 className="font-semibold mb-1">Types:</h3>
          <div className="flex flex-wrap gap-2">
            {types.map((type) => (
              <span
                key={type}
                className="px-2 py-1 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: getTypeColor(type) }}
              >
                {type}
              </span>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold mb-1">Weaknesses:</h3>
          <div className="flex flex-wrap gap-2">
            {weaknesses.map((weakness) => (
              <span
                key={weakness}
                className="px-2 py-1 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: getTypeColor(weakness) }}
              >
                {weakness}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-1">Moves:</h3>
          <ul className="list-disc list-inside">
            {moves.map((move) => (
              <li key={move} className="capitalize">{move}</li>
            ))}
          </ul>
        </div>
      </div>
      <button
        onClick={onNext}
        className="w-full bg-red-500 text-white py-4 text-xl font-bold hover:bg-red-600 transition-colors"
      >
        Next <ChevronRight className="inline-block ml-2" />
      </button>
    </div>
  );
};

export default PokemonDetail;