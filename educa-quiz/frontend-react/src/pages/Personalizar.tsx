import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../services/api";
import "../styles/Personalizar.css";

interface AvatarItem {
  id: number;
  name: string;
  imageUrl: string;
  requiredValue: number;
  isUnlocked: boolean;
}

interface ColorItem {
  id: number;
  name: string;
  hexValue: string;
  requiredValue: number;
  isUnlocked: boolean;
}

interface UserProfile {
  name: string;
  avatar: string;
  color: string;
  score: number;
  avatarId: number;
  colorId: number;
}

export default function Personalizar() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"avatares" | "cores">("avatares");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [avatares, setAvatares] = useState<AvatarItem[]>([]);
  const [cores, setCores] = useState<ColorItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [selectedAvatarId, setSelectedAvatarId] = useState<number | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) { navigate("/login"); return; }

    // Busca perfil
    fetch(`${API_URL}/user/perfil`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        setUser(data);
        setSelectedAvatarId(data.avatarId);
        setSelectedColorId(data.colorId);
      });

    // Busca avatares do usuário (com isUnlocked)
    fetch(`${API_URL}/avatar/avatars/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(setAvatares);

    // Busca cores
    fetch(`${API_URL}/color/colors/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(setCores);
  }, [navigate]);

  const equipAvatar = async (avatarId: number) => {
    if (saving) return;
    setSaving(true);
    setSelectedAvatarId(avatarId);
    await fetch(`${API_URL}/user/perfil/avatar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ avatarId }),
    });
    setSaving(false);
  };

  const equipColor = async (colorId: number) => {
    if (saving) return;
    setSaving(true);
    setSelectedColorId(colorId);
    await fetch(`${API_URL}/user/perfil/color`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ colorId }),
    });
    setSaving(false);
  };

  if (!user) {
    return <div className="ps-root ps-loading">⏳ Carregando...</div>;
  }

  return (
    <div className="ps-root">
      {/* Header */}
      <div className="ps-header">
        <button className="ps-back" onClick={() => navigate("/dashboard")}>
          ← Voltar
        </button>
        <h1 className="ps-title">🎨 Personalizar Perfil</h1>
      </div>

      {/* Card do perfil atual */}
      <div className="ps-profile-card">
        <div className="ps-av-wrap">
          <img src={user.avatar} alt={user.name} className="ps-av-img" />
          <div className="ps-av-color-dot" style={{ backgroundColor: user.color }} />
        </div>
        <div className="ps-profile-info">
          <span className="ps-profile-name">{user.name}</span>
          <span className="ps-profile-score">⭐ {user.score} pontos</span>
          <div className="ps-profile-stats">
            <span>{avatares.filter(a => a.isUnlocked).length} avatares</span>
            <span>·</span>
            <span>{cores.filter(c => c.isUnlocked).length} cores</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="ps-tabs">
        <button
          className={`ps-tab ${tab === "avatares" ? "ps-tab--active" : ""}`}
          onClick={() => setTab("avatares")}
        >
          🧑 Avatares
        </button>
        <button
          className={`ps-tab ${tab === "cores" ? "ps-tab--active" : ""}`}
          onClick={() => setTab("cores")}
        >
          🎨 Cores de Fundo
        </button>
      </div>

      {/* Grid de avatares */}
      {tab === "avatares" && (
        <div className="ps-grid">
          {avatares.map((av) => (
            <div
              key={av.id}
              className={`ps-item ${av.isUnlocked ? "ps-item--unlocked" : "ps-item--locked"} ${selectedAvatarId === av.id ? "ps-item--selected" : ""}`}
              onClick={() => av.isUnlocked && equipAvatar(av.id)}
            >
              {av.isUnlocked ? (
                <img src={`http://localhost:5200${av.imageUrl}`} alt={av.name} className="ps-item-img" />
              ) : (
                <div className="ps-item-lock">
                  <span className="ps-lock-icon">🔒</span>
                  <span className="ps-lock-pts">{av.requiredValue} pts</span>
                </div>
              )}
              <span className="ps-item-name">{av.name}</span>
              {selectedAvatarId === av.id && <span className="ps-check">✓</span>}
            </div>
          ))}
        </div>
      )}

      {/* Grid de cores */}
      {tab === "cores" && (
        <div className="ps-grid">
          {cores.map((cor) => (
            <div
              key={cor.id}
              className={`ps-item ps-item--color ${cor.isUnlocked ? "ps-item--unlocked" : "ps-item--locked"} ${selectedColorId === cor.id ? "ps-item--selected" : ""}`}
              onClick={() => cor.isUnlocked && equipColor(cor.id)}
            >
              {cor.isUnlocked ? (
                <div className="ps-color-swatch" style={{ backgroundColor: cor.hexValue }} />
              ) : (
                <div className="ps-item-lock">
                  <span className="ps-lock-icon">🔒</span>
                  <span className="ps-lock-pts">{cor.requiredValue} pts</span>
                </div>
              )}
              <span className="ps-item-name">{cor.name}</span>
              {selectedColorId === cor.id && <span className="ps-check">✓</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
