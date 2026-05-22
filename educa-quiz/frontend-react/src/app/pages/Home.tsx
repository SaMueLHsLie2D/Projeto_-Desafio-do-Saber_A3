import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import { BookOpen, Recycle, Trophy, User, Sparkles, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import WelcomeScreen from '../components/WelcomeScreen';
import { getRandomEcoTip } from '../data/ecoTips';
import { useState, useEffect } from 'react';
export default function Home() {
  // Estado para controlar o modal de perfil (não usado no layout atual)
  const [openProfile, setOpenProfile] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();
  const [ecoTip, setEcoTip] = useState('');
  const [toast, setToast] = useState("");
  const [pointsAnim, setPointsAnim] = useState(false);
  
  // Mostra uma notificação rápida na tela
  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(""), 3000);
  };

  // Gera pequeno efeito visual quando o usuário sobe de pontos
  const triggerPoints = () => {
    setPointsAnim(true);
    setTimeout(() => setPointsAnim(false), 1000);
  };

  // Carrega uma dica ecológica aleatória quando a página carrega
  useEffect(() => {
    setEcoTip(getRandomEcoTip());
  }, []);

  // Definição dos cards de navegação para cada jogo da home
  const games = [
    {
      title: 'Quiz do Saber',
      description: 'Responda perguntas e aprenda brincando!',
      icon: BookOpen,
      path: '/quiz',
      color: 'from-purple-400 to-pink-400',
      borderColor: 'border-l-8 border-purple-500',
    },
    {
      title: 'Jogo da Reciclagem',
      description: 'Aprenda a separar o lixo corretamente!',
      icon: Recycle,
      path: '/reciclagem',
      color: 'from-green-400 to-teal-400',
      borderColor: 'border-l-8 border-green-500',
    },
    {
      title: 'Ranking',
      description: 'Veja sua posição no ranking!',
      icon: Trophy,
      path: '/ranking',
      color: 'from-yellow-400 to-orange-400',
      borderColor: 'border-l-8 border-yellow-500',
    },
    {
      title: 'Recompensas',
      description: 'Veja seus prêmios e desbloqueie novos!',
      icon: Trophy,
      path: '/recompensas',
      color: 'from-orange-400 to-red-400',
      borderColor: 'border-l-8 border-red-500',
    },
  ];
   
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
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
        
        {/* HEADER */}
        <div className="home-header">
          <div>
            <h1 className="home-title">
              ✨ Desafio do Saber
            </h1>
            <p className="home-subtitle">
              Olá, <span className="home-username">{user.name || "Edu"}</span>!
            </p>
            <p className="home-subtitle-small">
              Selecione qual aprendizagem:
            </p>
          </div>

          <div className="profile-mini" onClick={() => navigate("/perfil")}>            
            {user.selectedAvatar ? (
              <img
                src={user.selectedAvatar}
                alt="Avatar"
                className="profile-mini-avatar"
              />
            ) : (
              <div className="profile-mini-avatar profile-mini-avatar--fallback">
                {user.name?.charAt(0)}
              </div>
            )}
            <span>{user.name || "Edu"}</span>
          </div>
        </div>

        {/* BADGES */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "24px", justifyContent: "flex-start" }}>
          <div className="stat-pill">
            <span className="star">⭐</span>
            <span>{user.totalPoints || 0} pontos</span>
          </div>
          <div className="stat-pill">
            <span className="bolt">⚡</span>
            <span>{user.energy || 0} energia</span>
          </div>
        </div>

        {/* Lista de cards para navegar entre as páginas do app */}
        <div className="flex flex-col gap-4 mt-6">
          {games.map((game, index) => (
            <motion.div
              key={game.path}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.995 }}
              >
                <Link
                  to={game.path}
                  className="menu-card"
                  onClick={() => {
                    triggerPoints();
                    showToast('🎉 Você ganhou 10 pontos!');
                  }}
                >
                  <div className="list-left" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div className={`left-icon bg-gradient-to-br ${game.color}`}>
                      <game.icon className="icon-svg" />
                    </div>
                    <div className="list-text">
                      <h3>{game.title}</h3>
                      <p>{game.description}</p>
                    </div>
                  </div>

                  <span>→</span>
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bloco de dica ecológica exibida para o usuário */}
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

