export default function Header() {
  return (
    <div style={{
      background: "#1f2937",
      color: "#fff",
      padding: "16px 24px",
      display: "flex",
      justifyContent: "space-between"
    }}>
      <strong>Educação Infantil Interativa</strong>
      <button style={{
        background: "#6366f1",
        border: "none",
        padding: "10px 16px",
        borderRadius: "8px",
        color: "#fff",
        cursor: "pointer"
      }}>
        Criar conta
      </button>
    </div>
  );
}
