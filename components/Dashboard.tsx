
import React, { useState } from 'react';
import { Deck, AppView } from '../types';

interface DashboardProps {
  decks: Deck[];
  onSelectDeck: (id: string, view: AppView) => void;
  onEditDeck: (id: string) => void;
  onDeleteDeck: (id: string) => void;
  onNewDeck: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ decks, onSelectDeck, onEditDeck, onDeleteDeck, onNewDeck }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDecks = decks.filter(deck => 
    deck.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deck.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Library</h1>
          <p className="text-gray-500">Select a deck to start learning or create a new one.</p>
        </div>
        <button 
          onClick={onNewDeck}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2 w-fit"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Create New Deck
        </button>
      </div>

      <div className="relative">
        <input 
          type="text"
          placeholder="Search your decks by title or subject..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDecks.map(deck => (
          <div key={deck.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full uppercase tracking-wider">
                  {deck.category}
                </span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onEditDeck(deck.id)} className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                  </button>
                  <button onClick={() => onDeleteDeck(deck.id)} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{deck.title}</h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">{deck.description}</p>
              <div className="flex items-center gap-1 text-xs text-gray-400 mb-6">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                <span>{deck.cards.length} cards</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => onSelectDeck(deck.id, 'study-flip')}
                className="bg-gray-50 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                Flip
              </button>
              <button 
                onClick={() => onSelectDeck(deck.id, 'study-quiz')}
                className="bg-gray-50 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                Quiz
              </button>
              <button 
                onClick={() => onSelectDeck(deck.id, 'study-match')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all col-span-2 flex items-center justify-center gap-2"
              >
                Game Mode
              </button>
            </div>
          </div>
        ))}
        {filteredDecks.length === 0 && (
          <div className="col-span-full py-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500 mb-4">No decks found. Ready to start your journey?</p>
            <button onClick={onNewDeck} className="text-indigo-600 font-bold hover:underline">Create your first flashcard set</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
