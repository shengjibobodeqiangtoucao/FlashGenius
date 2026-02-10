import React, { useState, useEffect } from 'react';
import { Deck, Card } from '../types';

interface MemoryGameProps {
  deck: Deck;
  onFinish: () => void;
}

interface MemoryCard {
  id: string;
  text: string;
  type: 'term' | 'definition';
  pairId: string; // The ID of the original flashcard
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryGame: React.FC<MemoryGameProps> = ({ deck, onFinish }) => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);

  useEffect(() => {
    // Pick up to 8 cards for a 16-card grid max to keep it playable
    const selectedCards = deck.cards.slice(0, 8);
    let gameCards: MemoryCard[] = [];
    
    selectedCards.forEach((card, index) => {
      gameCards.push({
        id: `t-${card.id}-${index}`,
        text: card.term,
        type: 'term',
        pairId: card.id,
        isFlipped: false,
        isMatched: false,
      });
      gameCards.push({
        id: `d-${card.id}-${index}`,
        text: card.definition,
        type: 'definition',
        pairId: card.id,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle
    gameCards = gameCards.sort(() => Math.random() - 0.5);
    setCards(gameCards);
  }, [deck]);

  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [firstIndex, secondIndex] = flippedIndices;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.pairId === secondCard.pairId && firstCard.type !== secondCard.type) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map((card, idx) => 
            idx === firstIndex || idx === secondIndex ? { ...card, isMatched: true } : card
          ));
          setFlippedIndices([]);
          setMatches(prev => prev + 1);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map((card, idx) => 
            idx === firstIndex || idx === secondIndex ? { ...card, isFlipped: false } : card
          ));
          setFlippedIndices([]);
        }, 1000);
      }
      setMoves(prev => prev + 1);
    }
  }, [flippedIndices, cards]);

  const handleCardClick = (index: number) => {
    if (flippedIndices.length >= 2 || cards[index].isFlipped || cards[index].isMatched) {
      return;
    }
    
    setCards(prev => prev.map((card, idx) => 
      idx === index ? { ...card, isFlipped: true } : card
    ));
    setFlippedIndices(prev => [...prev, index]);
  };

  const isWon = cards.length > 0 && matches === cards.length / 2;

  return (
    <div className="w-full max-w-4xl mx-auto py-8 animate-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Memory Match 🃏</h2>
          <p className="text-gray-500">Find the matching term and definition pairs.</p>
        </div>
        <div className="flex gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-indigo-600">{moves}</div>
            <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">Moves</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-500">{matches} / {cards.length / 2}</div>
            <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">Matches</div>
          </div>
        </div>
      </div>

      {isWon ? (
        <div className="bg-white p-12 rounded-3xl text-center shadow-lg border border-gray-100">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">You Won!</h3>
          <p className="text-gray-500 mb-8">It took you {moves} moves to complete the game.</p>
          <button 
            onClick={onFinish}
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
          {cards.map((card, index) => (
            <div 
              key={card.id}
              onClick={() => handleCardClick(index)}
              className="relative w-full aspect-[4/3] perspective-1000 cursor-pointer"
            >
              <div className={`w-full h-full preserve-3d transition-transform duration-500 ${card.isFlipped || card.isMatched ? 'rotate-y-180' : ''}`}>
                
                {/* Back of card (visible when face down) */}
                <div className={`absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md border-2 border-indigo-400/50 flex items-center justify-center backface-hidden transition-opacity ${card.isMatched ? 'opacity-0' : 'opacity-100'}`}>
                  <div className="text-white/30 text-4xl">?</div>
                </div>

                {/* Front of card (visible when flipped) */}
                <div className={`absolute inset-0 rounded-xl shadow-md border-2 flex items-center justify-center p-4 backface-hidden rotate-y-180 overflow-hidden text-center transition-all duration-300
                  ${card.isMatched ? 'bg-green-50 border-green-400 text-green-700 opacity-80 scale-95' : 'bg-white border-indigo-200 text-gray-800'}
                `}>
                  <span className={`font-semibold ${card.type === 'term' ? 'text-lg md:text-xl' : 'text-xs md:text-sm'}`}>
                    {card.text}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-8 flex justify-center">
        <button onClick={onFinish} className="px-6 py-2 text-gray-400 hover:text-gray-900 transition-colors">
          Exit Game
        </button>
      </div>
    </div>
  );
};

export default MemoryGame;