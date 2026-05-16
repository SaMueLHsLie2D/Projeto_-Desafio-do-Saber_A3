import { useState } from "react";
import { API_URL } from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    const res = await fetch(`${API_URL}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      alert("Usuário ou senha inválidos");
      return;
    }

    const data = await res.json();

    // Salva token separado e dados do usuário organizados
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify({
      name: data.name,
      avatar: data.avatar,
      color: data.color,
      score: data.score
    }));

    window.location.href = "/dashboard";
  }

  return (
    <div>
      <h1>Login</h1>
      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={login}>Logar</button>
      <button onClick={() => window.location.href = "/register"}>
        Criar Conta
      </button>
    </div>
  );
}
