import { useEffect, useState } from "react";
import { API_URL } from "../services/api";
import "../styles/Ranking.css";

interface RankingEntry {
  position: number;
  name: string;
  avatar: string;
  totalScore: number;
}

interface RankingData {
  top5: RankingEntry[];
  currentUser: RankingEntry | null;
}

// Avatar placeholder neutro gerado via iniciais (sem dependência externa)
function avatarFallback(name: string) {
  const initials = name.slice(0, 2).toUpperCase();
  const colors = ["#5c6bc0", "#26a69a", "#ec407a", "#f59e0b", "#8b5cf6", "#10b981"];
  const color = colors[name.charCodeAt(0) % colors.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
    <rect width="80" height="80" rx="40" fill="${color}"/>
    <text x="40" y="52" font-family="Nunito,sans-serif" font-size="28" font-weight="800"
      fill="white" text-anchor="middle">${initials}</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

// Garante que a URL do avatar é absoluta.
// Se o backend retornar algo como "/avatars/pikachu.png" ou "avatars/pikachu.png",
// prefixamos com a origem da API. URLs que já começam com http(s) passam direto.
function resolveAvatarUrl(avatar: unknown): string {
  if (!avatar) return "";

  if (typeof avatar === "object") {
    const obj = avatar as Record<string, unknown>;
    const urlValue =
      obj.imageUrl ?? obj.ImageUrl ??
      obj.url      ?? obj.Url      ??
      obj.path     ?? obj.Path     ??
      obj.src      ?? obj.Src;
    if (!urlValue) return "";
    return resolveAvatarUrl(urlValue);
  }

  const str = String(avatar);
  if (!str || str === "null" || str === "undefined") return "";

  if (str.startsWith("http://") || str.startsWith("https://") || str.startsWith("data:")) {
    return str;
  }

  // Extrai só a origem: http://localhost:5200
  const origin = API_URL.replace(/\/api.*$/, "");
  const path = str.startsWith("/") ? str : `/${str}`;
  return `${origin}${path}`;
}

export default function Ranking() {
  const [data, setData] = useState<RankingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_URL}/ranking`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const medalColors = ["#FFD700", "#C0C0C0", "#CD7F32"];
  const medalEmoji = ["🥇", "🥈", "🥉"];

  const isCurrentUser = (entry: RankingEntry) =>
    data?.currentUser?.position === entry.position;

  if (loading) {
    return (
      <div className="ranking-container">
        <div className="ranking-loading">⏳ Carregando ranking...</div>
      </div>
    );
  }

  return (
    <div className="ranking-container">
      <div className="ranking-header">
        <span className="ranking-trophy">🏆</span>
        <h2 className="ranking-title">Ranking</h2>
      </div>

      <div className="ranking-list">
        {data?.top5.map((entry) => (
          <div
            key={entry.position}
            className={`ranking-card ranking-card--pos${entry.position}${isCurrentUser(entry) ? " ranking-card--me" : ""}`}
          >
            <div
              className="ranking-position"
              style={{ color: medalColors[entry.position - 1] ?? "#aaa" }}
            >
              {entry.position <= 3 ? medalEmoji[entry.position - 1] : `#${entry.position}`}
            </div>

            <div className="ranking-avatar-wrap">
              <img
                src={resolveAvatarUrl(entry.avatar) || avatarFallback(entry.name)}
                alt={entry.name}
                className="ranking-avatar"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  if (!img.src.startsWith("data:")) {
                    img.src = avatarFallback(entry.name);
                  }
                }}
              />
            </div>

            <div className="ranking-info">
              <span className="ranking-name">
                {entry.name}
                {isCurrentUser(entry) && (
                  <span className="ranking-you-badge">Você</span>
                )}
              </span>
              <span className="ranking-score">⭐ {entry.totalScore} pts</span>
            </div>
          </div>
        ))}
      </div>

      {/* Usuário fora do top 5 */}
      {data?.currentUser && (data.currentUser.position ?? 0) > 5 && (
        <>
          <div className="ranking-divider">· · ·</div>
          <div className="ranking-card ranking-card--me">
            <div className="ranking-position" style={{ color: "#aaa" }}>
              #{data.currentUser.position}
            </div>
            <div className="ranking-avatar-wrap">
              <img
                src={resolveAvatarUrl(data.currentUser.avatar) || avatarFallback(data.currentUser.name)}
                alt={data.currentUser.name}
                className="ranking-avatar"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  if (!img.src.startsWith("data:")) {
                    img.src = avatarFallback(data.currentUser!.name);
                  }
                }}
              />
            </div>
            <div className="ranking-info">
              <span className="ranking-name">
                {data.currentUser.name}
                <span className="ranking-you-badge">Você</span>
              </span>
              <span className="ranking-score">⭐ {data.currentUser.totalScore} pts</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}