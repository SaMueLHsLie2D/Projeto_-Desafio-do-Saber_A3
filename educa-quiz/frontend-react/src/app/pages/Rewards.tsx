import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../UserContext';
import { motion } from 'motion/react';
import { Home, Lock, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import confetti from 'canvas-confetti';

interface PokemonReward {
  id: number;
  name: string;
  imageUrl: string;
  pointsRequired: number;
}

const pokemonRewards: PokemonReward[] = [
  { id: 1, name: 'Bulbasaur', imageUrl: '', pointsRequired: 5 },
  { id: 4, name: 'Charmander', imageUrl: '', pointsRequired: 5 },
  { id: 7, name: 'Squirtle', imageUrl: '', pointsRequired: 5 },
  { id: 25, name: 'Pikachu', imageUrl: '', pointsRequired: 10 },
  { id: 39, name: 'Jigglypuff', imageUrl: '', pointsRequired: 10 },
  { id: 54, name: 'Psyduck', imageUrl: '', pointsRequired: 10 },
  { id: 133, name: 'Eevee', imageUrl: '', pointsRequired: 15 },
  { id: 143, name: 'Snorlax', imageUrl: '', pointsRequired: 15 },
  { id: 151, name: 'Mew', imageUrl: '', pointsRequired: 20 },
];

const backgroundRewards = [
  { id: 'bg-1', name: 'Floresta Mágica', gradient: 'from-green-400 via-emerald-500 to-teal-600', pointsRequired: 8 },
  { id: 'bg-2', name: 'Oceano Profundo', gradient: 'from-blue-400 via-cyan-500 to-blue-600', pointsRequired: 8 },
  { id: 'bg-3', name: 'Céu Estrelado', gradient: 'from-indigo-900 via-purple-900 to-pink-900', pointsRequired: 12 },
  { id: 'bg-4', name: 'Pôr do Sol', gradient: 'from-orange-400 via-red-500 to-pink-600', pointsRequired: 12 },
  { id: 'bg-5', name: 'Arco-Íris', gradient: 'from-red-400 via-yellow-400 to-green-400', pointsRequired: 18 },
  { id: 'bg-6', name: 'Galáxia', gradient: 'from-purple-900 via-blue-900 to-black', pointsRequired: 18 },
];

export default function Rewards() {
  // Contexto de usuário e ações para desbloquear e selecionar recompensas
  // Conecta a página de recompensas com o estado global do usuário
  const { user, unlockAvatar, unlockBackground, setAvatar, setBackground, spendPoints } = useUser();
  const [pokemonData, setPokemonData] = useState<PokemonReward[]>([]);
  const [loading, setLoading] = useState(true);

  // Carrega imagens de Pokémon para os cards de recompensa ao abrir a página
  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const promises = pokemonRewards.map(async (reward) => {
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${reward.id}`);
          const data = await response.json();
          return {
            ...reward,
            imageUrl: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
          };
        });
        const results = await Promise.all(promises);
        setPokemonData(results);
      } catch (error) {
        // Erro silenciosamente ao buscar Pokémon
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  // Clique no card de avatar: desbloqueia se tiver pontos ou desequipa se já estiver selecionado
  const handleAvatarClick = (reward: PokemonReward) => {
    const isSelected = user.selectedAvatar === reward.imageUrl;
    const unlocked = isAvatarUnlocked(reward.imageUrl);
    const canBuy = user.totalPoints >= reward.pointsRequired;

    if (isSelected) {
      setAvatar(null);
      return;
    }

    if (!unlocked) {
      if (!canBuy) return;
      unlockAvatar(reward.imageUrl);
      spendPoints(reward.pointsRequired);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    setAvatar(reward.imageUrl);
  };

  // Clique no card de fundo: desbloqueia ou alterna a seleção do fundo
  const handleBackgroundClick = (reward: typeof backgroundRewards[0]) => {
    const isSelected = user.selectedBackground === reward.gradient;
    const unlocked = isBackgroundUnlocked(reward.gradient);
    const canBuy = user.totalPoints >= reward.pointsRequired;

    if (isSelected) {
      setBackground(null);
      return;
    }

    if (!unlocked) {
      if (!canBuy) return;
      unlockBackground(reward.gradient);
      spendPoints(reward.pointsRequired);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    setBackground(reward.gradient);
  };

  const isAvatarUnlocked = (imageUrl: string) => user.unlockedAvatars.includes(imageUrl);
  const isBackgroundUnlocked = (gradient: string) => user.unlockedBackgrounds.includes(gradient);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="main-box rewards-container page-card">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <Link to="/home" className="inline-block">
            <Button variant="outline" className="bg-white">
              <Home className="size-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div className="rewards-score-badge bg-white rounded-full px-5 py-3 shadow-lg text-xl font-bold text-orange-600">
            ⭐ {user.totalPoints} pontos
          </div>
        </div>

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="rewards-header text-center mb-8"
        >
          <h1 className="page-title">
            Recompensas 🎁
          </h1>
          <p className="page-subtitle">Desbloqueie itens incríveis!</p>
        </motion.div>

        <div className="rewards-tabs-wrapper mb-8">
          <Tabs defaultValue="avatars" className="w-full">
            <TabsList className="rewards-tabs-list mx-auto grid w-full max-w-md grid-cols-2 gap-2">
              <TabsTrigger value="avatars" className="text-lg">
                👤 Avatares
              </TabsTrigger>
              <TabsTrigger value="backgrounds" className="text-lg">
                🎨 Fundos
              </TabsTrigger>
            </TabsList>

            {/* Avatars */}
            <TabsContent value="avatars">
            {loading ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">⏳</div>
                <p className="text-xl text-gray-600">Carregando avatares...</p>
              </div>
            ) : (
              <div className="rewards-scroll-row">
                {pokemonData.map((reward, index) => {
                  const unlocked = isAvatarUnlocked(reward.imageUrl);
                  const canUnlock = user.totalPoints >= reward.pointsRequired;
                  const isSelected = user.selectedAvatar === reward.imageUrl;

                  return (
                    <motion.div
                      key={reward.id}
                      initial={{ scale: 0, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: canUnlock ? 1.03 : 1 }}
                      className="rewards-card-wrapper"
                    >
                      <div
                        className={`reward-card relative ${
                          isSelected ? 'reward-card-selected' : ''
                        }`}
                        onClick={() => handleAvatarClick(reward)}
                      >
                        {!unlocked && !canUnlock && (
                          <div className="reward-locked-overlay">
                            <Lock className="size-14 text-white" />
                            <p className="mt-3 text-white font-bold text-lg">{reward.pointsRequired}</p>
                            <span className="text-sm text-slate-300">pontos</span>
                          </div>
                        )}
                        <div className="reward-card-content">
                          <div className="reward-image avatar-image rounded-3xl mb-4 bg-slate-900 flex items-center justify-center overflow-hidden">
                            <img
                              src={reward.imageUrl}
                              alt={reward.name}
                              className="w-3/4 h-3/4 object-contain"
                            />
                          </div>
                          <h3 className="text-lg font-bold text-white text-center mb-1 capitalize">
                            {reward.name}
                          </h3>
                          <p className="text-center text-xs text-slate-300 mb-4">
                            Desbloqueia com {reward.pointsRequired} pontos
                          </p>
                          <Button
                            onClick={() => handleAvatarClick(reward)}
                            disabled={!canUnlock && !unlocked}
                            className={`w-full rounded-full text-sm ${
                              isSelected
                                ? 'bg-green-500 hover:bg-green-600'
                                : unlocked
                                ? 'bg-blue-500 hover:bg-blue-600'
                                : canUnlock
                                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
                                : 'bg-slate-500 cursor-not-allowed'
                            }`}
                          >
                            {isSelected ? 'Desequipar' : unlocked ? 'Equipar' : 'Desbloquear'}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Backgrounds */}
          <TabsContent value="backgrounds">
            <div className="rewards-scroll-row">
              {backgroundRewards.map((reward, index) => {
                const unlocked = isBackgroundUnlocked(reward.gradient);
                const canUnlock = user.totalPoints >= reward.pointsRequired;
                const isSelected = user.selectedBackground === reward.gradient;

                return (
                  <motion.div
                    key={reward.id}
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: canUnlock ? 1.03 : 1 }}
                    className="rewards-card-wrapper"
                  >
                    <div
                      className={`reward-card relative ${
                        isSelected ? 'reward-card-selected' : ''
                      }`}
                      onClick={() => handleBackgroundClick(reward)}
                    >
                      {!unlocked && !canUnlock && (
                        <div className="reward-locked-overlay">
                          <Lock className="size-14 text-white" />
                          <p className="mt-3 text-white font-bold text-lg">{reward.pointsRequired}</p>
                          <span className="text-sm text-slate-300">pontos</span>
                        </div>
                      )}
                      <div className="reward-card-content">
                        <div
                          className={`reward-image background-image rounded-3xl mb-4 bg-gradient-to-br ${reward.gradient}`}
                        />
                        <h3 className="text-lg font-bold text-white text-center mb-1">
                          {reward.name}
                        </h3>
                        <p className="text-center text-xs text-slate-300 mb-4">
                          Desbloqueia com {reward.pointsRequired} pontos
                        </p>
                        <Button
                          onClick={() => handleBackgroundClick(reward)}
                          disabled={!canUnlock && !unlocked}
                          className={`w-full rounded-full text-sm ${
                            isSelected
                              ? 'bg-green-500 hover:bg-green-600'
                              : unlocked
                              ? 'bg-blue-500 hover:bg-blue-600'
                              : canUnlock
                              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
                              : 'bg-slate-500 cursor-not-allowed'
                          }`}
                        >
                          {isSelected ? 'Desequipar' : unlocked ? 'Equipar' : 'Desbloquear'}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
        </div>
        {/* Progress Info */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-white rounded-3xl p-8 shadow-xl text-center"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Continue jogando para desbloquear mais recompensas! 🎮
          </h3>
          <p className="text-lg text-gray-600">
            Você já desbloqueou <strong>{user.unlockedAvatars.length}</strong> avatares e{' '}
            <strong>{user.unlockedBackgrounds.length}</strong> fundos!
          </p>
        </motion.div>
      </div>
    </div>
  );
}