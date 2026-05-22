import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
    // Ranking simulado. Em produção, estes dados viriam de um backend.
    const mockRankings: RankingEntry[] = [
      { name: user.name, energy: user.energy, position: 0 },
      { name: 'Ana Silva', energy: 150, position: 0 },
      { name: 'João Pedro', energy: 120, position: 0 },
      { name: 'Maria Eduarda', energy: 100, position: 0 },
      { name: 'Lucas Santos', energy: 80, position: 0 },
    ];

    const sorted = [...mockRankings].sort((a, b) => b.energy - a.energy);
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

  const backgroundClass = user.selectedBackground
    ? `min-h-screen bg-gradient-to-br ${user.selectedBackground} flex items-center justify-center p-4`
    : 'min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-4';

  // Busca a posição atual do usuário no ranking para exibir um resumo
  const currentUserRank = rankings.find((entry) => entry.name === user.name);

  return (
    <div className={backgroundClass}>
      <div className="main-box ranking-container page-card">
        <div className="flex flex-col gap-4 md:flex-row justify-between items-start md:items-center mb-6">
          <Link to="/home" className="inline-block">
            <Button variant="outline" className="bg-white">
              <Home className="size-4 mr-2" />
              Voltar ao Menu
            </Button>
          </Link>
          <div className="ranking-points-badge bg-white rounded-full px-5 py-3 shadow-lg text-orange-500 font-bold">
            ⭐ {user.totalPoints} pontos
          </div>
        </div>

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="ranking-header text-center mb-8"
        >
          <div className="ranking-title-card mx-auto mb-4">
            <Trophy className="size-16 text-white" />
          </div>
          <h1 className="page-title text-white">
            Melhores Jogadores
          </h1>
          <p className="page-subtitle text-white/85">Desbloqueie energia ao subir no ranking!</p>
          {currentUserRank && (
            <div className="ranking-summary mt-5 bg-white/20 border border-white/30 rounded-3xl p-4 inline-flex items-center justify-center gap-3 text-white text-base font-semibold">
              <Zap className="size-5 text-yellow-300 fill-yellow-300" />
              Você está em <strong>#{currentUserRank.position}</strong> com <strong>{currentUserRank.energy}</strong> energia
            </div>
          )}
        </motion.div>

        {/* Ranking List */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="ranking-card"
        >
          {/* Rankings */}
          <div className="p-6 space-y-4">
            {rankings.map((entry, index) => {
              const isCurrentUser = entry.name === user.name;
              const rankStyle = isCurrentUser
                ? 'ranking-entry-current'
                : entry.position === 1
                ? 'ranking-entry-gold'
                : entry.position === 2
                ? 'ranking-entry-silver'
                : entry.position === 3
                ? 'ranking-entry-bronze'
                : 'bg-white';

              return (
                <motion.div
                  key={`${entry.name}-${entry.position}`}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`ranking-entry relative flex flex-wrap items-center gap-4 p-6 ${rankStyle}`}
                >
                  {/* Position */}
                  <div className="ranking-position text-4xl font-black w-20 text-center">
                    {getMedalEmoji(entry.position)}
                  </div>

                  {/* Name */}
                  <div className="flex-1">
                    <h3 className={`text-2xl font-bold ${isCurrentUser ? 'text-purple-700' : 'text-gray-800'}`}>
                      {entry.name} {isCurrentUser && '(Você)'}
                    </h3>
                  </div>

                  {/* Energy */}
                  <div className="ranking-energy flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-lg">
                    <Zap className="size-6 text-yellow-500 fill-yellow-500" />
                    <span className="text-2xl font-black text-orange-500">{entry.energy}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Info */}
          <div className="ranking-footer bg-white p-6 text-center border-t border-gray-200 rounded-b-3xl">
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
          className="mt-8 stats-card"
        >
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Suas Estatísticas</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="stat-card bg-gradient-to-br from-orange-100 to-yellow-100 rounded-3xl p-6">
              <div className="text-5xl mb-2">⭐</div>
              <div className="text-3xl font-black text-orange-600">{user.totalPoints}</div>
              <div className="text-lg text-gray-700">Pontos</div>
            </div>
            <div className="stat-card bg-gradient-to-br from-yellow-100 to-orange-100 rounded-3xl p-6">
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
