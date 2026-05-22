import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from './types';

// Tipo do contexto de usuário que define o estado e funções disponíveis
interface UserContextType {
  user: User;
  updateUser: (updates: Partial<User>) => void;
  addPoints: (points: number) => void;
  spendPoints: (points: number) => void;
  addEnergy: (energy: number) => void;
  unlockAvatar: (avatarUrl: string) => void;
  unlockBackground: (backgroundUrl: string) => void;
  setAvatar: (avatarUrl: string | null) => void;
  setBackground: (backgroundUrl: string | null) => void;
}

const defaultUser: User = {
  name: 'Criança',
  email: '',
  password: '',
  age: 8,
  totalPoints: 0,
  energy: 0,
  selectedAvatar: null,
  selectedBackground: null,
  unlockedAvatars: [],
  unlockedBackgrounds: [],
  nickname: '',
  gender: '',
  country: '',
  language: '',
  timeZone: '',
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(defaultUser);

  // Atualiza qualquer campo do usuário
  const updateUser = (updates: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  // Adiciona pontos ao total do usuário
  const addPoints = (points: number) => {
    setUser(prev => ({ ...prev, totalPoints: prev.totalPoints + points }));
  };

  const spendPoints = (points: number) => {
    setUser(prev => ({ ...prev, totalPoints: Math.max(0, prev.totalPoints - points) }));
  };

  const addEnergy = (energy: number) => {
    setUser(prev => ({ ...prev, energy: prev.energy + energy }));
  };

  // Marca um avatar como desbloqueado
  const unlockAvatar = (avatarUrl: string) => {
    setUser(prev => ({
      ...prev,
      unlockedAvatars: [...prev.unlockedAvatars, avatarUrl],
    }));
  };

  // Marca um fundo como desbloqueado
  const unlockBackground = (backgroundUrl: string) => {
    setUser(prev => ({
      ...prev,
      unlockedBackgrounds: [...prev.unlockedBackgrounds, backgroundUrl],
    }));
  };

  // Seleciona ou remove o avatar atual do usuário
  const setAvatar = (avatarUrl: string | null) => {
    setUser(prev => ({ ...prev, selectedAvatar: avatarUrl }));
  };

  // Seleciona ou remove o fundo atual do usuário
  const setBackground = (backgroundUrl: string | null) => {
    setUser(prev => ({ ...prev, selectedBackground: backgroundUrl }));
  };

  // Aplicar fundo ao elemento raiz quando selectedBackground muda
  useEffect(() => {
    const root = document.getElementById('root');
    if (root) {
      if (user.selectedBackground) {
        // Mapeamento de gradientes Tailwind para CSS inline
        const gradientMap: { [key: string]: string } = {
          'from-green-400 via-emerald-500 to-teal-600': 'linear-gradient(to bottom right, #4ade80, #10b981, #0d9488)',
          'from-blue-400 via-cyan-500 to-blue-600': 'linear-gradient(to bottom right, #60a5fa, #06b6d4, #2563eb)',
          'from-indigo-900 via-purple-900 to-pink-900': 'linear-gradient(to bottom right, #312e81, #581c87, #831843)',
          'from-orange-400 via-red-500 to-pink-600': 'linear-gradient(to bottom right, #fb7185, #ef4444, #ec4899)',
          'from-red-400 via-yellow-400 to-green-400': 'linear-gradient(to bottom right, #f87171, #facc15, #4ade80)',
          'from-purple-900 via-blue-900 to-black': 'linear-gradient(to bottom right, #581c87, #1e3a8a, #000000)',
        };
        
        const cssGradient = gradientMap[user.selectedBackground] || `linear-gradient(to bottom right, #ddd6fe, #f9e7ff, #fce7f3)`;
        root.style.background = cssGradient;
        root.style.minHeight = '100vh';
      } else {
        root.style.background = 'linear-gradient(to bottom right, #dbeafe, #e9d5ff, #fce7f3)';
        root.style.minHeight = '100vh';
      }
    }
  }, [user.selectedBackground]);

  // Provider que passa o contexto de usuário para toda a árvore de componentes
  return (
    <UserContext.Provider
      value={{
        user,
        updateUser,
        addPoints,
        spendPoints,
        addEnergy,
        unlockAvatar,
        unlockBackground,
        setAvatar,
        setBackground,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}