import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../services/api";
import "../../styles/Personalizar.css";

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
  return `hsl(${h}, ${Math.round(Math.min(s*100,40))}%, 95%)`;
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

  const softColor = user?.color ? hexToSoftColor(user.color) : '#7c3aed';
  const lightBg   = user?.color ? hexToLightBg(user.color)   : '#f3f0ff';

  const fetchPerfil = useCallback(async () => {
    const res = await fetch(`${API_URL}/user/perfil`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data: UserProfile = await res.json();
    setUser(data);
    setSelectedAvatarId(data.avatarId);
    setSelectedColorId(data.colorId);

    if (data.color) {
      const root = document.getElementById('root');
      if (root) {
        root.style.background = hexToHarmoniousGradient(data.color);
        root.style.minHeight = '100vh';
      }
    }
  }, [token]);

  useEffect(() => {
    if (!token) { navigate("/login"); return; }

    fetchPerfil();

    fetch(`${API_URL}/avatar/avatars/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(setAvatares);

    fetch(`${API_URL}/color/colors/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(setCores);
  }, [navigate, fetchPerfil]);

  const equipAvatar = async (avatarId: number) => {
    if (saving) return;
    setSaving(true);
    await fetch(`${API_URL}/user/perfil/avatar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ avatarId }),
    });
    await fetchPerfil();
    setSaving(false);
  };

  const equipColor = async (colorId: number) => {
    if (saving) return;
    setSaving(true);
    await fetch(`${API_URL}/user/perfil/color`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ colorId }),
    });
    await fetchPerfil();
    setSaving(false);
  };

  if (!user) {
    return <div className="ps-root ps-loading">⏳ Carregando...</div>;
  }

  return (
    <div className="ps-root">
      {/* Header */}
      <div className="ps-header">
        <button
          className="ps-back"
          style={{ color: softColor, borderColor: `${softColor}55` }}
          onClick={() => navigate("/home")}
        >
          ← Voltar
        </button>
        <h1 className="ps-title" style={{ color: softColor }}>Personalize seu Perfil</h1>
      </div>

      {/* Card do perfil atual */}
      <div className="ps-profile-card">
        <div className="ps-av-wrap">
          <img src={user.avatar} alt={user.name} className="ps-av-img" />
        </div>
        <div className="ps-profile-info">
          <span className="ps-profile-name">{user.name}</span>
          <span className="ps-profile-score" style={{ color: softColor }}>⭐ {user.score} pontos</span>
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
          style={tab === "avatares" ? { background: softColor, borderColor: softColor } : {}}
          onClick={() => setTab("avatares")}
        >
          🧑 Avatares
        </button>
        <button
          className={`ps-tab ${tab === "cores" ? "ps-tab--active" : ""}`}
          style={tab === "cores" ? { background: softColor, borderColor: softColor } : {}}
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
              style={selectedAvatarId === av.id ? {
                borderColor: softColor,
                background: lightBg,
                boxShadow: `0 0 0 3px ${softColor}44, 0 6px 20px ${softColor}33`,
              } : {}}
              onClick={() => av.isUnlocked && equipAvatar(av.id)}
            >
              {av.isUnlocked ? (
                <img src={`http://localhost:5200${av.imageUrl}`} alt={av.name} className="ps-item-img" />
              ) : (
                <div className="ps-item-lock">
                  <span className="ps-lock-icon">🔒</span>
                  <span className="ps-lock-pts" style={{ color: softColor }}>{av.requiredValue} pts</span>
                </div>
              )}
              <span className="ps-item-name">{av.name}</span>
              {selectedAvatarId === av.id && (
                <span className="ps-check" style={{ background: softColor }}>✓</span>
              )}
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
              style={selectedColorId === cor.id ? {
                borderColor: softColor,
                background: lightBg,
                boxShadow: `0 0 0 3px ${softColor}44, 0 6px 20px ${softColor}33`,
              } : {}}
              onClick={() => cor.isUnlocked && equipColor(cor.id)}
            >
              {cor.isUnlocked ? (
                <div className="ps-color-swatch" style={{ backgroundColor: cor.hexValue }} />
              ) : (
                <div className="ps-item-lock">
                  <span className="ps-lock-icon">🔒</span>
                  <span className="ps-lock-pts" style={{ color: softColor }}>{cor.requiredValue} pts</span>
                </div>
              )}
              <span className="ps-item-name">{cor.name}</span>
              {selectedColorId === cor.id && (
                <span className="ps-check" style={{ background: softColor }}>✓</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}