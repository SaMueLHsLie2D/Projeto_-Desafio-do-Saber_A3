import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../UserContext';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import '../../App.css';
import { API_URL } from '../../services/api';

// ─── Mesmas funções de cor da Home ───────────────────────────────────────────

function hexToHarmoniousGradient(hex: string): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), delta = max - min;
  let h = 0;
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
  }
  h = Math.round(h * 60); if (h < 0) h += 360;
  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  const sP = Math.round(s * 100), lP = Math.round(l * 100);
  return `linear-gradient(135deg, hsl(${h},${sP}%,${Math.min(lP+10,80)}%) 0%, hsl(${(h+20)%360},${Math.min(sP+5,100)}%,${Math.min(lP+22,88)}%) 50%, hsl(${(h+40)%360},${Math.max(sP-10,30)}%,${Math.min(lP+35,94)}%) 100%)`;
}

function hexToSoftColor(hex: string): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), delta = max - min;
  let h = 0;
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
  }
  h = Math.round(h * 60); if (h < 0) h += 360;
  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  return `hsl(${h}, ${Math.round(Math.min(s*100,60))}%, ${Math.max(Math.min(Math.round(l*100),52),42)}%)`;
}

function hexToLightBg(hex: string): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), delta = max - min;
  let h = 0;
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
  }
  h = Math.round(h * 60); if (h < 0) h += 360;
  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  return `hsl(${h}, ${Math.round(Math.min(s*100,40))}%, 93%)`;
}

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}

interface QuizApiResponse {
  quizId: number;
  questions: QuizQuestion[];
}

interface QuizPointsPayload {
  quizId: number;
  score: number;
}

interface PerfilData {
  name: string;
  avatar: string;
  color: string;
  score: number;
}

// ─── Constantes ──────────────────────────────────────────────────────────────

const POINTS_MAP: Record<string, number> = {
  facil: 3, medio: 6, dificil: 9,
};

// ─── Componente ──────────────────────────────────────────────────────────────

