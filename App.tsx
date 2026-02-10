import React, { useState, useEffect } from 'react';
import { AppView, Deck, Card, UserStats } from './types';
import Dashboard from './components/Dashboard';
import DeckEditor from './components/DeckEditor';
import FlipStudy from './components/FlipStudy';
import QuizStudy from './components/QuizStudy';
import MatchStudy from './components/MatchStudy';
import TimeChallenge from './components/TimeChallenge';
import MemoryGame from './components/MemoryGame';
import FallingWords from './components/FallingWords';
import Statistics from './components/Statistics';
import Navbar from './components/Navbar';

// Mock Initial Data
const INITIAL_DECKS: Deck[] = [
  {
    id: '1',
    title: 'Periodic Table Basics',
    description: 'Essential elements and their properties for chemistry class.',
    category: 'Science',
    createdAt: Date.now(),
    cards: [
      { id: 'c1', term: 'Hydrogen', definition: 'The first element, highly flammable gas.' },
      { id: 'c2', term: 'Helium', definition: 'Inert gas used in balloons and cryogenics.' },
      { id: 'c3', term: 'Carbon', definition: 'The basis of all known life on Earth.' },
      { id: 'c4', term: 'Oxygen', definition: 'Highly reactive nonmetal that supports combustion.' }
    ]
  },
  {
    id: '2',
    title: 'SAT Vocabulary - Unit 1',
    description: 'High frequency words for the SAT exam.',
    category: 'English',
    createdAt: Date.now(),
    cards: [
      { id: 'v1', term: 'Ephemeral', definition: 'Lasting for a very short time.' },
      { id: 'v2', term: 'Capricious', definition: 'Given to sudden and unaccountable changes of mood or behavior.' },
      { id: 'v3', term: 'Laconic', definition: 'Using very few words.' }
    ]
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('dashboard');
  const [decks, setDecks] = useState<Deck[]>(() => {
    try {
      const saved = localStorage.getItem('fg_decks');
      return saved ? JSON.parse(saved) : INITIAL_DECKS;
    } catch (e) {
      console.error("Failed to parse localStorage data", e);
      return INITIAL_DECKS;
    }
  });
  const [currentDeckId, setCurrentDeckId] = useState<string | null>(null);
  const [stats, setStats] = useState<UserStats>({
    cardsStudied: 154,
    correctAnswers: 132,
    streakDays: 5,
    totalPoints: 2450
  });

  useEffect(() => {
    localStorage.setItem('fg_decks', JSON.stringify(decks));
  }, [decks]);

  const handleUpdateStats = (correct: boolean) => {
    setStats(prev => ({
      ...prev,
      cardsStudied: prev.cardsStudied + 1,
      correctAnswers: prev.correctAnswers + (correct ? 1 : 0),
      totalPoints: prev.totalPoints + (correct ? 10 : 0)
    }));
  };

  const handleCreateDeck = (deck: Deck) => {
    setDecks([deck, ...decks]);
    setView('dashboard');
  };

  const handleDeleteDeck = (id: string) => {
    setDecks(decks.filter(d => d.id !== id));
  };

  const currentDeck = decks.find(d => d.id === currentDeckId);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentView={view} setView={setView} stats={stats} />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl flex flex-col justify-center">
        {view === 'dashboard' && (
          <Dashboard 
            decks={decks} 
            onSelectDeck={(id, studyView) => {
              setCurrentDeckId(id);
              setView(studyView);
            }}
            onEditDeck={(id) => {
              setCurrentDeckId(id);
              setView('editor');
            }}
            onDeleteDeck={handleDeleteDeck}
            onNewDeck={() => {
              setCurrentDeckId(null);
              setView('editor');
            }}
          />
        )}

        {view === 'editor' && (
          <DeckEditor 
            deck={currentDeck} 
            onSave={handleCreateDeck} 
            onCancel={() => setView('dashboard')} 
          />
        )}

        {view === 'study-flip' && currentDeck && (
          <FlipStudy 
            deck={currentDeck} 
            onFinish={() => setView('dashboard')} 
            onTrackProgress={handleUpdateStats}
          />
        )}

        {view === 'study-quiz' && currentDeck && (
          <QuizStudy 
            deck={currentDeck} 
            onFinish={() => setView('dashboard')}
            onTrackProgress={handleUpdateStats}
          />
        )}

        {view === 'study-match' && currentDeck && (
          <MatchStudy 
            deck={currentDeck} 
            onFinish={() => setView('dashboard')} 
          />
        )}

        {view === 'study-time' && currentDeck && (
          <TimeChallenge 
            deck={currentDeck} 
            onFinish={() => setView('dashboard')}
          />
        )}

        {view === 'study-memory' && currentDeck && (
          <MemoryGame 
            deck={currentDeck} 
            onFinish={() => setView('dashboard')}
          />
        )}

        {view === 'study-falling' && currentDeck && (
          <FallingWords 
            deck={currentDeck} 
            onFinish={() => setView('dashboard')}
          />
        )}

        {view === 'statistics' && (
          <Statistics stats={stats} decks={decks} />
        )}
      </main>

      <footer className="bg-white border-t py-6 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} FlashGenius. Empowered by Gemini AI.</p>
      </footer>
    </div>
  );
};

export default App;