import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import { BookOpen, Recycle, Trophy } from 'lucide-react';
import { motion } from 'motion/react';
import { getRandomEcoTip } from '../data/ecoTips';
import { useState, useEffect } from 'react';
import { API_URL } from '../../services/api';

interface PerfilData {
  name: string;
  avatar: string;
  color: string;
  score: number;
  avatarId: number | null;
  colorId: number | null;
}

interface NextUnlockData {
  type: 'avatar' | 'color' | 'complete';
  name?: string;
  currentScore: number;
  targetScore: number;
  pointsNeeded?: number;
  message?: string;
}

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

// Cor bem clara da paleta para usar como fundo suave em cards
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
  return `hsl(${h}, ${Math.round(Math.min(s*100,40))}%, 95%)`;
}

export default function Home() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [ecoTip, setEcoTip] = useState('');
  const [toast, setToast] = useState('');
  const [pointsAnim, setPointsAnim] = useState(false);
  const [perfil, setPerfil] = useState<PerfilData | null>(null);
  const [perfilLoading, setPerfilLoading] = useState(true);
  const [nextUnlock, setNextUnlock] = useState<NextUnlockData | null>(null);

  const showToast = (message: string) => { setToast(message); setTimeout(() => setToast(''), 3000); };
  const triggerPoints = () => { setPointsAnim(true); setTimeout(() => setPointsAnim(false), 1000); };

    async function handleLogout() {
    const token = localStorage.getItem("token");
    try {
      await fetch(`${API_URL}/user/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // mesmo se o endpoint falhar, limpa o client
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  }

  useEffect(() => { setEcoTip(getRandomEcoTip()); }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        // Busca perfil e próxima conquista em paralelo
        const [perfilRes, conquistaRes] = await Promise.all([
          fetch(`${API_URL}/user/perfil`, { headers }),
          fetch(`${API_URL}/user/proxima-conquista`, { headers }),
        ]);

        if (perfilRes.ok) {
          const data: PerfilData = await perfilRes.json();
          setPerfil(data);
          if (data.color) {
            const root = document.getElementById('root');
            if (root) {
              root.style.background = hexToHarmoniousGradient(data.color);
              root.style.minHeight = '100vh';
            }
          }
        }

        if (conquistaRes.ok) {
          const data: NextUnlockData = await conquistaRes.json();
          setNextUnlock(data);
        }
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
      } finally {
        setPerfilLoading(false);
      }
    };

    fetchData();
  }, []);

  const games = [
    { title: 'Quiz do Saber', description: 'Responda perguntas e aprenda brincando!', icon: BookOpen, path: '/quiz', color: 'from-purple-400 to-pink-400' },
    { title: 'Jogo da Reciclagem', description: 'Aprenda a separar o lixo corretamente!', icon: Recycle, path: '/reciclagem', color: 'from-green-400 to-teal-400' },
    { title: 'Ranking', description: 'Veja sua posição no ranking!', icon: Trophy, path: '/ranking', color: 'from-yellow-400 to-orange-400' },
    { title: 'Recompensas', description: 'Veja seus prêmios e desbloqueie novos!', icon: Trophy, path: '/personalizar', color: 'from-orange-400 to-red-400' },
  ];

  const displayName = perfil?.name || user.name || 'Edu';
  const avatarBgColor = perfil?.color ?? '#6c47ff';
  const avatarUrl = perfil?.avatar || user.selectedAvatar || '';
  const softColor = perfil?.color ? hexToSoftColor(perfil.color) : '#7c3aed';
  const lightBg = perfil?.color ? hexToLightBg(perfil.color) : '#f3f0ff';

  // Porcentagem de progresso para a barra (entre 0 e 100)
  const progressPct = nextUnlock && nextUnlock.targetScore > 0
    ? Math.min(Math.round((nextUnlock.currentScore / nextUnlock.targetScore) * 100), 100)
    : 100;

  const conquistaIcon = nextUnlock?.type === 'avatar' ? '🧑‍🎨' : nextUnlock?.type === 'color' ? '🎨' : '🏆';

    return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative gap-0">

    {/* BOTÃO SAIR — canto superior direito */}
      <button
        onClick={handleLogout}
        className="z-50 flex items-center gap-2 rounded-full font-semibold shadow-lg transition-all hover:scale-105 active:scale-95"
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          left: 'auto',
          padding: '12px 20px',
          backgroundColor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          color: softColor || '#7c3aed',
          border: 'none',
          fontSize: '15px',
          fontWeight: '700',
          zIndex: 9999,
          boxShadow: '0 10px 30px rgba(0,0,0,0.10)',
          borderRadius: '999px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Sair
      </button>
   
      {pointsAnim && (
        <motion.div initial={{ y: 0, opacity: 1 }} animate={{ y: -50, opacity: 0 }} transition={{ duration: 1 }}
          className="fixed top-20 right-10 text-2xl font-bold text-yellow-400 z-50">
          +10 ⭐
        </motion.div>
      )}

      {toast && (
        <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 100, opacity: 0 }}
          className="fixed top-5 right-5 bg-purple-600 text-white px-6 py-3 rounded-xl shadow-xl z-50">
          {toast}
        </motion.div>
      )}

      <div className="main-box">
        {/* HEADER */}
        <div className="home-header">
          <div>
            <h1 className="home-title" style={{ color: softColor }}>✨ Desafio do Saber</h1>
            <p className="home-subtitle">
              Olá, <span className="home-username" style={{ color: softColor }}>{displayName}</span>!
            </p>
            <p className="home-subtitle-small">Selecione qual aprendizagem:</p>
          </div>

          <div className="profile-mini" onClick={() => navigate('/perfil')}>
            {perfilLoading ? (
              <div className="profile-mini-avatar profile-mini-avatar--fallback" style={{ backgroundColor: '#d1d5db' }}>…</div>
            ) : avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="profile-mini-avatar" />
            ) : (
              <div className="profile-mini-avatar profile-mini-avatar--fallback" style={{ backgroundColor: avatarBgColor }}>
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <span>{displayName}</span>
          </div>

      
        </div>

        {/* BADGE */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', justifyContent: 'flex-start' }}>
          <div className="stat-pill">
            <span className="star">⭐</span>
            <span>{perfil?.score ?? user.totalPoints ?? 0} pontos</span>
          </div>
        </div>

        {/* CARDS */}
        <div className="flex flex-col gap-4 mt-6">
          {games.map((game, index) => (
            <motion.div key={game.path} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}>
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.995 }}>
                <Link to={game.path} className="menu-card" onClick={() => { triggerPoints(); showToast('🎉 Você ganhou 10 pontos!'); }}>
                  <div className="list-left" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div className={`left-icon bg-gradient-to-br ${game.color}`}>
                      <game.icon className="icon-svg" />
                    </div>
                    <div className="list-text">
                      <h3 style={{ color: softColor }}>{game.title}</h3>
                      <p>{game.description}</p>
                    </div>
                  </div>
                  <span style={{ color: softColor }}>→</span>
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* DICA ECOLÓGICA */}
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
          className="mt-6 p-4 bg-green-50 rounded-2xl">
          <h3 className="text-xl font-bold text-green-700 mb-2">🌱 Dica Ecológica do Dia</h3>
          <p className="text-sm text-gray-700">{ecoTip}</p>
        </motion.div>

      </div>{/* fim main-box */}

      

      {/* PRÓXIMA CONQUISTA — usa main-box para mesma largura/centralização */}
      {nextUnlock && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.65 }}
          style={{
            width: '100%',
            maxWidth: '900px',
            margin: '20px auto 0 auto',
            backgroundColor: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(15px)',
            borderRadius: '30px',
            padding: '18px 35px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>{conquistaIcon}</span>
              <h3 style={{ fontWeight: 700, fontSize: '15px', color: softColor, margin: 0 }}>
                Próxima Conquista
              </h3>
            </div>
            {nextUnlock.type !== 'complete' && (
              <span style={{ fontSize: '12px', fontWeight: 700, color: softColor }}>
                {nextUnlock.currentScore} / {nextUnlock.targetScore} pts
              </span>
            )}
          </div>

          {nextUnlock.type === 'complete' ? (
            <p style={{ fontSize: '13px', color: softColor, fontWeight: 600, margin: 0 }}>
              🏆 {nextUnlock.message}
            </p>
          ) : (
            <>
              <p style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>
                Desbloqueie {nextUnlock.type === 'avatar' ? 'o avatar' : 'a cor'}{' '}
                <strong style={{ color: softColor }}>&quot;{nextUnlock.name}&quot;</strong>
                {' — '}faltam{' '}
                <strong style={{ color: softColor }}>{nextUnlock.pointsNeeded} pontos</strong>
              </p>

              <div style={{ background: 'rgba(0,0,0,0.07)', borderRadius: '999px', height: '10px', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.9, ease: 'easeOut', delay: 0.75 }}
                  style={{
                    height: '100%',
                    borderRadius: '999px',
                    background: perfil?.color
                      ? `linear-gradient(90deg, ${perfil.color} 0%, ${lightBg.replace('95%', '70%')} 100%)`
                      : 'linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                <span style={{ fontSize: '11px', color: '#aaa' }}>{nextUnlock.currentScore} pts</span>
                <span style={{ fontSize: '11px', color: '#aaa' }}>{nextUnlock.targetScore} pts</span>
              </div>
            </>
          )}
        </motion.div>
      )}

      


    </div>
  );
}