export default function Quiz() {
  const { user, addPoints, addEnergy } = useUser();

  // Perfil / cores
  const [perfil, setPerfil] = useState<PerfilData | null>(null);

  // Quiz state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel,    setSelectedLevel]     = useState<string | null>(null);
  const [quizId,           setQuizId]            = useState<number | null>(null);
  const [currentQuestions, setCurrentQuestions]  = useState<QuizQuestion[]>([]);
  const [loadingQuestions, setLoadingQuestions]  = useState(false);
  const [fetchError,       setFetchError]        = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer,       setSelectedAnswer]       = useState<number | null>(null);
  const [showResult,           setShowResult]           = useState(false);
  const [score,                setScore]                = useState(0);
  const [quizCompleted,        setQuizCompleted]        = useState(false);
  const [savingPoints,         setSavingPoints]         = useState(false);

  const token      = localStorage.getItem('token');
  const authHeader = { Authorization: `Bearer ${token}` };

  // Cores derivadas — fallback roxo se perfil ainda não carregou
  const accentColor = perfil?.color ? hexToSoftColor(perfil.color) : '#7c3aed';
  const lightBg     = perfil?.color ? hexToLightBg(perfil.color)   : '#f3f0ff';
  const btnGradient = perfil?.color
    ? `linear-gradient(90deg, ${perfil.color} 0%, ${accentColor} 100%)`
    : 'linear-gradient(90deg,#7c3aed,#ec4899)';

  // ── Busca perfil e aplica fundo ao montar ──────────────────────────────────
  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const res = await fetch(`${API_URL}/user/perfil`, {
          headers: { ...authHeader, 'Content-Type': 'application/json' },
        });
        if (!res.ok) return;
        const data: PerfilData = await res.json();
        setPerfil(data);
        const root = document.getElementById('root');
        if (root && data.color) {
          root.style.background = hexToHarmoniousGradient(data.color);
          root.style.minHeight  = '100vh';
        }
      } catch { /* silencioso */ }
    };
    fetchPerfil();
  }, []);

  // ── Busca perguntas quando categoria + nível selecionados ─────────────────
  useEffect(() => {
    if (!selectedCategory || !selectedLevel) return;
    const fetchQuestions = async () => {
      setLoadingQuestions(true);
      setFetchError('');
      setCurrentQuestions([]);
      setQuizId(null);
      setCurrentQuestionIndex(0);
      setScore(0);
      setQuizCompleted(false);
      try {
        const res = await fetch(
          `${API_URL}/quiz/${encodeURIComponent(selectedCategory)}/${encodeURIComponent(selectedLevel)}?count=5`,
          { headers: authHeader }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: QuizApiResponse = await res.json();
        setQuizId(data.quizId);
        setCurrentQuestions(data.questions ?? []);
      } catch (err) {
        console.error('Erro ao carregar quiz:', err);
        setFetchError('Não foi possível carregar as perguntas. Tente novamente.');
      } finally {
        setLoadingQuestions(false);
      }
    };
    fetchQuestions();
  }, [selectedCategory, selectedLevel]);

  // ── Salva pontuação no backend ao final ───────────────────────────────────
  const savePointsToBackend = async (finalScore: number) => {
    if (quizId === null) return;
    const payload: QuizPointsPayload = { quizId, score: finalScore };
    setSavingPoints(true);
    try {
      const res = await fetch(`${API_URL}/quiz/pontos`, {
        method: 'PUT',
        headers: { ...authHeader, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      console.log('Pontuação salva:', data.totalScore);
    } catch (err) {
      console.warn('Falha ao salvar pontuação no backend:', err);
    } finally {
      setSavingPoints(false);
    }
  };

  const currentQuestion = currentQuestions[currentQuestionIndex];

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult || !currentQuestion) return;
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    if (answerIndex === currentQuestion.correct) {
      const pts = POINTS_MAP[selectedLevel ?? 'facil'] ?? 3;
      setScore(prev => prev + pts);
      addPoints(1);
      addEnergy(10);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setScore(prev => { savePointsToBackend(prev); return prev; });
      setQuizCompleted(true);
    }
  };

  const handleRestart = () => {
    setSelectedCategory(null); setSelectedLevel(null);
    setCurrentQuestions([]); setCurrentQuestionIndex(0);
    setSelectedAnswer(null); setShowResult(false);
    setScore(0); setQuizCompleted(false); setFetchError(''); setQuizId(null);
  };

  const speakQuestion = (text: string) => {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'pt-BR'; u.rate = 0.9;
      speechSynthesis.speak(u);
    }
  };

  // ── Botão padrão reutilizável ─────────────────────────────────────────────
  const BtnBack = ({ onClick, label = '← Voltar' }: { onClick?: () => void; label?: string }) => (
    onClick
      ? <button
          type="button"
          onClick={onClick}
          className="back-button"
          style={{ marginBottom: '20px' }}
        >
          {label}
        </button>
      : <Link to="/home">
          <button
            type="button"
            className="back-button"
            style={{ marginBottom: '20px' }}
          >
            {label}
          </button>
        </Link>
  );

  // ── TELA: escolha de categoria ────────────────────────────────────────────
  if (!selectedCategory) return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="main-box w-full max-w-lg">
        <BtnBack />
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: accentColor, margin: 0 }}>Quiz do Saber</h1>
          <p style={{ color: '#6b7280', marginTop: '6px', fontSize: '0.95rem' }}>Escolha uma categoria:</p>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
          {[
            { id: 'mat',      emoji: '🔢', label: 'Matemática' },
            { id: 'port',     emoji: '📚', label: 'Português'  },
            { id: 'ciencias', emoji: '🔬', label: 'Ciências'   },
          ].map((c, i) => (
            <motion.button
              key={c.id}
              initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: i * 0.1 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(c.id)}
              style={{
                background: lightBg, border: `2px solid ${accentColor}22`,
                borderRadius: '20px', padding: '24px 12px',
                cursor: 'pointer', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '10px',
              }}
            >
              <span style={{ fontSize: '2.2rem' }}>{c.emoji}</span>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: accentColor }}>{c.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );

  // ── TELA: escolha de nível ────────────────────────────────────────────────
  if (!selectedLevel) return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="main-box w-full max-w-lg">
        <BtnBack onClick={() => setSelectedCategory(null)} label="Voltar" />
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: accentColor, margin: 0 }}>Escolha o Nível 🎮</h1>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
          {[
            { id: 'facil',   emoji: '😊', label: 'Fácil'   },
            { id: 'medio',   emoji: '🤔', label: 'Médio'   },
            { id: 'dificil', emoji: '🔥', label: 'Difícil' },
          ].map((l, i) => (
            <motion.button
              key={l.id}
              initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: i * 0.1 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedLevel(l.id)}
              style={{
                background: lightBg, border: `2px solid ${accentColor}22`,
                borderRadius: '20px', padding: '24px 12px',
                cursor: 'pointer', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '10px',
              }}
            >
              <span style={{ fontSize: '2.2rem' }}>{l.emoji}</span>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: accentColor }}>{l.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );

  // ── TELA: loading ─────────────────────────────────────────────────────────
  if (loadingQuestions) return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="main-box w-full max-w-md text-center">
        <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>⏳</div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: accentColor }}>Carregando perguntas...</h2>
      </div>
    </div>
  );

  // ── TELA: erro ────────────────────────────────────────────────────────────
  if (fetchError) return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="main-box w-full max-w-md text-center">
        <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>⚠️</div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ef4444', marginBottom: '16px' }}>{fetchError}</h2>
        <button onClick={handleRestart} style={{
          background: btnGradient, color: 'white', border: 'none',
          borderRadius: '14px', padding: '12px 28px', fontSize: '1rem',
          fontWeight: 700, cursor: 'pointer',
        }}>Tentar Novamente</button>
      </div>
    </div>
  );

  // ── TELA: sem perguntas ───────────────────────────────────────────────────
  if (currentQuestions.length === 0) return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="main-box w-full max-w-md text-center">
        <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>😅</div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: accentColor, marginBottom: '8px' }}>Sem perguntas disponíveis</h2>
        <p style={{ color: '#6b7280', marginBottom: '20px', fontSize: '0.9rem' }}>
          Não há perguntas cadastradas para esta categoria e nível.
        </p>
        <button onClick={handleRestart} style={{
          background: btnGradient, color: 'white', border: 'none',
          borderRadius: '14px', padding: '12px 28px', fontSize: '1rem',
          fontWeight: 700, cursor: 'pointer',
        }}>Escolher Outra Categoria</button>
      </div>
    </div>
  );

  // ── TELA: quiz concluído ──────────────────────────────────────────────────
  if (quizCompleted) {
    const acertos = Math.round(score / (POINTS_MAP[selectedLevel ?? 'facil'] ?? 3));
    const total   = currentQuestions.length;
    const perf = acertos === total
      ? { emoji: '🏆', titulo: 'Incrível!',            msg: 'Você acertou tudo! Continue assim, você é imbatível!' }
      : acertos >= 2
      ? { emoji: '👍', titulo: 'Muito bem!',            msg: 'Ótimo desempenho! Mas ainda dá para melhorar — continue praticando!' }
      : { emoji: '📚', titulo: 'Continue estudando!',   msg: 'Parabéns por finalizar! Estude mais e tente novamente para melhorar cada vez mais.' };

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="main-box w-full max-w-md text-center"
        >
          <div style={{ fontSize: '4rem', marginBottom: '10px' }}>{perf.emoji}</div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: accentColor, marginBottom: '6px' }}>{perf.titulo}</h2>
          <p style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: '6px' }}>
            Você acertou {acertos} de {total}
          </p>
          <p style={{ fontSize: '0.88rem', color: '#6b7280', marginBottom: '20px' }}>{perf.msg}</p>

          <div style={{
            background: lightBg, borderRadius: '20px',
            padding: '16px', marginBottom: '20px',
            border: `1px solid ${accentColor}33`,
          }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: accentColor, marginBottom: '6px' }}>Pontuação Final</p>
            <span style={{ fontSize: '2.2rem', fontWeight: 900, color: accentColor }}>{score} ⭐</span>
            {savingPoints && (
              <p style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: '4px' }}>Salvando pontuação...</p>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button onClick={handleRestart} style={{
              borderRadius: '14px', background: btnGradient,
              color: '#fff', fontSize: '1rem', fontWeight: 700,
              padding: '12px 0', border: 'none', cursor: 'pointer', width: '100%',
            }}>🔄 Jogar Novamente</button>
            <Link to="/home" style={{ width: '100%' }}>
              <button style={{
                borderRadius: '14px', background: 'white',
                color: accentColor, fontSize: '1rem', fontWeight: 700,
                padding: '12px 0', border: `1.5px solid ${accentColor}44`,
                cursor: 'pointer', width: '100%',
              }}>🏠 Menu Principal</button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  // ── TELA: pergunta ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="main-box w-full max-w-2xl">

        {/* Barra de controles */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#6b7280' }}>
            Pergunta {currentQuestionIndex + 1} de {currentQuestions.length}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={handleRestart} style={{
              background: 'white', border: `1.5px solid ${accentColor}44`,
              borderRadius: '10px', padding: '5px 14px',
              fontSize: '13px', fontWeight: 700, color: accentColor, cursor: 'pointer',
            }}>Sair</button>
            <div style={{
              background: lightBg, border: `1.5px solid ${accentColor}44`,
              borderRadius: '999px', padding: '4px 12px',
              fontSize: '13px', fontWeight: 700, color: accentColor,
            }}>⭐ {score} pontos</div>
          </div>
        </div>

        {/* Barra de progresso */}
        <div style={{ background: '#f1f5f9', borderRadius: '999px', height: '8px', overflow: 'hidden', marginBottom: '20px' }}>
          <motion.div
            animate={{ width: `${Math.round(((currentQuestionIndex + 1) / currentQuestions.length) * 100)}%` }}
            transition={{ duration: 0.4 }}
            style={{ height: '100%', borderRadius: '999px', background: btnGradient }}
          />
        </div>

        {/* Pergunta */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -300, opacity: 0 }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1f2937', flex: 1, margin: 0 }}>
                {currentQuestion.question}
              </h2>
              <button
                onClick={() => speakQuestion(currentQuestion.question)}
                style={{
                  background: lightBg, border: 'none', borderRadius: '50%',
                  width: '40px', height: '40px', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', flexShrink: 0,
                }}
              >
                <Volume2 size={18} color={accentColor} />
              </button>
            </div>

            {/* Opções */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {currentQuestion.options.map((option, index) => {
                const isCorrect = index === currentQuestion.correct;
                let bg = '#f9fafb', border = '2px solid #e5e7eb', color = '#1f2937';
                if (showResult) {
                  if (isCorrect)                    { bg = '#dcfce7'; border = '2px solid #22c55e'; color = '#15803d'; }
                  else if (selectedAnswer === index) { bg = '#fee2e2'; border = '2px solid #ef4444'; color = '#dc2626'; }
                }
                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: showResult ? 1 : 1.02 }}
                    whileTap={{ scale: showResult ? 1 : 0.98 }}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showResult}
                    style={{
                      background: bg, border, color,
                      borderRadius: '14px', padding: '14px 16px',
                      fontSize: '0.95rem', fontWeight: 700,
                      cursor: showResult ? 'default' : 'pointer',
                      textAlign: 'left', transition: 'all 0.15s',
                    }}
                  >
                    {option}
                  </motion.button>
                );
              })}
            </div>

            {/* Feedback */}
            {showResult && (
              <motion.div
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                style={{
                  marginTop: '16px', padding: '14px 16px', borderRadius: '14px',
                  background: selectedAnswer === currentQuestion.correct ? '#f0fdf4' : '#fef2f2',
                  border: `2px solid ${selectedAnswer === currentQuestion.correct ? '#22c55e' : '#ef4444'}`,
                  display: 'flex', alignItems: 'center', gap: '10px',
                }}
              >
                <span style={{ fontSize: '1.4rem' }}>
                  {selectedAnswer === currentQuestion.correct ? '✅' : '❌'}
                </span>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: '#1f2937' }}>
                    {selectedAnswer === currentQuestion.correct ? 'Parabéns!' : 'Ops! Tente novamente na próxima!'}
                  </p>
                  {currentQuestion.explanation && (
                    <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: '#6b7280' }}>
                      {currentQuestion.explanation}
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Botão próxima */}
        {showResult && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ marginTop: '16px', textAlign: 'center' }}>
            <button onClick={handleNext} style={{
              background: btnGradient, color: 'white',
              border: 'none', borderRadius: '14px',
              padding: '12px 32px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
            }}>
              {currentQuestionIndex < currentQuestions.length - 1 ? 'Próxima Pergunta ➡️' : 'Ver Resultado 🎉'}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}