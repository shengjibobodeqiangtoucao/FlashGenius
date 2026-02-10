export interface Card {
  id: string;
  term: string;
  definition: string;
  category?: string;
}

export interface Deck {
  id: string;
  title: string;
  description: string;
  cards: Card[];
  createdAt: number;
  lastStudied?: number;
  category: string;
}

export interface UserStats {
  cardsStudied: number;
  correctAnswers: number;
  streakDays: number;
  totalPoints: number;
}

export type AppView = 'dashboard' | 'editor' | 'study-flip' | 'study-quiz' | 'study-match' | 'study-time' | 'study-memory' | 'study-falling' | 'statistics';

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  WRITTEN = 'WRITTEN'
}