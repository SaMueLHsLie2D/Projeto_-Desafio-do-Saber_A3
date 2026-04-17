import { useState, useEffect } from 'react';
import { Link } from 'react-router';
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
  const { user, unlockAvatar, unlockBackground, setAvatar, setBackground, spendPoints } = useUser();
  const [pokemonData, setPokemonData] = useState<PokemonReward[]>([]);
  const [loading, setLoading] = useState(true);

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
        console.error('Erro ao buscar Pokémon:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  const handleUnlockAvatar = (reward: PokemonReward) => {
    if (user.totalPoints >= reward.pointsRequired) {
      if (!user.unlockedAvatars.includes(reward.imageUrl)) {
        unlockAvatar(reward.imageUrl);
        spendPoints(5); // Gasta 5 pontos ao desbloquear
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      setAvatar(reward.imageUrl);
    }
  };

  const handleUnlockBackground = (reward: typeof backgroundRewards[0]) => {
    if (user.totalPoints >= reward.pointsRequired) {
      if (!user.unlockedBackgrounds.includes(reward.gradient)) {
        unlockBackground(reward.gradient);
        spendPoints(5); // Gasta 5 pontos ao desbloquear
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      setBackground(reward.gradient);
    }
  };

  const isAvatarUnlocked = (imageUrl: string) => user.unlockedAvatars.includes(imageUrl);
  const isBackgroundUnlocked = (gradient: string) => user.unlockedBackgrounds.includes(gradient);

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
          <h1 className="text-5xl font-black text-purple-700 drop-shadow-md">
            Recompensas 🎁
          </h1>
          <p className="text-lg text-gray-700">Ganhe prêmios com seus pontos!</p>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="avatars" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                      whileHover={{ scale: canUnlock ? 1.05 : 1 }}
                    >
                      <div
                        className={`relative bg-white rounded-3xl p-6 shadow-xl ${
                          isSelected ? 'ring-4 ring-yellow-400' : ''
                        }`}
                      >
                        {!unlocked && !canUnlock && (
                          <div className="absolute inset-0 bg-gray-900 bg-opacity-70 rounded-3xl flex items-center justify-center z-10">
                            <div className="text-center text-white">
                              <Lock className="size-12 mx-auto mb-2" />
                              <p className="font-bold text-lg">{reward.pointsRequired} pontos</p>
                            </div>
                          </div>
                        )}
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-yellow-400 rounded-full p-2">
                            <Check className="size-5 text-white" />
                          </div>
                        )}
                        <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl mb-4 flex items-center justify-center overflow-hidden">
                          <img
                            src={reward.imageUrl}
                            alt={reward.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <h3 className="text-xl font-bold text-center text-gray-800 mb-2 capitalize">
                          {reward.name}
                        </h3>
                        <p className="text-center text-sm text-gray-600 mb-4">
                          ⭐ {reward.pointsRequired} pontos
                        </p>
                        <Button
                          onClick={() => handleUnlockAvatar(reward)}
                          disabled={!canUnlock}
                          className={`w-full ${
                            unlocked
                              ? 'bg-green-500 hover:bg-green-600'
                              : canUnlock
                              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
                              : 'bg-gray-300'
                          }`}
                        >
                          {isSelected ? 'Selecionado' : unlocked ? 'Selecionar' : 'Desbloquear'}
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Backgrounds */}
          <TabsContent value="backgrounds">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
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
                    whileHover={{ scale: canUnlock ? 1.05 : 1 }}
                  >
                    <div
                      className={`relative bg-white rounded-3xl p-6 shadow-xl ${
                        isSelected ? 'ring-4 ring-yellow-400' : ''
                      }`}
                    >
                      {!unlocked && !canUnlock && (
                        <div className="absolute inset-0 bg-gray-900 bg-opacity-70 rounded-3xl flex items-center justify-center z-10">
                          <div className="text-center text-white">
                            <Lock className="size-12 mx-auto mb-2" />
                            <p className="font-bold text-lg">{reward.pointsRequired} pontos</p>
                          </div>
                        </div>
                      )}
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-yellow-400 rounded-full p-2">
                          <Check className="size-5 text-white" />
                        </div>
                      )}
                      <div
                        className={`aspect-video bg-gradient-to-br ${reward.gradient} rounded-2xl mb-4`}
                      />
                      <h3 className="text-xl font-bold text-center text-gray-800 mb-2">
                        {reward.name}
                      </h3>
                      <p className="text-center text-sm text-gray-600 mb-4">
                        ⭐ {reward.pointsRequired} pontos
                      </p>
                      <Button
                        onClick={() => handleUnlockBackground(reward)}
                        disabled={!canUnlock}
                        className={`w-full ${
                          unlocked
                            ? 'bg-green-500 hover:bg-green-600'
                            : canUnlock
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
                            : 'bg-gray-300'
                        }`}
                      >
                        {isSelected ? 'Selecionado' : unlocked ? 'Selecionar' : 'Desbloquear'}
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

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