import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useUser } from '../UserContext';

export default function WelcomeScreen() {
  const { user, updateUser } = useUser();
  const [name, setName] = useState('');
  const [age, setAge] = useState(8);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Show welcome screen only if user hasn't set a custom name
    if (user.name === 'Criança' && user.totalPoints === 0) {
      setShowWelcome(true);
    }
  }, [user]);

  const handleStart = () => {
    if (name.trim()) {
      updateUser({ name: name.trim(), age });
    }
    setShowWelcome(false);
  };

  if (!showWelcome) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white z-50 flex items-center justify-center p-8"
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-3xl p-12 max-w-2xl w-full shadow-2xl text-center border-4 border-purple-200"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <h1 className="text-6xl font-black" style={{ fontFamily: 'Bangers, cursive', color: '#9333ea' }}>
            Desafio do Saber
          </h1>
        </div>

        <p className="text-2xl text-gray-700 mb-8">
          Bem vindo ao mundo da aprendizagem
        </p>

        <div className="space-y-6 mb-8 text-left">
          <div>
            <Label htmlFor="welcome-name" className="text-lg font-semibold text-gray-700">
              Qual é o seu nome?
            </Label>
            <Input
              id="welcome-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 text-lg"
              placeholder="Digite seu nome"
              autoFocus
            />
          </div>

          <div>
            <Label htmlFor="welcome-age" className="text-lg font-semibold text-gray-700">
              Quantos anos você tem? (0 a 16 anos)
            </Label>
            <Input
              id="welcome-age"
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="mt-2 text-lg"
              min="0"
              max="16"
            />
          </div>
        </div>

        <Button
          onClick={handleStart}
          disabled={!name.trim()}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-2xl px-12 py-8 w-full"
        >
          Começar
        </Button>

        <button
          onClick={() => setShowWelcome(false)}
          className="mt-4 text-gray-500 hover:text-gray-700 text-sm"
        >
          Continuar sem cadastro
        </button>
      </motion.div>
    </motion.div>
  );
}