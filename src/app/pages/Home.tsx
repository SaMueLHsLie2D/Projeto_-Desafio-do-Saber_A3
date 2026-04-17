import { Link } from 'react-router';
import { useUser } from '../UserContext';
import { BookOpen, Recycle, Trophy, User, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import WelcomeScreen from '../components/WelcomeScreen';
import { getRandomEcoTip } from '../data/ecoTips';
import { useState, useEffect } from 'react';
export default function Home() {
  const { user } = useUser();
  const [ecoTip, setEcoTip] = useState('');
  const [toast, setToast] = useState("");
  const [pointsAnim, setPointsAnim] = useState(false);
  
  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(""), 3000);
  };

  const triggerPoints = () => {
    setPointsAnim(true);
    setTimeout(() => setPointsAnim(false), 1000);
  };

  useEffect(() => {
    setEcoTip(getRandomEcoTip());
  }, []);

  const games = [
    {
      title: 'Quiz do Saber',
      description: 'Responda perguntas e aprenda brincando!',
      icon: BookOpen,
      path: '/quiz',
      color: 'from-purple-400 to-pink-400',
    },
    {
      title: 'Jogo da Reciclagem',
      description: 'Aprenda a separar o lixo corretamente!',
      icon: Recycle,
      path: '/reciclagem',
      color: 'from-green-400 to-teal-400',
    },
    {
      title: 'Ranking',
      description: 'Veja sua posição no ranking!',
      icon: Trophy,
      path: '/ranking',
      color: 'from-yellow-400 to-orange-400',
    },
    {
      title: 'Recompensas',
      description: 'Veja seus prêmios e desbloqueie novos!',
      icon: Trophy,
      path: '/recompensas',
      color: 'from-orange-400 to-red-400',
    },
    {
      title: 'Meu Perfil',
      description: 'Personalize sua conta!',
      icon: User,
      path: '/perfil',
      color: 'from-blue-400 to-indigo-400',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-4 relative">
      {/* Animação de Pontos */}
      {pointsAnim && (
        <motion.div
          initial={{ y: 0, opacity: 1 }}
          animate={{ y: -50, opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed top-20 right-10 text-2xl font-bold text-yellow-400 z-50"
        >
          +10 ⭐
        </motion.div>
      )}

      {/* Notificação Toast */}
      {toast && (
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          className="fixed top-5 right-5 bg-purple-600 text-white px-6 py-3 rounded-xl shadow-xl z-50"
        >
          {toast}
        </motion.div>
      )}

      <div className="main-box">
        <WelcomeScreen />
        
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-black text-purple-700 drop-shadow-md">
            Desafio do Saber
          </h1>

          <p className="text-lg mt-2 text-gray-700">
            Olá, <span className="font-bold text-purple-600">{user.name}</span> 👋
          </p>

          <div className="flex gap-4 justify-center mt-4">
            <div className="glass-badge text-sm">
              ⭐ {user.totalPoints} pontos
            </div>

            <div className="glass-badge text-sm">
              ⚡ {user.energy} energia
            </div>
          </div>
        </motion.div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {games.map((game, index) => (
            <motion.div
              key={game.path}
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={game.path}>
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 1 }}
                  whileTap={{ scale: 0.9, rotate: -2 }}
                  onClick={() => {
                    triggerPoints();
                    showToast('🎉 Você ganhou 10 pontos!');
                  }}
                  className={`bg-gradient-to-br ${game.color} rounded-2xl p-5 shadow-lg cursor-pointer h-full hover:shadow-xl transition`}
                >
                  <div className="card-custom text-center flex flex-col items-center justify-center gap-3">
                    <div className="bg-gradient-to-br from-white to-gray-100 rounded-full p-4 shadow-lg">
                      <game.icon className="size-12 text-gray-700" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-800">
                      {game.title}
                    </h2>
                    <p className="text-sm text-gray-600">{game.description}</p>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Fun Facts */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 bg-green-50 rounded-2xl"
        >
          <h3 className="text-xl font-bold text-green-700 mb-2">
            🌱 Dica Ecológica do Dia
          </h3>
          <p className="text-sm text-gray-700">
            {ecoTip}
          </p>
        </motion.div>
      </div>
    </div>
    
  );
  
}

