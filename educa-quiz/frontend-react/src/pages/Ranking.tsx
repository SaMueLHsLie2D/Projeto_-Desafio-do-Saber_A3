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
        <div className="ranking-loading">
          <span>⏳</span> Carregando ranking...
        </div>
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
            className={`ranking-card ${isCurrentUser(entry) ? "ranking-card--me" : ""} ranking-card--pos${entry.position}`}
          >
            <div
              className="ranking-position"
              style={{ color: medalColors[entry.position - 1] ?? "#7c6fa0" }}
            >
              {entry.position <= 3 ? medalEmoji[entry.position - 1] : `#${entry.position}`}
            </div>

            <div className="ranking-avatar-wrap">
              <img
                src={entry.avatar}
                alt={entry.name}
                className="ranking-avatar"
                onError={(e) =>
                  ((e.target as HTMLImageElement).src =
                    "https://api.dicebear.com/7.x/fun-emoji/svg?seed=" + entry.name)
                }
              />
              {isCurrentUser(entry) && <span className="ranking-you-badge">Você</span>}
            </div>

            <div className="ranking-info">
              <span className="ranking-name">{entry.name}</span>
              <span className="ranking-score">⭐ {entry.totalScore} pts</span>
            </div>
          </div>
        ))}
      </div>

      {/* Usuário fora do top 5 */}
      {data?.currentUser && (data.currentUser.position ?? 0) > 5 && (
        <>
          <div className="ranking-divider">· · ·</div>
          <div className="ranking-card ranking-card--me ranking-card--outside">
            <div className="ranking-position" style={{ color: "#7c6fa0" }}>
              #{data.currentUser.position}
            </div>
            <div className="ranking-avatar-wrap">
              <img
                src={data.currentUser.avatar}
                alt={data.currentUser.name}
                className="ranking-avatar"
                onError={(e) =>
                  ((e.target as HTMLImageElement).src =
                    "https://api.dicebear.com/7.x/fun-emoji/svg?seed=" + data.currentUser!.name)
                }
              />
              <span className="ranking-you-badge">Você</span>
            </div>
            <div className="ranking-info">
              <span className="ranking-name">{data.currentUser.name}</span>
              <span className="ranking-score">⭐ {data.currentUser.totalScore} pts</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
