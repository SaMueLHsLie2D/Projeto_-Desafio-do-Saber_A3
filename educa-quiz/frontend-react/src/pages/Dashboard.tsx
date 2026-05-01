import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const stored = localStorage.getItem("user");
  const user = stored ? JSON.parse(stored) : null;

  if (!user) return <div>Não logado</div>;

  return (
    <div>
      <div style={{ backgroundColor: user.color, height: 120 }}>
        <img src={`http://localhost:5000${user.avatar}`} />
        <h2>{user.name}</h2>
      </div>

      <h2>Score: 0</h2>

      <button onClick={() => navigate("/quizzes")}>
        Ver Quizzes
      </button>
    </div>
  );
}