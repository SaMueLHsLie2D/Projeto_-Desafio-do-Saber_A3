import { useState } from 'react';
import { Link } from 'react-router';
import { useUser } from '../UserContext';
import { motion } from 'motion/react';
import { Home, Edit2, Save } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export default function Profile() {
  const { user, updateUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [age, setAge] = useState(user.age);

  const handleSave = () => {
    updateUser({ name, age });
    setIsEditing(false);
  };

  const backgroundClass = user.selectedBackground
    ? `bg-gradient-to-br ${user.selectedBackground}`
    : 'bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100';

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
            Meu Perfil 👤
          </h1>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Avatar Section */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-12 text-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-block"
            >
              <div className="bg-white rounded-full p-4 shadow-xl inline-block mb-4">
                {user.selectedAvatar ? (
                  <img
                    src={user.selectedAvatar}
                    alt="Avatar"
                    className="w-32 h-32 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-6xl">
                    👤
                  </div>
                )}
              </div>
            </motion.div>
            <h2 className="text-4xl font-black text-white mb-2">{user.name}</h2>
            <p className="text-xl text-white opacity-90">{user.age} anos</p>
          </div>

          {/* Stats Section */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl p-6 text-center">
                <div className="text-5xl mb-2">⭐</div>
                <div className="text-3xl font-black text-orange-600">{user.totalPoints}</div>
                <div className="text-lg text-gray-700">Pontos Totais</div>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-6 text-center">
                <div className="text-5xl mb-2">👤</div>
                <div className="text-3xl font-black text-purple-600">{user.unlockedAvatars.length}</div>
                <div className="text-lg text-gray-700">Avatares</div>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-teal-100 rounded-2xl p-6 text-center">
                <div className="text-5xl mb-2">🎨</div>
                <div className="text-3xl font-black text-teal-600">{user.unlockedBackgrounds.length}</div>
                <div className="text-lg text-gray-700">Fundos</div>
              </div>
            </div>

            {/* Edit Form */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Informações Pessoais</h3>
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="bg-white"
                  >
                    <Edit2 className="size-4 mr-2" />
                    Editar
                  </Button>
                ) : (
                  <Button
                    onClick={handleSave}
                    className="bg-gradient-to-r from-green-500 to-teal-500"
                  >
                    <Save className="size-4 mr-2" />
                    Salvar
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-lg font-semibold text-gray-700">
                    Nome
                  </Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-2 text-lg"
                      placeholder="Digite seu nome"
                    />
                  ) : (
                    <div className="mt-2 text-lg text-gray-800 bg-white rounded-lg p-3">
                      {user.name}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="age" className="text-lg font-semibold text-gray-700">
                    Idade
                  </Label>
                  {isEditing ? (
                    <Input
                      id="age"
                      type="number"
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="mt-2 text-lg"
                      placeholder="Digite sua idade"
                      min="5"
                      max="12"
                    />
                  ) : (
                    <div className="mt-2 text-lg text-gray-800 bg-white rounded-lg p-3">
                      {user.age} anos
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="mt-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                Conquistas 🏆
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`${user.totalPoints >= 5 ? 'opacity-100' : 'opacity-30'} bg-white rounded-xl p-4 text-center`}>
                  <div className="text-4xl mb-2">🌟</div>
                  <div className="text-sm font-bold">Iniciante</div>
                  <div className="text-xs text-gray-600">5 pontos</div>
                </div>
                <div className={`${user.totalPoints >= 10 ? 'opacity-100' : 'opacity-30'} bg-white rounded-xl p-4 text-center`}>
                  <div className="text-4xl mb-2">⭐</div>
                  <div className="text-sm font-bold">Estudioso</div>
                  <div className="text-xs text-gray-600">10 pontos</div>
                </div>
                <div className={`${user.totalPoints >= 20 ? 'opacity-100' : 'opacity-30'} bg-white rounded-xl p-4 text-center`}>
                  <div className="text-4xl mb-2">🏆</div>
                  <div className="text-sm font-bold">Expert</div>
                  <div className="text-xs text-gray-600">20 pontos</div>
                </div>
                <div className={`${user.totalPoints >= 50 ? 'opacity-100' : 'opacity-30'} bg-white rounded-xl p-4 text-center`}>
                  <div className="text-4xl mb-2">👑</div>
                  <div className="text-sm font-bold">Mestre</div>
                  <div className="text-xs text-gray-600">50 pontos</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-white rounded-3xl p-8 shadow-xl text-center"
        >
          <h3 className="text-2xl font-bold text-purple-600 mb-4">
            💡 Dica de Personalização
          </h3>
          <p className="text-lg text-gray-700">
            Continue jogando e acumulando pontos para desbloquear avatares incríveis e fundos personalizados!
            Visite a seção de <strong>Recompensas</strong> para ver o que você pode conquistar! 🎁
          </p>
        </motion.div>
      </div>
    </div>
  );
}