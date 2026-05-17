import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../services/api";
import Ranking from "./Ranking";
import "../styles/Dashboard.css";

interface UserProfile {
  name: string;
  avatar: string;
  color: string;
  score: number;
  level?: string;
}

interface UserStats {
  quizzesPlayed: number;
  totalScore: number;
  avgScore: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats>({
    quizzesPlayed: 0,
    totalScore: 0,
    avgScore: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }

    const headers = { Authorization: `Bearer ${token}` };

    fetch(`${API_URL}/user/perfil`, { headers })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        const profile: UserProfile = {
          name: data.name,
          avatar: data.avatar,
          color: data.color,
          score: data.score ?? 0,
          level: data.level ?? "Iniciante",
        };
        setUser(profile);
        localStorage.setItem("user", JSON.stringify(profile));
      })
      .catch(() => {
        const stored = localStorage.getItem("user");
        if (stored) setUser(JSON.parse(stored));
      });

    fetch(`${API_URL}/user/stats`, { headers })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (!data) return;
        setStats({
          quizzesPlayed: data.quizzesPlayed ?? 0,
          totalScore: data.totalScore ?? 0,
          avgScore: data.avgScore ?? 0,
        });
      })
      .catch(() => {});
  }, [navigate]);

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

  if (!user) {
    return (
      <div className="dash-root dash-loading">
        <div className="dash-spinner">⏳ Carregando...</div>
      </div>
    );
  }

  return (
    <div
      className="dash-root"
      style={{ "--user-color": user.color } as React.CSSProperties}
    >
      <div className="dash-banner-top" />
      <div className="dash-banner-bottom" />

      {/* Botão de logout fixo no canto superior direito */}
      <button className="dash-logout-btn" onClick={handleLogout} title="Sair">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Sair
      </button>

      <div className="dash-body">

        {/* ── Sidebar ── */}
        <aside className="dash-sidebar">
          <Ranking />
        </aside>

        {/* ── Main ── */}
        <main className="dash-main">

          {/* Profile Card */}
          <div className="dash-profile-card">
            <div className="dash-card-banner">
              <div className="dash-card-banner-pattern" />
            </div>
            <div className="dash-card-body">
              <div className="dash-avatar-wrap">
                <div className="dash-avatar-ring">
                  <img
                    src={user.avatar || "/default-avatar.png"}
                    alt="Avatar"
                    className="dash-avatar"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/default-avatar.png";
                    }}
                  />
                </div>
                <div className="dash-avatar-online" />
              </div>

              <div className="dash-profile-info">
                <h1 className="dash-username">{user.name}</h1>
                <span className="dash-level-badge">✦ {user.level}</span>
                <div className="dash-score-badge">
                  <span className="dash-score-star">⭐</span>
                  <span className="dash-score-value">{user.score}</span>
                  <span className="dash-score-label">pontos</span>
                </div>
              </div>

              <div className="dash-mini-stats">
                <div className="dash-mini-stat">
                  <span className="dash-mini-stat-value">{stats.quizzesPlayed}</span>
                  <span className="dash-mini-stat-label">Quizzes</span>
                </div>
                <div className="dash-mini-stat-divider" />
                <div className="dash-mini-stat">
                  <span className="dash-mini-stat-value">{stats.totalScore}</span>
                  <span className="dash-mini-stat-label">Pts totais</span>
                </div>
                <div className="dash-mini-stat-divider" />
                <div className="dash-mini-stat">
                  <span className="dash-mini-stat-value">{stats.avgScore}</span>
                  <span className="dash-mini-stat-label">Média/quiz</span>
                </div>
              </div>
            </div>
          </div>

          <div className="dash-section-label">O que vamos fazer hoje?</div>

          <div className="dash-actions">
            <button className="dash-btn dash-btn--quiz" onClick={() => navigate("/quizzes")}>
              <span className="dash-btn-icon">📚</span>
              <span className="dash-btn-text">
                <strong>Ver Quizzes</strong>
                <small>Responda e ganhe pontos</small>
              </span>
            </button>

            <button className="dash-btn dash-btn--recycle" onClick={() => navigate("/reciclagem")}>
              <span className="dash-btn-icon">♻️</span>
              <span className="dash-btn-text">
                <strong>Jogo da Reciclagem</strong>
                <small>Aprenda reciclando</small>
              </span>
            </button>

            <button className="dash-btn dash-btn--customize" onClick={() => navigate("/perfil/personalizar")}>
              <span className="dash-btn-icon">🎨</span>
              <span className="dash-btn-text">
                <strong>Personalizar Perfil</strong>
                <small>Avatares e cores desbloqueáveis</small>
              </span>
              <span className="dash-btn-badge">NOVO</span>
            </button>
          </div>

          <div className="dash-progress-card">
            <div className="dash-progress-header">
              <span className="dash-progress-title">🎯 Próxima conquista</span>
              <span className="dash-progress-pts">{stats.totalScore} / 200 pts</span>
            </div>
            <div className="dash-progress-bar-track">
              <div
                className="dash-progress-bar-fill"
                style={{ width: `${Math.min((stats.totalScore / 200) * 100, 100)}%` }}
              />
            </div>
            <p className="dash-progress-hint">
              Faltam <strong>{Math.max(200 - stats.totalScore, 0)} pontos</strong> para desbloquear o próximo avatar!
            </p>
          </div>

        </main>
      </div>
    </div>
  );
}