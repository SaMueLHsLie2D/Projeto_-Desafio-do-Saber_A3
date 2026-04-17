import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Home } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 flex items-center justify-center p-8">
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        className="bg-white rounded-3xl p-12 shadow-2xl text-center max-w-2xl"
      >
        <div className="text-9xl mb-6">🤔</div>
        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
          Opa!
        </h1>
        <p className="text-3xl font-bold text-gray-700 mb-2">
          Página não encontrada
        </p>
        <p className="text-xl text-gray-600 mb-8">
          Parece que você se perdeu na aventura! 😅
        </p>
        <Link to="/">
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl px-8 py-6">
            <Home className="size-5 mr-2" />
            Voltar para Casa
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
