import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useUser } from '../UserContext';
import { questions } from '../data/questions';
import { Question } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Sparkles, Volume2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import confetti from 'canvas-confetti';

export default function Quiz() {
  const { addPoints, addEnergy } = useUser();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const categories = [
    { id: 'matematica', name: '🔢 Matemática', color: 'from-blue-400 to-blue-600' },
    { id: 'portugues', name: '📚 Português', color: 'from-green-400 to-green-600' },
    { id: 'ciencias', name: '🔬 Ciências', color: 'from-purple-400 to-purple-600' },
  ];

  const levels = [
    { id: 'facil', name: '😊 Fácil', color: 'from-green-400 to-green-500' },
    { id: 'medio', name: '🤔 Médio', color: 'from-yellow-400 to-yellow-500' },
    { id: 'dificil', name: '🔥 Difícil', color: 'from-red-400 to-red-500' },
  ];

  useEffect(() => {
    if (selectedCategory && selectedLevel) {
      const filtered = questions.filter(
        q => q.category === selectedCategory && q.level === selectedLevel
      );
      setCurrentQuestions(filtered);
      setCurrentQuestionIndex(0);
      setScore(0);
      setQuizCompleted(false);
    }
  }, [selectedCategory, selectedLevel]);

  const currentQuestion = currentQuestions[currentQuestionIndex];

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult || !currentQuestion) return;
    setSelectedAnswer(answerIndex);
    setShowResult(true);

    if (answerIndex === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
      addPoints(1);
      addEnergy(10); // Adiciona 10 de energia por acerto
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestart = () => {
    setSelectedCategory(null);
    setSelectedLevel(null);
    setCurrentQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizCompleted(false);
  };

  const speakQuestion = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  // Seleção de Categoria
  if (!selectedCategory) {
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
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-black mb-4" style={{ fontFamily: 'Bangers, cursive', color: '#9333ea' }}>
              Quiz do Saber
            </h1>
            <p className="text-2xl text-gray-700">Escolha uma categoria:</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`bg-gradient-to-br ${category.color} rounded-2xl p-6 shadow-lg text-white`}
              >
                <div className="text-4xl mb-3">{category.name.split(' ')[0]}</div>
                <div className="text-xl font-bold">{category.name.split(' ')[1]}</div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Seleção de Nível
  if (!selectedLevel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
        <div className="main-box">
          <Button
            variant="outline"
            onClick={() => setSelectedCategory(null)}
            className="mb-6 bg-white"
          >
            <Home className="size-4 mr-2" />
            Voltar
          </Button>

          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
              Escolha o Nível 🎮
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {levels.map((level, index) => (
              <motion.button
                key={level.id}
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedLevel(level.id)}
                className={`bg-gradient-to-br ${level.color} rounded-2xl p-6 shadow-lg text-white`}
              >
                <div className="text-4xl mb-3">{level.name.split(' ')[0]}</div>
                <div className="text-xl font-bold">{level.name.split(' ').slice(1).join(' ')}</div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Sem perguntas disponíveis
  if (selectedCategory && selectedLevel && currentQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
        <div className="main-box text-center">
          <div className="text-7xl mb-6">😅</div>
          <h2 className="text-4xl font-black text-purple-600 mb-4">
            Ops! Sem perguntas disponíveis
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Não há perguntas cadastradas para esta categoria e nível.
          </p>
          <Button
            onClick={handleRestart}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl px-8 py-6"
          >
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  // Quiz Concluído
  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-8 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-3xl p-12 shadow-2xl text-center max-w-2xl"
        >
          <div className="text-8xl mb-6">🎉</div>
          <h2 className="text-4xl font-black text-purple-600 mb-4">
            Quiz Concluído!
          </h2>
          <p className="text-3xl font-bold text-gray-700 mb-2">
            Você acertou {score} de {currentQuestions.length}
          </p>
          <p className="text-xl text-gray-600 mb-8">
            Ganhou {score} pontos! ⭐
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={handleRestart}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl px-8 py-6"
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
        </motion.div>
      </div>
    );
  }

  // Quiz em Andamento
  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="outline"
            onClick={handleRestart}
            className="bg-white"
          >
            <Home className="size-4 mr-2" />
            Sair
          </Button>
          <div className="bg-white rounded-full px-6 py-3 shadow-lg">
            <span className="font-bold text-purple-600">
              Pergunta {currentQuestionIndex + 1}/{currentQuestions.length}
            </span>
          </div>
          <div className="bg-white rounded-full px-6 py-3 shadow-lg">
            <span className="font-bold text-orange-500">⭐ {score} pontos</span>
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="bg-white rounded-3xl p-8 shadow-2xl mb-6"
          >
            <div className="flex items-start gap-4 mb-6">
              <h2 className="text-3xl font-bold text-gray-800 flex-1">
                {currentQuestion.question}
              </h2>
              <button
                onClick={() => speakQuestion(currentQuestion.question)}
                className="bg-purple-100 hover:bg-purple-200 rounded-full p-4 transition-colors"
              >
                <Volume2 className="size-6 text-purple-600" />
              </button>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === currentQuestion.correctAnswer;
                const showFeedback = showResult && isSelected;

                let buttonClass = 'bg-gray-100 hover:bg-gray-200 border-4 border-transparent';
                
                if (showResult) {
                  if (isCorrect) {
                    buttonClass = 'bg-green-100 border-green-500';
                  } else if (isSelected && !isCorrect) {
                    buttonClass = 'bg-red-100 border-red-500';
                  }
                }

                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: showResult ? 1 : 1.02 }}
                    whileTap={{ scale: showResult ? 1 : 0.98 }}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showResult}
                    className={`${buttonClass} rounded-2xl p-6 text-xl font-bold text-gray-800 transition-all`}
                  >
                    {option}
                  </motion.button>
                );
              })}
            </div>

            {/* Feedback */}
            {showResult && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`mt-6 p-6 rounded-2xl ${
                  selectedAnswer === currentQuestion.correctAnswer
                    ? 'bg-green-100 border-4 border-green-500'
                    : 'bg-red-100 border-4 border-red-500'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">
                    {selectedAnswer === currentQuestion.correctAnswer ? '✅' : '❌'}
                  </span>
                  <p className="text-2xl font-bold text-gray-800">
                    {selectedAnswer === currentQuestion.correctAnswer
                      ? 'Parabéns!'
                      : 'Ops! Tente novamente na próxima!'}
                  </p>
                </div>
                <p className="text-lg text-gray-700">{currentQuestion.explanation}</p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Next Button */}
        {showResult && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center"
          >
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl px-12 py-6"
            >
              {currentQuestionIndex < currentQuestions.length - 1
                ? 'Próxima Pergunta ➡️'
                : 'Ver Resultado 🎉'}
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}