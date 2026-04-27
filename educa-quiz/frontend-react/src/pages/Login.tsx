import { useState } from "react";
import { API_URL } from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    localStorage.setItem("user", JSON.stringify(data));
    window.location.href = "/dashboard";
  }

  return (
    <div>
      <h1>Login</h1>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Senha" onChange={e => setPassword(e.target.value)} />
      <button onClick={login}>Logar</button>
      <button onClick={() => window.location.href = "/register"}>Criar Conta</button>
    </div>
  );
}