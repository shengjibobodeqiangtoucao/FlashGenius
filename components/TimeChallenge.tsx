
import React, { useState, useEffect } from 'react';
import { Deck, Card } from '../types';

interface TimeChallengeProps {
  deck: Deck;
  onFinish: () => void;
}

const TimeChallenge: React.FC<TimeChallengeProps> = ({ deck, onFinish }) => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);

  const currentCard = deck.cards[currentIndex];

  useEffect(() => {
    if (timeLeft <= 0) {
      alert(`Time's up! Your final score is ${score}`);
      onFinish();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, score, onFinish]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim().toLowerCase() === currentCard.term.toLowerCase()) {
      setScore(score + 10);
      setUserInput('');
      setCurrentIndex((currentIndex + 1) % deck.cards.length);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 text-center animate-in slide-in-from-top-4 duration-500">
      <div className="flex justify-between items-center mb-12">
        <div className="bg-red-50 text-red-600 px-6 py-2 rounded-full font-bold border border-red-100 flex items-center gap-2">
          <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          {timeLeft}s
        </div>
        <div className="text-2xl font-bold text-gray-900">Points: <span className="text-indigo-600">{score}</span></div>
      </div>

      <div className="bg-white p-12 rounded-[40px] shadow-2xl border border-gray-100 mb-8 transform hover:scale-[1.02] transition-transform">
        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-4">What is the term for:</p>
        <h3 className="text-2xl md:text-3xl font-medium text-gray-800 leading-relaxed mb-12">"{currentCard.definition}"</h3>
        
        <form onSubmit={handleSubmit}>
          <input 
            autoFocus
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="w-full text-center py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none text-xl font-bold transition-all"
            placeholder="Type the term..."
          />
          <p className="mt-4 text-gray-400 text-xs font-bold uppercase">Press Enter to Submit</p>
        </form>
      </div>

      <button onClick={onFinish} className="text-gray-400 hover:text-red-500 font-bold">Abort Mission</button>
    </div>
  );
};

export default TimeChallenge;
