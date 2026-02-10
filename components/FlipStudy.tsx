
import React, { useState } from 'react';
import { Deck, Card } from '../types';

interface FlipStudyProps {
  deck: Deck;
  onFinish: () => void;
  onTrackProgress: (correct: boolean) => void;
}

const FlipStudy: React.FC<FlipStudyProps> = ({ deck, onFinish, onTrackProgress }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  const handleNext = (known: boolean) => {
    onTrackProgress(known);
    if (currentIndex < deck.cards.length - 1) {
      setDirection('right');
      setTimeout(() => {
        setIsFlipped(false);
        setCurrentIndex(currentIndex + 1);
        setDirection(null);
      }, 300);
    } else {
      onFinish();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection('left');
      setTimeout(() => {
        setIsFlipped(false);
        setCurrentIndex(currentIndex - 1);
        setDirection(null);
      }, 300);
    }
  };

  const currentCard = deck.cards[currentIndex];
  const progress = ((currentIndex + 1) / deck.cards.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-8">
      <div className="w-full max-w-2xl mb-8 flex items-center justify-between gap-4">
        <button onClick={onFinish} className="text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          Exit Study
        </button>
        <div className="flex-grow bg-gray-200 h-3 rounded-full overflow-hidden relative">
          <div 
            className="h-full bg-indigo-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="text-sm font-bold text-gray-500">{currentIndex + 1} / {deck.cards.length}</span>
      </div>

      <div 
        className={`w-full max-w-2xl h-96 perspective-1000 cursor-pointer group transition-transform duration-300 ${direction === 'right' ? 'translate-x-full opacity-0' : direction === 'left' ? '-translate-x-full opacity-0' : ''}`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`relative w-full h-full preserve-3d transition-transform duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}>
          {/* Front */}
          <div className="absolute inset-0 bg-white rounded-3xl shadow-xl border border-gray-100 flex items-center justify-center p-12 backface-hidden">
            <h2 className="text-4xl font-bold text-center text-gray-900">{currentCard.term}</h2>
            <div className="absolute bottom-6 text-gray-400 text-sm flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path></svg>
              Click to flip
            </div>
          </div>
          {/* Back */}
          <div className="absolute inset-0 bg-indigo-600 rounded-3xl shadow-xl flex items-center justify-center p-12 backface-hidden rotate-y-180">
            <p className="text-2xl text-white text-center leading-relaxed font-medium">{currentCard.definition}</p>
          </div>
        </div>
      </div>

      <div className="mt-12 flex gap-8">
        <button 
          onClick={(e) => { e.stopPropagation(); handleNext(false); }}
          className="bg-white border-2 border-red-500 text-red-500 hover:bg-red-50 px-8 py-3 rounded-full font-bold shadow-md transition-all active:scale-95"
        >
          Don't know it
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); handleNext(true); }}
          className="bg-green-500 text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-green-600 transition-all active:scale-95"
        >
          Know it!
        </button>
      </div>

      <div className="mt-8 text-gray-400 text-sm flex items-center gap-4">
        <span className="flex items-center gap-1">
          <kbd className="px-2 py-1 bg-gray-100 rounded border">Space</kbd> Flip
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-2 py-1 bg-gray-100 rounded border">←</kbd> / <kbd className="px-2 py-1 bg-gray-100 rounded border">→</kbd> Navigate
        </span>
      </div>
    </div>
  );
};

export default FlipStudy;
