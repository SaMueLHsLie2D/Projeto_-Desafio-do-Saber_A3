import Header from "../components/Header.jsx";

export default function Welcome({ onStart }) {
  return (
    <>
      <Header />
      <div className="container">
        <div className="card" style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ color: "#7c3aed" }}>Bem-vindo ao</h2>
          <h1 style={{ color: "#f59e0b" }}>Desafio do Saber!</h1>
          <p>Vamos aprender brincando!</p>

          <input placeholder="Nome" style={input} />
          <input placeholder="Idade" style={input} />

          <button style={button} onClick={onStart}>
            Começar 🚀
          </button>
        </div>
      </div>
    </>
  );
}

const input = {
  width: "100%",
  padding: "12px",
  marginTop: "10px",
  borderRadius: "10px",
  border: "2px solid #c084fc"
};

const button = {
  width: "100%",
  marginTop: "20px",
  padding: "14px",
  background: "linear-gradient(90deg,#9333ea,#ec4899)",
  border: "none",
  color: "#fff",
  borderRadius: "10px",
  cursor: "pointer"
};
