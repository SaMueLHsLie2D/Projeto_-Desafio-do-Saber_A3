import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useUser } from '../UserContext';
import { motion } from 'motion/react';
import { Home, Trophy, Zap } from 'lucide-react';
import { Button } from '../components/ui/button';

interface RankingEntry {
  name: string;
  energy: number;
  position: number;
}

export default function Ranking() {
  const { user } = useUser();
  const [rankings, setRankings] = useState<RankingEntry[]>([]);

  useEffect(() => {
    // Simulated ranking data - in a real app, this would come from a backend
    const mockRankings: RankingEntry[] = [
      { name: user.name, energy: user.energy, position: 1 },
      { name: 'Ana Silva', energy: 150, position: 2 },
      { name: 'João Pedro', energy: 120, position: 3 },
      { name: 'Maria Eduarda', energy: 100, position: 4 },
      { name: 'Lucas Santos', energy: 80, position: 5 },
    ];

    // Sort by energy
    const sorted = mockRankings.sort((a, b) => b.energy - a.energy);
    // Reassign positions
    const withPositions = sorted.map((entry, index) => ({
      ...entry,
      position: index + 1,
    }));

    setRankings(withPositions);
  }, [user]);

  const getMedalEmoji = (position: number) => {
    switch (position) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `${position}º`;
    }
  };

  return (
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
            Ranking 🏆
          </h1>
          <p className="text-lg text-gray-700">Top jogadores por energia</p>
        </motion.div>

        {/* Ranking List */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-center">
            <Trophy className="size-16 mx-auto mb-2 text-white" />
            <h2 className="text-3xl font-black text-white">Melhores Jogadores</h2>
          </div>

          {/* Rankings */}
          <div className="p-6 space-y-4">
            {rankings.map((entry, index) => {
              const isCurrentUser = entry.name === user.name;

              return (
                <motion.div
                  key={index}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-4 p-6 rounded-2xl ${
                    isCurrentUser
                      ? 'bg-gradient-to-r from-purple-100 to-pink-100 border-4 border-purple-400'
                      : 'bg-gray-50'
                  }`}
                >
                  {/* Position */}
                  <div className="text-4xl font-black w-20 text-center">
                    {getMedalEmoji(entry.position)}
                  </div>

                  {/* Name */}
                  <div className="flex-1">
                    <h3 className={`text-2xl font-bold ${isCurrentUser ? 'text-purple-600' : 'text-gray-800'}`}>
                      {entry.name} {isCurrentUser && '(Você)'}
                    </h3>
                  </div>

                  {/* Energy */}
                  <div className="flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-lg">
                    <Zap className="size-6 text-yellow-500 fill-yellow-500" />
                    <span className="text-2xl font-black text-orange-500">{entry.energy}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Info */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 text-center border-t-4 border-purple-200">
            <p className="text-lg text-gray-700">
              <strong>Como funciona:</strong> A cada resposta correta, você ganha 10 de energia <Zap className="inline size-5 text-yellow-500 fill-yellow-500" />
            </p>
            <p className="text-md text-gray-600 mt-2">
              Continue jogando para subir no ranking!
            </p>
          </div>
        </motion.div>

        {/* User Stats */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-white rounded-3xl p-8 shadow-xl text-center"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Suas Estatísticas</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-2xl p-6">
              <div className="text-5xl mb-2">⭐</div>
              <div className="text-3xl font-black text-orange-600">{user.totalPoints}</div>
              <div className="text-lg text-gray-700">Pontos</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl p-6">
              <Zap className="size-12 mx-auto mb-2 text-yellow-500 fill-yellow-500" />
              <div className="text-3xl font-black text-orange-600">{user.energy}</div>
              <div className="text-lg text-gray-700">Energia</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
