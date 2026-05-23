import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../UserContext';
import { motion } from 'motion/react';
import { Home, Trophy } from 'lucide-react';
import { API_URL } from '../../services/api';

interface RankingEntry {
  position: number;
  name: string;
  totalScore: number;   // API retorna "totalScore" (camelCase do C# TotalScore)
  avatar?: string | null;
  isCurrentUser?: boolean;
}

interface CurrentUserRank {
  position: number;
  name: string;
  totalScore: number;
  avatar?: string | null;
}

interface PerfilData {
  name: string;
  avatar: string;
  color: string;
  score: number;
}

// — mesmas funções de cor da Home —
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
  return `linear-gradient(135deg, hsl(${h},${sP}%,${Math.min(lP + 10, 80)}%) 0%, hsl(${(h + 20) % 360},${Math.min(sP + 5, 100)}%,${Math.min(lP + 22, 88)}%) 50%, hsl(${(h + 40) % 360},${Math.max(sP - 10, 30)}%,${Math.min(lP + 35, 94)}%) 100%)`;
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
  return `hsl(${h}, ${Math.round(Math.min(s * 100, 60))}%, ${Math.max(Math.min(Math.round(l * 100), 52), 42)}%)`;
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
  return `hsl(${h}, ${Math.round(Math.min(s * 100, 40))}%, 93%)`;
}

const MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function Ranking() {
  const { user } = useUser();
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<CurrentUserRank | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [perfil, setPerfil] = useState<PerfilData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const fetchAll = async () => {
      try {
        const [rankRes, perfilRes] = await Promise.all([
          fetch(`${API_URL}/ranking`, { headers }),
          fetch(`${API_URL}/user/perfil`, { headers }),
        ]);

        if (!rankRes.ok) throw new Error();
        const rankData = await rankRes.json();
        setRankings(rankData.top5 ?? []);
        setCurrentUserRank(rankData.currentUser ?? null);

        if (perfilRes.ok) {
          const p: PerfilData = await perfilRes.json();
          setPerfil(p);
          // aplica gradiente de fundo igual à Home
          const root = document.getElementById('root');
          if (root && p.color) {
            root.style.background = hexToHarmoniousGradient(p.color);
            root.style.minHeight = '100vh';
          }
        }
      } catch {
        setError('Não foi possível carregar o ranking. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const accentColor = perfil?.color ? hexToSoftColor(perfil.color) : '#7c3aed';
  const lightBg = perfil?.color ? hexToLightBg(perfil.color) : '#f3f0ff';
  const avatarBg = perfil?.color ?? '#6c47ff';
  const displayName = perfil?.name || user.name || 'Você';
  const totalPoints = perfil?.score ?? user.totalPoints ?? 0;

  // Garante URL absoluta para avatares (caso a API retorne caminho relativo)
  const resolveAvatar = (url?: string | null) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${API_URL.replace('/api', '')}${url}`;
  };

  // estilo de cada linha do ranking
  const rowBg = (entry: RankingEntry, isCurrentUser: boolean) => {
    if (isCurrentUser) return lightBg;
    if (entry.position === 1) return '#fffbeb';  // amarelo suave
    if (entry.position === 2) return '#f8fafc';  // cinza clarinho
    if (entry.position === 3) return '#fff7ed';  // laranja suave
    return '#ffffff';
  };

  const rowBorder = (entry: RankingEntry, isCurrentUser: boolean) => {
    if (isCurrentUser) return `2px solid ${accentColor}`;
    if (entry.position === 1) return '2px solid #fbbf24';
    if (entry.position === 2) return '2px solid #cbd5e1';
    if (entry.position === 3) return '2px solid #fdba74';
    return '1.5px solid #f1f5f9';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative gap-0">

      {/* ── BOTÃO VOLTAR — alinhado com o card ── */}
      <div style={{ width: '100%', maxWidth: '900px', marginBottom: '12px', display: 'flex' }}>
        <Link to="/home">
          <button
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'rgba(255,255,255,0.92)',
              border: 'none',
              borderRadius: '16px', padding: '10px 20px',
              fontWeight: 700, fontSize: '14px', color: '#374151',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
              backdropFilter: 'blur(10px)',
              letterSpacing: '0.01em',
            }}
          >
            <Home size={16} /> Voltar ao Menu
          </button>
        </Link>
      </div>

      {/* ── CARD PRINCIPAL ── */}
      <div className="main-box" style={{ width: '100%', maxWidth: '900px' }}>

        {/* Cabeçalho dentro do card — só título + ícone */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <motion.div
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
          >
            <Trophy size={30} color={accentColor} />
            <h1 style={{ fontSize: '28px', fontWeight: 900, color: accentColor, margin: 0 }}>
              Ranking
            </h1>
          </motion.div>
        </div>

        {/* Estados de loading / erro */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#9ca3af', fontSize: '15px' }}>
            ⏳ Carregando ranking...
          </div>
        )}
        {!loading && error && (
          <div style={{
            textAlign: 'center', padding: '24px',
            background: '#fef2f2', borderRadius: '16px',
            color: '#ef4444', fontSize: '14px',
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Lista do ranking */}
        {!loading && !error && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {rankings.map((entry, index) => {
              const isCurrentUser = entry.isCurrentUser ?? entry.name === (perfil?.name || user.name);
              const initials = entry.name.charAt(0).toUpperCase();

              return (
                <motion.div
                  key={`${entry.name}-${entry.position}`}
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.07 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    padding: '14px 18px',
                    background: rowBg(entry, isCurrentUser),
                    border: rowBorder(entry, isCurrentUser),
                    borderRadius: '20px',
                    boxShadow: isCurrentUser
                      ? `0 4px 16px ${accentColor}22`
                      : '0 1px 4px rgba(0,0,0,0.05)',
                  }}
                >
                  {/* Posição / medalha */}
                  <div style={{
                    width: '40px', textAlign: 'center', flexShrink: 0,
                    fontSize: entry.position <= 3 ? '24px' : '15px',
                    fontWeight: 800,
                    color: entry.position <= 3 ? undefined : '#9ca3af',
                  }}>
                    {MEDAL[entry.position] ?? `${entry.position}º`}
                  </div>

                  {/* Avatar */}
                  {resolveAvatar(entry.avatar) ? (
                    <img
                      src={resolveAvatar(entry.avatar)!}
                      alt={entry.name}
                      style={{
                        width: '44px', height: '44px', borderRadius: '50%',
                        objectFit: 'cover', flexShrink: 0,
                        border: isCurrentUser ? `2px solid ${accentColor}` : '2px solid #e5e7eb',
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '50%',
                      background: isCurrentUser ? accentColor : avatarBg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 800, fontSize: '18px', flexShrink: 0,
                      border: isCurrentUser ? `2px solid ${accentColor}` : '2px solid transparent',
                    }}>
                      {initials}
                    </div>
                  )}

                  {/* Nome */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      margin: 0, fontWeight: 700, fontSize: '15px',
                      color: isCurrentUser ? accentColor : '#1f2937',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {entry.name}
                      {isCurrentUser && (
                        <span style={{
                          marginLeft: '8px', fontSize: '11px', fontWeight: 700,
                          background: accentColor, color: 'white',
                          borderRadius: '999px', padding: '2px 8px',
                        }}>
                          Você
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Pontuação */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    background: 'white', borderRadius: '999px',
                    padding: '6px 14px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                    flexShrink: 0,
                  }}>
                    <span style={{ fontSize: '16px' }}>⭐</span>
                    <span style={{ fontWeight: 800, fontSize: '15px', color: accentColor }}>
                      {entry.totalScore} pts
                    </span>
                  </div>
                </motion.div>
              );
            })}

            {rankings.length === 0 && (
              <p style={{ textAlign: 'center', color: '#9ca3af', padding: '32px 0' }}>
                Nenhum jogador no ranking ainda.
              </p>
            )}
          </div>
        )}

        {/* Rodapé informativo */}
        {!loading && !error && (
          <div style={{
            marginTop: '20px', padding: '14px 18px',
            background: '#f9fafb', borderRadius: '16px',
            borderTop: '1.5px solid #f1f5f9',
            textAlign: 'center',
          }}>
            <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
              <strong>Como funciona:</strong> a cada resposta correta você ganha pontos ⭐ — continue jogando para subir no ranking!
            </p>
          </div>
        )}
      </div>

      {/* ── CARD SUAS ESTATÍSTICAS ── */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          width: '100%', maxWidth: '900px',
          margin: '20px auto 0 auto',
          backgroundColor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(15px)',
          borderRadius: '30px',
          padding: '18px 35px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
        }}
      >
        <h3 style={{ fontWeight: 700, fontSize: '15px', color: accentColor, marginBottom: '14px' }}>
          Suas Estatísticas
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{
            background: lightBg, borderRadius: '20px',
            padding: '18px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '32px', marginBottom: '4px' }}>⭐</div>
            <div style={{ fontSize: '26px', fontWeight: 900, color: accentColor }}>{totalPoints}</div>
            <div style={{ fontSize: '13px', color: '#6b7280' }}>Pontos</div>
          </div>
          <div style={{
            background: lightBg, borderRadius: '20px',
            padding: '18px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '32px', marginBottom: '4px' }}>🏆</div>
            <div style={{ fontSize: '26px', fontWeight: 900, color: accentColor }}>
              {currentUserRank ? `#${currentUserRank.position}` : '–'}
            </div>
            <div style={{ fontSize: '13px', color: '#6b7280' }}>Posição</div>
          </div>
        </div>
      </motion.div>

    </div>
  );
}