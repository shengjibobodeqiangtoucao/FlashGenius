
import React, { useState } from 'react';
import { Deck, Card } from '../types';
import { generateCardsFromTopic } from '../geminiService';

interface DeckEditorProps {
  deck?: Deck;
  onSave: (deck: Deck) => void;
  onCancel: () => void;
}

const DeckEditor: React.FC<DeckEditorProps> = ({ deck, onSave, onCancel }) => {
  const [title, setTitle] = useState(deck?.title || '');
  const [description, setDescription] = useState(deck?.description || '');
  const [category, setCategory] = useState(deck?.category || 'General');
  const [cards, setCards] = useState<Card[]>(deck?.cards || []);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiTopic, setAiTopic] = useState('');

  const addCard = () => {
    setCards([...cards, { id: Math.random().toString(36).substr(2, 9), term: '', definition: '' }]);
  };

  const updateCard = (id: string, field: 'term' | 'definition', value: string) => {
    setCards(cards.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const deleteCard = (id: string) => {
    setCards(cards.filter(c => c.id !== id));
  };

  const handleAiGenerate = async () => {
    if (!aiTopic.trim()) return;
    setAiLoading(true);
    try {
      const newCards = await generateCardsFromTopic(aiTopic);
      setCards([...cards, ...newCards]);
      setAiTopic('');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSave = () => {
    if (!title.trim()) return alert('Please enter a title');
    onSave({
      id: deck?.id || Math.random().toString(36).substr(2, 9),
      title,
      description,
      category,
      cards: cards.filter(c => c.term && c.definition),
      createdAt: deck?.createdAt || Date.now()
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{deck ? 'Edit Deck' : 'Create New Deck'}</h2>
        <div className="flex gap-3">
          <button onClick={onCancel} className="px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
          <button onClick={handleSave} className="bg-indigo-600 text-white px-8 py-2 rounded-lg font-bold shadow-md hover:bg-indigo-700 transition-colors">Save Deck</button>
        </div>
      </div>

      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Title</label>
            <input 
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              placeholder="e.g., European Capitals"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Category / Subject</label>
            <input 
              type="text"
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              placeholder="e.g., Geography"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">Description</label>
          <textarea 
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none h-20"
            placeholder="What is this deck about?"
          />
        </div>
      </section>

      {/* AI Assistance Section */}
      <section className="bg-indigo-600 p-6 rounded-2xl shadow-lg text-white">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-6 h-6 text-indigo-200" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 10-2 0v1a1 1 0 102 0zM13.414 14.828a1 1 0 01-1.414 0L11.3 14.12a1 1 0 011.414-1.414l.707.707a1 1 0 010 1.414zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1z"></path></svg>
          <h3 className="text-lg font-bold">Magic AI Generator</h3>
        </div>
        <div className="flex gap-2">
          <input 
            type="text"
            value={aiTopic}
            onChange={e => setAiTopic(e.target.value)}
            className="flex-grow px-4 py-2 bg-indigo-500/50 border border-indigo-400 rounded-xl focus:bg-indigo-500 transition-all outline-none placeholder-indigo-200"
            placeholder="Enter a topic (e.g. 'French verbs', 'Mitosis') and let AI build cards..."
          />
          <button 
            onClick={handleAiGenerate}
            disabled={aiLoading}
            className="bg-white text-indigo-600 px-6 py-2 rounded-xl font-bold hover:bg-indigo-50 transition-colors disabled:opacity-50"
          >
            {aiLoading ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </section>

      <div className="space-y-4">
        {cards.map((card, index) => (
          <div key={card.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 group animate-in slide-in-from-left-4" style={{ animationDelay: `${index * 50}ms` }}>
            <div className="flex-shrink-0 w-10 flex flex-col items-center justify-center text-gray-300 font-bold text-lg border-r border-gray-100">
              {index + 1}
            </div>
            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text"
                value={card.term}
                onChange={e => updateCard(card.id, 'term', e.target.value)}
                className="w-full border-b border-gray-100 focus:border-indigo-500 py-2 outline-none transition-all font-medium"
                placeholder="Term"
              />
              <input 
                type="text"
                value={card.definition}
                onChange={e => updateCard(card.id, 'definition', e.target.value)}
                className="w-full border-b border-gray-100 focus:border-indigo-500 py-2 outline-none transition-all"
                placeholder="Definition"
              />
            </div>
            <button 
              onClick={() => deleteCard(card.id)}
              className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
          </div>
        ))}
        <button 
          onClick={addCard}
          className="w-full py-6 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold hover:bg-white hover:border-indigo-300 hover:text-indigo-500 transition-all"
        >
          + Add another card
        </button>
      </div>
    </div>
  );
};

export default DeckEditor;
