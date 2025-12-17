import React, { useState } from 'react';
import { Sparkles, Search, X, Loader2 } from 'lucide-react';
import { findBestRooms } from '../services/geminiService';
import { Room } from '../types';

interface SmartSearchProps {
  rooms: Room[];
  onResults: (roomIds: string[], reason: string | null) => void;
}

export const SmartSearch: React.FC<SmartSearchProps> = ({ rooms, onResults }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const result = await findBestRooms(query, rooms);
      onResults(result.recommendedRoomIds, result.reasoning);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    onResults([], null);
    setIsActive(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className={`relative bg-white rounded-2xl shadow-sm border transition-all duration-300 ${isActive ? 'ring-2 ring-indigo-500 border-transparent' : 'border-slate-200'}`}>
        <form onSubmit={handleSearch} className="flex items-center p-2">
          <div className="pl-3 pr-2 text-indigo-500">
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
          </div>
          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 h-10 px-2"
            placeholder="Describe what you need... (e.g., 'Quiet room for 4 people with a whiteboard')"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!isActive) setIsActive(true);
            }}
          />
          {query && (
            <button 
              type="button" 
              onClick={clearSearch}
              className="p-2 text-slate-400 hover:text-slate-600"
            >
              <X size={18} />
            </button>
          )}
          <button 
            type="submit"
            disabled={isLoading || !query.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Search size={16} />
            Find
          </button>
        </form>
      </div>
      
      {/* Search Hints */}
      {!isActive && (
        <div className="mt-3 flex gap-2 justify-center flex-wrap">
          {['Projector needed', 'Quiet study space', 'Large event hall', 'Computer lab'].map((hint) => (
            <button
              key={hint}
              onClick={() => {
                setQuery(hint);
                setIsActive(true);
              }}
              className="text-xs bg-white border border-slate-200 text-slate-500 px-3 py-1 rounded-full hover:bg-slate-50 hover:border-indigo-200 transition-colors"
            >
              {hint}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
