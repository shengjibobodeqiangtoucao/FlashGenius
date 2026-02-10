
import React, { useState, useEffect, useMemo } from 'react';
import { Deck, Card } from '../types';

interface MatchStudyProps {
  deck: Deck;
  onFinish: () => void;
}

interface MatchItem {
  id: string;
  content: string;
  type: 'term' | 'definition';
  originalCardId: string;
  isMatched: boolean;
}

const MatchStudy: React.FC<MatchStudyProps> = ({ deck, onFinish }) => {
  const [items, setItems] = useState<MatchItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [startTime] = useState(Date.now());
  const [time, setTime] = useState(0);

  useEffect(() => {
    const initialItems: MatchItem[] = [];
    deck.cards.slice(0, 6).forEach(card => {
      initialItems.push({
        id: `t-${card.id}`,
        content: card.term,
        type: 'term',
        originalCardId: card.id,
        isMatched: false
      });
      initialItems.push({
        id: `d-${card.id}`,
        content: card.definition,
        type: 'definition',
        originalCardId: card.id,
        isMatched: false
      });
    });
    setItems(initialItems.sort(() => Math.random() - 0.5));
  }, [deck.cards]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  const handleSelect = (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item || item.isMatched) return;

    if (!selectedId) {
      setSelectedId(id);
    } else {
      const first = items.find(i => i.id === selectedId)!;
      const second = items.find(i => i.id === id)!;

      if (first.originalCardId === second.originalCardId && first.type !== second.type) {
        // Match!
        setItems(items.map(i => 
          i.originalCardId === first.originalCardId ? { ...i, isMatched: true } : i
        ));
      }
      setSelectedId(null);
    }
  };

  const remaining = items.filter(i => !i.isMatched).length;

  useEffect(() => {
    if (items.length > 0 && remaining === 0) {
      // Victory!
      setTimeout(() => alert(`Great job! You finished in ${time} seconds.`), 100);
      onFinish();
    }
  }, [remaining, items.length, time, onFinish]);

  return (
    <div className="space-y-8 py-8 animate-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Matching Game</h2>
          <p className="text-gray-500">Match the pairs as fast as you can!</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-mono font-bold text-indigo-600">{time}s</div>
          <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">Time elapsed</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 min-h-[400px]">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleSelect(item.id)}
            className={`
              p-4 rounded-2xl border-2 h-32 flex items-center justify-center text-center transition-all duration-300
              ${item.isMatched ? 'opacity-0 pointer-events-none scale-0' : 'opacity-100 scale-100'}
              ${selectedId === item.id ? 'border-indigo-600 bg-indigo-50 shadow-md transform -translate-y-1' : 'border-gray-100 bg-white hover:border-indigo-300'}
            `}
          >
            <span className={`font-semibold ${item.type === 'term' ? 'text-lg text-gray-900' : 'text-sm text-gray-600'}`}>
              {item.content}
            </span>
          </button>
        ))}
      </div>

      <div className="flex justify-center">
        <button onClick={onFinish} className="px-6 py-2 text-gray-400 hover:text-gray-900 transition-colors">
          Quit Game
        </button>
      </div>
    </div>
  );
};

export default MatchStudy;
