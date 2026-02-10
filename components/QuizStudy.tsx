
import React, { useState, useMemo } from 'react';
import { Deck, Card } from '../types';

interface QuizStudyProps {
  deck: Deck;
  onFinish: () => void;
  onTrackProgress: (correct: boolean) => void;
}

const QuizStudy: React.FC<QuizStudyProps> = ({ deck, onFinish, onTrackProgress }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [score, setScore] = useState(0);

  const currentCard = deck.cards[currentIndex];

  const options = useMemo(() => {
    const others = deck.cards.filter(c => c.id !== currentCard.id);
    const shuffledOthers = [...others].sort(() => Math.random() - 0.5);
    const choices = shuffledOthers.slice(0, 3).map(c => c.definition);
    choices.push(currentCard.definition);
    return choices.sort(() => Math.random() - 0.5);
  }, [currentCard, deck.cards]);

  const handleConfirm = () => {
    if (!selectedAnswer) return;
    setIsConfirmed(true);
    const correct = selectedAnswer === currentCard.definition;
    if (correct) setScore(score + 1);
    onTrackProgress(correct);
  };

  const handleNext = () => {
    if (currentIndex < deck.cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setIsConfirmed(false);
    } else {
      onFinish();
    }
  };

  const progress = ((currentIndex + 1) / deck.cards.length) * 100;

  return (
    <div className="max-w-2xl mx-auto py-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-gray-900">Quiz Mode</h2>
        <span className="text-gray-500 font-medium">Score: {score}</span>
      </div>

      <div className="bg-gray-200 h-2 rounded-full mb-12 overflow-hidden">
        <div 
          className="h-full bg-indigo-600 transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
        <p className="text-sm font-semibold text-indigo-500 uppercase tracking-wider mb-2">Definition for:</p>
        <h3 className="text-3xl font-bold text-gray-900 mb-8">{currentCard.term}</h3>

        <div className="space-y-4">
          {options.map((option, idx) => {
            const isCorrect = option === currentCard.definition;
            const isSelected = selectedAnswer === option;
            let bgColor = 'bg-gray-50 border-gray-100 hover:border-indigo-300';
            let textColor = 'text-gray-700';

            if (isConfirmed) {
              if (isCorrect) {
                bgColor = 'bg-green-100 border-green-500';
                textColor = 'text-green-700 font-semibold';
              } else if (isSelected) {
                bgColor = 'bg-red-100 border-red-500';
                textColor = 'text-red-700 font-semibold';
              }
            } else if (isSelected) {
              bgColor = 'bg-indigo-50 border-indigo-500';
              textColor = 'text-indigo-700 font-semibold';
            }

            return (
              <button 
                key={idx}
                disabled={isConfirmed}
                onClick={() => setSelectedAnswer(option)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${bgColor} ${textColor} ${!isConfirmed ? 'hover:shadow-sm' : ''}`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300 text-gray-400'}`}>
                  {String.fromCharCode(65 + idx)}
                </div>
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {!isConfirmed ? (
        <button 
          onClick={handleConfirm}
          disabled={!selectedAnswer}
          className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:shadow-none"
        >
          Check Answer
        </button>
      ) : (
        <button 
          onClick={handleNext}
          className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-black transition-all animate-in slide-in-from-bottom-2"
        >
          {currentIndex < deck.cards.length - 1 ? 'Next Question' : 'View Results'}
        </button>
      )}
    </div>
  );
};

export default QuizStudy;
