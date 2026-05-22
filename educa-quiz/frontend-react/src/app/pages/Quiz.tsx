import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../UserContext';
import { questions } from '../data/questions';
import { Question } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Sparkles, Volume2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import confetti from 'canvas-confetti';
import '../../App.css';

export default function Quiz() {
  // Contexto do usuário para pontos e energia
  const { user, addPoints, addEnergy } = useUser();
  // Estado local do quiz: categoria, nível e perguntas carregadas
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

  // Quando categoria e nível são selecionados, filtramos as perguntas correspondentes
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

  // Avança para a próxima pergunta ou finaliza o quiz
  const handleNext = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
    }
  };

  // Reinicia o quiz e volta para a seleção de categoria
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

  // Função para ler em voz alta o texto da pergunta
  const speakQuestion = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  // Etapa 1: seleção de categoria do quiz
  if (!selectedCategory) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="main-box page-card">
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
            <h1 className="page-title">
              Quiz do Saber
            </h1>
            <p className="page-subtitle">Escolha uma categoria:</p>
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
                className={`quiz-button bg-gradient-to-br ${category.color} rounded-2xl p-6 shadow-lg text-white`}
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

  // Etapa 2: seleção do nível de dificuldade
  if (!selectedLevel) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="main-box page-card">
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
            <h1 className="page-title">
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
                className={`quiz-button bg-gradient-to-br ${level.color} rounded-2xl p-6 shadow-lg text-white`}
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

  // Etapa de erro: não há perguntas para a categoria e nível selecionados
  if (selectedCategory && selectedLevel && currentQuestions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="main-box page-card text-center">
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

  // Etapa final: exibição do resultado do quiz
  if (quizCompleted) {
    return (
      <div
        style={{
          minHeight: '100vh',
          padding: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #eef2ff 0%, #f5f3ff 45%, #fce7f3 100%)',
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            background: 'rgba(255,255,255,0.96)',
            backdropFilter: 'blur(14px)',
            border: '1px solid rgba(139, 92, 246, 0.12)',
            borderRadius: '32px',
            padding: '3rem',
            boxShadow: '0 30px 70px rgba(124, 58, 237, 0.18)',
            textAlign: 'center',
            maxWidth: '38rem',
            width: '100%',
          }}
        >
          <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🎉</div>
          <h2 style={{ fontSize: '2.75rem', fontWeight: 900, color: '#6d28d9', marginBottom: '1rem' }}>
            Quiz Concluído!
          </h2>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', marginBottom: '0.75rem' }}>
            Você acertou {score} de {currentQuestions.length}
          </p>
          <p style={{ fontSize: '1.05rem', color: '#4b5563', marginBottom: '2.25rem' }}>
            Parabéns pelo seu desempenho no quiz. Continue praticando para subir ainda mais de nível!
          </p>
          <div
            style={{
              background: '#f5f3ff',
              borderRadius: '28px',
              padding: '1.4rem 1.75rem',
              marginBottom: '2rem',
              border: '1px solid rgba(167, 139, 250, 0.28)',
              boxShadow: 'inset 0 1px 3px rgba(134, 239, 172, 0.12)',
            }}
          >
            <p style={{ fontSize: '1.05rem', fontWeight: 700, color: '#6d28d9', marginBottom: '0.65rem' }}>
              Pontuação Final
            </p>
            <span style={{ fontSize: '3rem', fontWeight: 900, color: '#312e81' }}>
              {score} ⭐
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <Button
              onClick={handleRestart}
              style={{
                borderRadius: '9999px',
                background: 'linear-gradient(90deg, #7c3aed 0%, #ec4899 100%)',
                color: '#ffffff',
                fontSize: '1.05rem',
                padding: '1rem 2.25rem',
                boxShadow: '0 18px 40px rgba(124, 58, 237, 0.18)',
              }}
            >
              Jogar Novamente
            </Button>
            <Link to="/home" style={{ width: '100%' }}>
              <Button
                variant="outline"
                style={{
                  width: '100%',
                  borderRadius: '9999px',
                  padding: '1rem 2.25rem',
                  fontSize: '1.05rem',
                }}
              >
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
    <div className="min-h-screen p-8">
      <div className="main-box max-w-4xl mx-auto">
        {/* Header: progress pill with points */}
        <div className="mb-6 flex justify-center">
          <div className="quiz-top-pill w-full max-w-4xl">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-slate-700 font-bold">Pergunta {currentQuestionIndex + 1} de {currentQuestions.length}</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleRestart} className="bg-white px-3 py-1">Sair</Button>
                <div className="quiz-points-badge">
                  <span className="font-bold">⭐ {score} pontos</span>
                </div>
              </div>
            </div>
            <div className="quiz-progress-bar">
              <div className="quiz-progress" style={{ width: `${Math.round(((currentQuestionIndex + 1) / currentQuestions.length) * 100)}%` }} />
            </div>
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="quiz-question-card mb-6"
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
                    buttonClass = 'quiz-answer-correct';
                  } else if (isSelected && !isCorrect) {
                    buttonClass = 'quiz-answer-wrong';
                  }
                }

                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: showResult ? 1 : 1.02 }}
                    whileTap={{ scale: showResult ? 1 : 0.98 }}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showResult}
                    className={`${buttonClass} quiz-answer-button rounded-2xl p-6 text-xl font-bold transition-all`}
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