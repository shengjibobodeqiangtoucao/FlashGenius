
import React from 'react';
import { AppView, UserStats } from '../types';

interface NavbarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  stats: UserStats;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, stats }) => {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-6xl h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setView('dashboard')}
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform">
            FG
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            FlashGenius
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <button 
            onClick={() => setView('dashboard')}
            className={`px-3 py-2 rounded-md transition-colors ${currentView === 'dashboard' ? 'text-indigo-600 font-semibold' : 'text-gray-600 hover:text-indigo-500'}`}
          >
            Decks
          </button>
          <button 
            onClick={() => setView('statistics')}
            className={`px-3 py-2 rounded-md transition-colors ${currentView === 'statistics' ? 'text-indigo-600 font-semibold' : 'text-gray-600 hover:text-indigo-500'}`}
          >
            Stats
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
            <span className="text-sm font-medium text-indigo-700">🔥 {stats.streakDays}d</span>
            <div className="w-px h-4 bg-indigo-200"></div>
            <span className="text-sm font-medium text-indigo-700">✨ {stats.totalPoints} pts</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-400 to-purple-400 border-2 border-white shadow-sm"></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
