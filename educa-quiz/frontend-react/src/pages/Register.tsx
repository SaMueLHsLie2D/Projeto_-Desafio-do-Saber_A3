import { useEffect, useState } from "react";
import { API_URL } from "../services/api";

export default function Register() {
  const [avatars, setAvatars] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);

  const [avatarId, setAvatarId] = useState<number>();
  const [colorId, setColorId] = useState<number>();

  useEffect(() => {
    fetch(`${API_URL}/avatar`).then(res => res.json()).then(setAvatars);
    fetch(`${API_URL}/color`).then(res => res.json()).then(setColors);
  }, []);

  async function register() {
    await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        name: "Teste",
        email: "teste@email.com",
        password: "123",
        avatarId,
        colorId
      })
    });

    window.location.href = "/";
  }

  return (
    <div>
      <h1>Cadastro</h1>

      <div>
        {avatars.map(a => (
          <img key={a.id} src={`http://localhost:5000${a.image_url}`} onClick={() => setAvatarId(a.id)} />
        ))}
      </div>

      <div>
        {colors.map(c => (
          <div key={c.id} style={{ backgroundColor: c.hex_value, width: 50, height: 50 }} onClick={() => setColorId(c.id)} />
        ))}
      </div>

      <button onClick={register}>Finalizar</button>
    </div>
  );
}