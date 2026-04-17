import { useState } from 'react';
import { Link } from 'react-router';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useUser } from '../UserContext';
import { recycleItems } from '../data/recycleItems';
import { RecycleItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import confetti from 'canvas-confetti';
import { getRandomEcoTip } from '../data/ecoTips';

const ITEM_TYPE = 'RECYCLE_ITEM';

interface DraggableItemProps {
  item: RecycleItem;
  onDrop: () => void;
}

function DraggableItem({ item, onDrop }: DraggableItemProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM_TYPE,
    item: { id: item.id, type: item.type },
    end: (item, monitor) => {
      if (monitor.didDrop()) {
        onDrop();
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <motion.div
      ref={drag}
      whileHover={{ scale: 1.05 }}
      className={`${
        isDragging ? 'opacity-50' : 'opacity-100'
      } bg-white rounded-2xl p-4 shadow-lg cursor-move hover:shadow-xl transition-all`}
    >
      <div className="text-5xl mb-2 text-center">{item.emoji}</div>
      <div className="text-center font-bold text-gray-800">{item.name}</div>
    </motion.div>
  );
}

interface BinProps {
  type: 'papel' | 'plastico' | 'vidro' | 'organico';
  color: string;
  label: string;
  emoji: string;
  onDrop: (itemType: string, itemId: string) => void;
}

function RecycleBin({ type, color, label, emoji, onDrop }: BinProps) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ITEM_TYPE,
    drop: (item: { id: string; type: string }) => {
      onDrop(item.type, item.id);
      return item;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const isActive = isOver && canDrop;

  return (
    <div
      ref={drop}
      className={`${color} rounded-3xl p-6 shadow-xl transition-all ${
        isActive ? 'scale-105 ring-8 ring-yellow-400' : 'scale-100'
      }`}
    >
      <div className="bg-white rounded-2xl p-6 text-center h-full">
        <div className="text-6xl mb-3">{emoji}</div>
        <div className="text-2xl font-black text-gray-800 mb-2">{label}</div>
        <div className="text-sm text-gray-600">Arraste aqui</div>
      </div>
    </div>
  );
}

export default function RecycleGame() {
  const { addPoints, addEnergy } = useUser();
  const [availableItems, setAvailableItems] = useState<RecycleItem[]>([...recycleItems]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [particles, setParticles] = useState<{ id: string; color: string; x: number; y: number }[]>([]);

  const bins = [
    { type: 'papel' as const, label: 'Papel', emoji: '📄', color: 'bg-blue-400' },
    { type: 'plastico' as const, label: 'Plástico', emoji: '♻️', color: 'bg-red-400' },
    { type: 'vidro' as const, label: 'Vidro', emoji: '🫙', color: 'bg-green-400' },
    { type: 'organico' as const, label: 'Orgânico', emoji: '🍂', color: 'bg-yellow-600' },
  ];

  const handleDrop = (droppedItemId: string, binType: string) => {
    const item = availableItems.find(i => i.id === droppedItemId);
    if (!item) return;

    const isCorrect = item.type === binType;

    if (isCorrect) {
      setScore(prev => prev + 1);
      addPoints(1);
      addEnergy(10); // Adiciona 10 de energia por acerto
      setFeedback({ message: 'Parabéns! Você acertou! 🎉', isCorrect: true });
      
      // Create particles animation
      const binColors = {
        papel: '#3b82f6',
        plastico: '#ef4444',
        vidro: '#22c55e',
        organico: '#eab308'
      };
      
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: `${droppedItemId}-${i}`,
        color: binColors[binType as keyof typeof binColors],
        x: Math.random() * 100,
        y: Math.random() * 100
      }));
      
      setParticles(newParticles);
      setTimeout(() => setParticles([]), 1000);
      
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } else {
      setFeedback({ message: 'Ops! Esse não é o lugar certo. Tente novamente! 😊', isCorrect: false });
    }

    // Remove item from available
    setAvailableItems(prev => prev.filter(i => i.id !== droppedItemId));

    // Clear feedback after 2 seconds
    setTimeout(() => setFeedback(null), 2000);

    // Check if game is completed
    if (availableItems.length === 1) {
      setTimeout(() => setGameCompleted(true), 2500);
    }
  };

  const handleBinDrop = (binType: string) => (itemType: string, itemId: string) => {
    handleDrop(itemId, binType);
  };

  const handleItemDrop = (itemId: string) => {
    // Will be handled by the drop zone
  };

  const handleRestart = () => {
    setAvailableItems([...recycleItems]);
    setScore(0);
    setFeedback(null);
    setGameCompleted(false);
  };

  if (gameCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
        <div className="main-box text-center">
          <div className="text-7xl mb-6">🌍</div>
          <h2 className="text-4xl font-black text-green-600 mb-4">
            Jogo Concluído!
          </h2>
          <p className="text-3xl font-bold text-gray-700 mb-2">
            Você separou {score} itens corretamente!
          </p>
          <p className="text-xl text-gray-600 mb-6">
            Ganhou {score} pontos! ⭐
          </p>
          <div className="bg-green-50 rounded-2xl p-6 mb-8">
            <p className="text-lg text-gray-700">
              🌱 <strong>Você sabia?</strong> A reciclagem ajuda a proteger o meio ambiente
              e economiza recursos naturais. Continue assim! 💚
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={handleRestart}
              className="bg-gradient-to-r from-green-500 to-teal-500 text-white text-xl px-8 py-6"
            >
              Jogar Novamente
            </Button>
            <Link to="/home">
              <Button variant="outline" className="text-xl px-8 py-6">
                <Home className="size-5 mr-2" />
                Menu Principal
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
        <div className="main-box">
          <Link to="/home" className="inline-block mb-6">
            <Button variant="outline" className="bg-white">
              <Home className="size-4 mr-2" />
              Voltar ao Menu
            </Button>
          </Link>

          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-8"
          >
            <h1 className="text-5xl font-black text-purple-700 drop-shadow-md mb-2">
              Jogo da Reciclagem ♻️
            </h1>
            <p className="text-lg text-gray-700">Arraste cada item para a lixeira correta!</p>
            <div className="glass-badge text-sm mt-4">
              ⭐ {score} pontos
            </div>
          </motion.div>

          {/* Feedback */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                className={`${
                  feedback.isCorrect ? 'bg-green-100 border-green-500' : 'bg-orange-100 border-orange-500'
                } border-4 rounded-2xl p-6 text-center mb-6 max-w-2xl mx-auto`}
              >
                <p className="text-2xl font-bold text-gray-800">{feedback.message}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Particles Animation */}
          {particles.map(particle => (
            <motion.div
              key={particle.id}
              initial={{ x: particle.x, y: particle.y }}
              animate={{ x: particle.x + 50, y: particle.y + 50 }}
              transition={{ duration: 1 }}
              className={`absolute top-0 left-0 w-4 h-4 rounded-full ${particle.color}`}
            />
          ))}

          {/* Bins */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {bins.map((bin, index) => (
              <motion.div
                key={bin.type}
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <RecycleBin
                  type={bin.type}
                  label={bin.label}
                  emoji={bin.emoji}
                  color={bin.color}
                  onDrop={handleBinDrop(bin.type)}
                />
              </motion.div>
            ))}
          </div>

          {/* Items to Drag */}
          <div className="bg-white rounded-3xl p-8 shadow-xl max-w-full">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles className="size-6 text-yellow-500" />
              <h2 className="text-3xl font-bold text-gray-800">
                Itens para Separar ({availableItems.length})
              </h2>
              <Sparkles className="size-6 text-yellow-500" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {availableItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <DraggableItem item={item} onDrop={() => handleItemDrop(item.id)} />
                </motion.div>
              ))}
            </div>
            {availableItems.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-2xl text-gray-500 py-12"
              >
                Todos os itens foram separados! 🎉
              </motion.div>
            )}
          </div>

          {/* Educational Info */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 bg-gradient-to-r from-green-400 to-teal-400 rounded-3xl p-6 text-white text-center"
          >
            <h3 className="text-2xl font-bold mb-2">📚 Lembre-se:</h3>
            <p className="text-lg">
              🔵 Papel: jornais, revistas, caixas | 🔴 Plástico: garrafas, sacolas |
              🟢 Vidro: garrafas, potes | 🟤 Orgânico: restos de comida, folhas
            </p>
          </motion.div>
        </div>
      </div>
    </DndProvider>
      
  );
}