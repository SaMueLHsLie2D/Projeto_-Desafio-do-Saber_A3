import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useUser } from '../UserContext';

export default function Login() {
  const { user, updateUser } = useUser();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '' });
  };

  const handleSubmit = () => {
    if (forgotPassword) {
      if (!formData.email.trim() || !formData.password.trim()) {
        alert('Por favor, informe o email e a nova senha!');
        return;
      }

      if (!user.email) {
        alert('Nenhuma conta encontrada. Registre-se primeiro.');
        return;
      }

      if (formData.email !== user.email) {
        alert('Email não encontrado. Verifique e tente novamente.');
        return;
      }

      updateUser({ password: formData.password });
      alert('Senha redefinida com sucesso! Faça login com a nova senha.');
      setForgotPassword(false);
      setIsLogin(true);
      resetForm();
      return;
    }

    if (isLogin) {
      if (!formData.email.trim() || !formData.password.trim()) {
        alert('Por favor, preencha todos os campos!');
        return;
      }
      if (formData.email === user.email && formData.password === user.password) {
        navigate('/home');
      } else {
        alert('Email ou senha incorretos!');
      }
      return;
    }

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
  };

  const handleToggleMode = () => {
    setForgotPassword(false);
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <div className="login-bg">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="login-box"
      >
        <h1 className="page-title">Desafio do Saber</h1>

        {!isLogin && !forgotPassword && (
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
          placeholder={forgotPassword ? 'Digite sua nova senha' : 'Digite sua senha'}
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
          {forgotPassword ? 'Redefinir senha' : isLogin ? 'Entrar' : 'Registrar'}
        </motion.button>

        {isLogin && !forgotPassword && (
          <button
            type="button"
            onClick={() => {
              setForgotPassword(true);
              setFormData({ ...formData, password: '' });
            }}
            className="login-forgot"
          >
            Esqueci minha senha
          </button>
        )}

        <button
          type="button"
          onClick={handleToggleMode}
          className="login-toggle"
        >
          {forgotPassword
            ? 'Voltar ao login'
            : isLogin
            ? 'Não tem conta? Registre-se'
            : 'Já tem conta? Faça login'}
        </button>
      </motion.div>
    </div>
  );
}
