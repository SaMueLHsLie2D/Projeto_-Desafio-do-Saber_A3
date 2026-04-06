import Header from "../components/Header.jsx";

export default function Dashboard() {
  return (
    <>
      <Header />
      <div className="container">

        <div className="card" style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <h2 style={{ color: "#7c3aed" }}>Olá, Samuel 👋</h2>
            <p>Vamos aprender hoje?</p>
          </div>

          <div style={{
            background: "#facc15",
            padding: "10px 20px",
            borderRadius: "20px"
          }}>
            🏆 0 pontos
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px,1fr))",
          gap: "20px",
          marginTop: "30px"
        }}>
          <div className="card">
            <h3 style={{ color: "#2563eb" }}>📘 Quiz</h3>
            <p>Matemática, português e ciências</p>
          </div>

          <div className="card">
            <h3 style={{ color: "#16a34a" }}>♻️ Reciclagem</h3>
            <p>Arraste o lixo corretamente</p>
          </div>
        </div>

        <div className="card" style={{ marginTop: "30px" }}>
          <h3 style={{ color: "#9333ea" }}>✨ Você sabia?</h3>
          <p>Ganhe pontos e desbloqueie avatares!</p>
        </div>

      </div>
    </>
  );
}
