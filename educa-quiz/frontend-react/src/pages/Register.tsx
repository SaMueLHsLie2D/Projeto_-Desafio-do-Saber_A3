import { useState } from "react";
import { API_URL } from "../services/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function register() {
    const res = await fetch(`${API_URL}/user/Cadastro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    if (!res.ok) {
      const err = await res.text();
      alert("Erro no cadastro: " + err);
      return;
    }

    alert("Cadastro realizado com sucesso!");
    window.location.href = "/";
  }

  return (
    <div>
      <h1>Cadastro</h1>
      <input placeholder="Nome" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={register}>Finalizar</button>
    </div>
  );
}
