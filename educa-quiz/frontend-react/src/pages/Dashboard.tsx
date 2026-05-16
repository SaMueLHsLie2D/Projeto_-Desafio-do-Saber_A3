import { useNavigate } from "react-router-dom";
import { API_URL } from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();

  const stored = localStorage.getItem("user");
  const user = stored ? JSON.parse(stored) : null;

  if (!user) return <div>Não logado</div>;

  return (
    <div>
      <div style={{ backgroundColor: user.color, height: 120 }}>
        <img src={user.avatar} alt="Avatar" />
        <h2>{user.name}</h2>
      </div>

      <h2>Score: 0</h2>

      <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
        <button onClick={() => navigate("/quizzes")}>
          Ver Quizzes
        </button>
        <button onClick={() => navigate("/reciclagem")}>
          ♻️ Jogo da Reciclagem
        </button>
      </div>
    </div>
  );
}
