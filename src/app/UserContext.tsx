import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from './types';

interface UserContextType {
  user: User;
  updateUser: (updates: Partial<User>) => void;
  addPoints: (points: number) => void;
  spendPoints: (points: number) => void;
  addEnergy: (energy: number) => void;
  unlockAvatar: (avatarUrl: string) => void;
  unlockBackground: (backgroundUrl: string) => void;
  setAvatar: (avatarUrl: string) => void;
  setBackground: (backgroundUrl: string) => void;
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
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(defaultUser);

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const addPoints = (points: number) => {
    setUser(prev => ({ ...prev, totalPoints: prev.totalPoints + points }));
  };

  const spendPoints = (points: number) => {
    setUser(prev => ({ ...prev, totalPoints: Math.max(0, prev.totalPoints - points) }));
  };

  const addEnergy = (energy: number) => {
    setUser(prev => ({ ...prev, energy: prev.energy + energy }));
  };

  const unlockAvatar = (avatarUrl: string) => {
    setUser(prev => ({
      ...prev,
      unlockedAvatars: [...prev.unlockedAvatars, avatarUrl],
    }));
  };

  const unlockBackground = (backgroundUrl: string) => {
    setUser(prev => ({
      ...prev,
      unlockedBackgrounds: [...prev.unlockedBackgrounds, backgroundUrl],
    }));
  };

  const setAvatar = (avatarUrl: string) => {
    setUser(prev => ({ ...prev, selectedAvatar: avatarUrl }));
  };

  const setBackground = (backgroundUrl: string) => {
    setUser(prev => ({ ...prev, selectedBackground: backgroundUrl }));
  };

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