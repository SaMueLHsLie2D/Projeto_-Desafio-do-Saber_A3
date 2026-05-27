// Tipos do sistema
export interface User {
  avatar: string;
  name: string;
  email: string;
  password: string;
  age: number;
  totalPoints: number;
  energy: number; // Sistema de energia para ranking
  selectedAvatar: string | null;
  selectedBackground: string | null;
  unlockedAvatars: string[];
  unlockedBackgrounds: string[];
  nickname?: string;
  gender?: string;
  country?: string;
  language?: string;
  timeZone?: string;
}

export interface Question {
  id: string;
  category: 'matematica' | 'portugues' | 'ciencias';
  level: 'facil' | 'medio' | 'dificil';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  difficulty?: 'facil' | 'medio' | 'dificil';
}

export interface RecycleItem {
  id: string;
  name: string;
  type: 'papel' | 'plastico' | 'vidro' | 'organico';
  emoji: string;
}

export interface Reward {
  id: string;
  type: 'avatar' | 'background';
  name: string;
  imageUrl: string;
  pointsRequired: number;
  unlocked: boolean;
}