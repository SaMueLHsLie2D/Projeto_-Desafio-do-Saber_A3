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
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }

    fetch(`${API_URL}/user/perfil`, {
      headers: { Authorization: `Bearer ${token}` },
    })
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
        };
        setUser(profile);
        localStorage.setItem("user", JSON.stringify(profile));
      })
      .catch(() => {
        const stored = localStorage.getItem("user");
        if (stored) setUser(JSON.parse(stored));
      });
  }, [navigate]);

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
      {/* Banners com a cor do perfil do usuário */}
      <div className="dash-banner-top" />
      <div className="dash-banner-bottom" />

      <div className="dash-body">

        {/* ── Sidebar: Ranking component ── */}
        <aside className="dash-sidebar">
          <Ranking />
        </aside>

        {/* ── Main ── */}
        <main className="dash-main">

          {/* Profile Card */}
          <div className="dash-profile-card">
            <div className="dash-card-banner" />
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
              <h1 className="dash-username">{user.name}</h1>
              <div className="dash-score-badge">
                <span className="dash-score-star">⭐</span>
                <span className="dash-score-value">{user.score}</span>
                <span className="dash-score-label">pontos</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
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
        </main>
      </div>
    </div>
  );
}
