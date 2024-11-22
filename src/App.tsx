import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search, Dice6 } from 'lucide-react';
import PokemonCard from './components/PokemonCard';
import './App.css';

interface Pokemon {
  id: number | string;
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
  generation?: string;
}

const NOT_FOUND_POKEMON: Pokemon = {
  id: '#???',
  name: "Who's That Pokémon?",
  types: ['unknown'],
  weaknesses: [],
  imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png',
  shinyImageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png',
  description: "Are you sure this is the name or ID of an existing Pokémon?",
  stats: {
    hp: 0,
    attack: 0,
    defense: 0,
    speed: 0
  },
  weight: 0,
  height: 0,
  generation: 'Gen #?'
};

function App() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [direction, setDirection] = useState(1);
  
  const limitToTwoSentences = (text: string): string => {
    const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
  
    let result = sentences.slice(0, 2);
  
    if (result.length > 1 && result[1].trim().length > 50) {
      result = result.slice(0, 1);
    }
  
    const limitedText = result.join('. ').trim() + '.';
    return limitedText;
  };

  const fetchPokemon = async (idOrName: string | number) => {
    setLoading(true);
    try {
      const [pokemonResponse, speciesResponse] = await Promise.all([
        fetch(`https://pokeapi.co/api/v2/pokemon/${idOrName.toString().toLowerCase()}`),
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${idOrName.toString().toLowerCase()}`)
      ]);
      
      if (!pokemonResponse.ok || !speciesResponse.ok) {
        setPokemon([NOT_FOUND_POKEMON]);
        setCurrentIndex(0);
        setLoading(false);
        return;
      }

      const pokemonData = await pokemonResponse.json();
      const speciesData = await speciesResponse.json();

      const weaknesses = await fetchWeaknesses(pokemonData.types.map((t: any) => t.type.url));
      
      const rawDescription = speciesData.flavor_text_entries
        .find((entry: any) => entry.language.name === 'en')
        ?.flavor_text.replace(/POKéMON/g, 'pokémon')
        .replace(/\f/g, ' ') || '';

      const description = limitToTwoSentences(rawDescription);

      const pokemonInfo: Pokemon = {
        id: pokemonData.id,
        name: pokemonData.name,
        types: pokemonData.types.map((type: any) => type.type.name),
        weaknesses,
        imageUrl: pokemonData.sprites.front_default,
        shinyImageUrl: pokemonData.sprites.front_shiny,
        description,
        stats: {
          hp: pokemonData.stats.find((stat: any) => stat.stat.name === 'hp').base_stat,
          attack: pokemonData.stats.find((stat: any) => stat.stat.name === 'attack').base_stat,
          defense: pokemonData.stats.find((stat: any) => stat.stat.name === 'defense').base_stat,
          speed: pokemonData.stats.find((stat: any) => stat.stat.name === 'speed').base_stat,
        },
        weight: pokemonData.weight / 10,
        height: pokemonData.height * 10,
      };

      setPokemon([pokemonInfo]);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Error fetching Pokemon:', error);
      setPokemon([NOT_FOUND_POKEMON]);
      setCurrentIndex(0);
    }
    setLoading(false);
  };

  const fetchWeaknesses = async (typeUrls: string[]) => {
    const weaknesses = new Set<string>();
    const resistances = new Set<string>();
    const immunities = new Set<string>();

    for (const url of typeUrls) {
      const response = await fetch(url);
      const data = await response.json();
      data.damage_relations.double_damage_from.forEach((type: any) => {
        weaknesses.add(type.name);
      });
      data.damage_relations.half_damage_from.forEach((type: any) => {
        resistances.add(type.name);
      });
      data.damage_relations.no_damage_from.forEach((type: any) => {
        immunities.add(type.name);
      });
    }

    return Array.from(weaknesses).filter(
      (weakness) => !resistances.has(weakness) && !immunities.has(weakness)
    );
  };

  useEffect(() => {
    fetchPokemon(1);
  }, []);

  const handlePrevPokemon = () => {
    if (pokemon[currentIndex].id !== '???' && typeof pokemon[currentIndex].id === 'number' && pokemon[currentIndex].id > 1) {
      setDirection(-1);
      fetchPokemon(pokemon[currentIndex].id - 1);
    }
  };

  const handleNextPokemon = () => {
    if (pokemon[currentIndex].id !== '???') {
      setDirection(1);
      fetchPokemon(Number(pokemon[currentIndex].id) + 1);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setDirection(1);
      fetchPokemon(searchTerm.trim());
      setSearchTerm('');
      setIsSearchFocused(false);
    }
  };

  const handleRandomPokemon = () => {
    const randomId = Math.floor(Math.random() * 384) + 1;
    setDirection(Math.random() > 0.5 ? 1 : -1);
    fetchPokemon(randomId);
    setSearchTerm('');
  };

  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragStartX(clientX);
  };

  const handleDragEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (dragStartX === null) return;
    
    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const diff = clientX - dragStartX;
    const threshold = 100;

    if (diff > threshold) {
      handlePrevPokemon();
    } else if (diff < -threshold) {
      handleNextPokemon();
    }

    setDragStartX(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-2 px-4 flex flex-col">
      <div className="container mx-auto max-w-4xl flex-grow">
        <div className="flex flex-col items-center mb-3">
        <form onSubmit={handleSearch} className="w-full max-w-md">
          <div className="flex gap-2">
            <div className={`flex-1 flex gap-2 transition-all duration-300 ease-in-out ${isSearchFocused ? 'flex-grow' : ''}`}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(false)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Enter Pokémon name or ID"
                className="
                  w-full
                  px-4 
                  py-2
                  bg-gradient-to-r from-gray-200 to-gray-100 
                  text-black 
                  text-sm
                  border-2 border-gray-600 
                  rounded-lg
                  transition-all 
                  duration-300 
                  transform 
                  shadow-lg 
                  focus:ring-2
                  focus:ring-red-500
                  focus:border-red-500
                  outline-none
                "
              />
              <button
                type="submit"
                className="
                  px-3 
                  py-1.5
                  bg-gradient-to-r from-red-500 to-red-500
                  text-white 
                  text-sm
                  rounded-lg
                  transition-all 
                  duration-300 
                  transform 
                  shadow-lg 
                  hover:shadow-xl 
                  active:scale-95
                  flex
                  items-center
                  justify-center
                  whitespace-nowrap
                "
              >
                <Search size={16} className="mr-2" />
                Search
              </button>
            </div>
            <div
              className={`
                transition-all
                duration-300
                ease-in-out
                transform
                ${isSearchFocused ? 'scale-0 opacity-0 w-0' : 'scale-100 opacity-100 w-auto'}
              `}
            >
              <button
                type="button"
                onClick={handleRandomPokemon}
                className="
                  h-full
                  px-3 
                  py-1.5 
                  bg-gradient-to-r from-purple-500 to-purple-500 
                  text-white 
                  text-sm
                  rounded-lg
                  transition-all 
                  duration-400 
                  transform 
                  shadow-lg 
                  hover:shadow-xl 
                  active:scale-90
                  active:rotate-12
                  flex
                  items-center
                  justify-center
                  whitespace-nowrap
                "
                title="Random Pokémon"
              >
                <Dice6 size={20} />
              </button>
            </div>
          </div>
        </form>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-text">Loading Pokémon...</div>
          </div>
        ) : (
          <div 
            className="flex justify-center mb-4"
            onTouchStart={handleDragStart}
            onTouchEnd={handleDragEnd}
            onMouseDown={handleDragStart}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
          >
            <PokemonCard
              key={pokemon[currentIndex].id}
              pokemon={pokemon[currentIndex]}
              direction={direction}
            />
          </div>
        )}
      </div>
      <div className="mt-2 md:mt-4">
        <div className="hidden md:flex justify-center gap-5 max-w-4xl mx-auto px-4">
          <button
            onClick={handlePrevPokemon}
            disabled={pokemon[currentIndex]?.id === '???' || pokemon[currentIndex]?.id === 1}
            className="
              w-full 
              md:w-1/4 
              bg-gradient-to-r from-gray-400 to-gray-600 
              text-white 
              py-2
              text-lg 
              font-bold 
              rounded-lg 
              shadow-lg 
              hover:bg-gradient-to-r hover:from-gray-500 hover:to-gray-700 
              hover:scale-105
              transition-transform 
              transform 
              hover:shadow-xl 
              duration-300 
              disabled:bg-gray-300 
              disabled:cursor-not-allowed 
              disabled:opacity-70
            "
          >
            <ChevronLeft className="inline-block mr-2" /> Previous
          </button>
          <button
            onClick={handleNextPokemon}
            disabled={pokemon[currentIndex]?.id === '???'}
            className="
              w-full
              md:w-1/4 
              bg-gradient-to-r from-red-500 to-red-700 
              text-white 
              py-2
              text-lg 
              font-bold 
              rounded-lg 
              shadow-lg 
              hover:bg-gradient-to-r hover:from-red-600 hover:to-red-800 
              hover:scale-105
              transition-transform 
              transform 
              hover:shadow-xl 
              duration-300
              disabled:bg-gray-300 
              disabled:cursor-not-allowed 
              disabled:opacity-70
            "
          >
            Next <ChevronRight className="inline-block ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;