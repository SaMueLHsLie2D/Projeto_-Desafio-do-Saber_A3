import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useUser } from '../UserContext';

export default function Login() {
  const { user, updateUser } = useUser();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = () => {
    if (isLogin) {
      // Login
      if (!formData.email.trim() || !formData.password.trim()) {
        alert('Por favor, preencha todos os campos!');
        return;
      }
      if (formData.email === user.email && formData.password === user.password) {
        navigate('/home');
      } else {
        alert('Email ou senha incorretos!');
      }
    } else {
      // Register
      if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
        alert('Por favor, preencha todos os campos!');
        return;
      }
      updateUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      navigate('/home');
    }
  };

  return (
    <div className="login-bg">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="login-box"
      >
        <h1 className="login-title">Desafio do Saber</h1>

        {!isLogin && (
          <input
            type="text"
            placeholder="Digite seu nome"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="login-input"
          />
        )}

        <input
          type="email"
          placeholder="Digite seu email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="login-input"
        />

        <input
          type="password"
          placeholder="Digite sua senha"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          className="login-input"
        />

        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={handleSubmit}
          className="login-btn"
        >
          {isLogin ? 'Entrar' : 'Registrar'}
        </motion.button>

        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setFormData({ name: '', email: '', password: '' });
          }}
          className="login-toggle"
        >
          {isLogin ? 'Não tem conta? Registre-se' : 'Já tem conta? Faça login'}
        </button>
      </motion.div>
    </div>
  );
}
