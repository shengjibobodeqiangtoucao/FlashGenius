import React, { useState, useEffect, useRef } from 'react';
import { Deck, Card } from '../types';

interface FallingWordsProps {
  deck: Deck;
  onFinish: () => void;
}

interface FallingWord {
  id: string;
  cardId: string;
  term: string;
  definition: string;
  x: number; // Percentage 0-100
  y: number; // Pixels
  speed: number;
}

const FallingWords: React.FC<FallingWordsProps> = ({ deck, onFinish }) => {
  const [words, setWords] = useState<FallingWord[]>([]);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const gameLoopRef = useRef<number>();
  const spawnLoopRef = useRef<number>();
  const lastSpawnTime = useRef<number>(Date.now());
  const wordsRef = useRef<FallingWord[]>([]); // Ref to sync latest words for loop
  const scoreRef = useRef<number>(0);
  const livesRef = useRef<number>(3);

  // Sync state to refs for the animation loop
  useEffect(() => { wordsRef.current = words; }, [words]);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { livesRef.current = lives; }, [lives]);

  const spawnWord = () => {
    if (deck.cards.length === 0 || livesRef.current <= 0) return;
    
    const randomCard = deck.cards[Math.floor(Math.random() * deck.cards.length)];
    // Random position between 10% and 70% to avoid edge overflow
    const xPos = 10 + Math.random() * 60; 
    // Speed increases slightly as score goes up
    const baseSpeed = 1.5 + (scoreRef.current / 500); 

    const newWord: FallingWord = {
      id: Math.random().toString(36).substr(2, 9),
      cardId: randomCard.id,
      term: randomCard.term,
      definition: randomCard.definition,
      x: xPos,
      y: -50,
      speed: baseSpeed
    };

    setWords(prev => [...prev, newWord]);
  };

  useEffect(() => {
    if (isGameOver) return;

    const gameAreaHeight = 500; // Fixed game area height
    let animationFrameId: number;

    const loop = () => {
      let isHitBottom = false;

      setWords(prevWords => {
        const nextWords = prevWords.map(w => ({ ...w, y: w.y + w.speed }));
        const survivingWords = nextWords.filter(w => {
          if (w.y > gameAreaHeight) {
            isHitBottom = true;
            return false;
          }
          return true;
        });
        return survivingWords;
      });

      if (isHitBottom) {
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) setIsGameOver(true);
          return newLives;
        });
      }

      // Handle spawn timing
      const now = Date.now();
      // Decrease spawn interval as score increases (max fast is 1s)
      const spawnInterval = Math.max(1000, 3000 - (scoreRef.current * 2)); 
      
      if (now - lastSpawnTime.current > spawnInterval) {
        spawnWord();
        lastSpawnTime.current = now;
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    
    // Initial spawn
    spawnWord();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isGameOver, deck.cards]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const typedTerm = input.trim().toLowerCase();
    
    // Find matching word
    const matchIndex = words.findIndex(w => w.term.toLowerCase() === typedTerm);
    
    if (matchIndex !== -1) {
      // Boom! Term matched
      const matchedWord = words[matchIndex];
      setScore(prev => prev + 10 * Math.floor(matchedWord.speed));
      setWords(prev => prev.filter((_, idx) => idx !== matchIndex));
      setInput('');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-in slide-in-from-bottom-8 duration-500">
      <div className="flex items-center justify-between mb-4 px-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gravity ☄️</h2>
          <p className="text-sm text-gray-500">Protect the planet by typing the terms before definitions crash!</p>
        </div>
        <div className="flex gap-6 text-right">
          <div>
            <div className="text-xl font-bold text-red-500">
              {Array.from({ length: Math.max(0, lives) }).map((_, i) => '❤️').join('')}
            </div>
            <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">Lives</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-indigo-600">{score}</div>
            <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">Score</div>
          </div>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="relative w-full h-[500px] bg-slate-900 rounded-t-3xl overflow-hidden border-4 border-slate-800 shadow-inner"
        style={{ backgroundImage: 'radial-gradient(circle at 50% 100%, #1e293b, #0f172a)' }}
      >
        {isGameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10 p-4">
            <h3 className="text-4xl font-bold text-red-500 mb-2">GAME OVER</h3>
            <p className="text-white text-xl mb-6">Final Score: {score}</p>
            <div className="flex gap-4">
              <button 
                onClick={() => {
                  setScore(0);
                  setLives(3);
                  setWords([]);
                  setIsGameOver(false);
                  setInput('');
                }}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-500"
              >
                Play Again
              </button>
              <button 
                onClick={onFinish}
                className="bg-gray-700 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-600"
              >
                Exit
              </button>
            </div>
          </div>
        )}

        {!isGameOver && words.map(word => (
          <div 
            key={word.id}
            className="absolute p-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl shadow-lg max-w-[200px] text-center pointer-events-none transition-transform"
            style={{ 
              left: `${word.x}%`, 
              top: `${word.y}px`,
            }}
          >
            <p className="font-medium text-sm drop-shadow-md">{word.definition}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-800 p-6 rounded-b-3xl shadow-xl flex gap-4">
        <form onSubmit={handleSubmit} className="w-full flex gap-4">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isGameOver}
            autoFocus
            className="flex-grow bg-slate-700 border-2 border-slate-600 focus:border-indigo-400 text-white placeholder-slate-400 px-6 py-4 rounded-xl outline-none text-xl transition-colors disabled:opacity-50"
            placeholder="Type the matching term here and press Enter..."
          />
          <button 
            type="submit"
            disabled={isGameOver || !input.trim()}
            className="bg-indigo-500 text-white px-8 font-bold rounded-xl hover:bg-indigo-400 transition-colors disabled:opacity-50"
          >
            FIRE!
          </button>
        </form>
      </div>
      
      <div className="mt-4 flex justify-center">
        <button onClick={onFinish} className="text-gray-400 hover:text-gray-900 transition-colors text-sm font-semibold">
          Exit to Dashboard
        </button>
      </div>
    </div>
  );
};

export default FallingWords;