import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useUser } from '../UserContext';
import { API_URL } from '../../services/api';

export default function Login() {
  const { updateUser } = useUser();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '' });
    setError('');
    setSuccess('');
  };

  const loginAndRedirect = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('login_failed');
    const data = await res.json();
    localStorage.setItem('token', data.token);
    updateUser({ name: data.name });
    navigate('/home');
  };

  const handleSubmit = async () => {
    setError('');

    if (forgotPassword) {
      if (!formData.email.trim() || !formData.password.trim()) {
        setError('Por favor, informe o e-mail e a nova senha!');
        return;
      }
      alert('Entre em contato com o suporte para redefinir sua senha.');
      setForgotPassword(false);
      setIsLogin(true);
      resetForm();
      return;
    }

    if (isLogin) {
      if (!formData.email.trim() || !formData.password.trim()) {
        setError('Por favor, preencha todos os campos!');
        return;
      }
      setLoading(true);
      try {
        await loginAndRedirect(formData.email, formData.password);
      } catch {
        setError('E-mail ou senha incorretos. Tente novamente.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Cadastro
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError('Por favor, preencha todos os campos!');
      return;
    }
    setLoading(true);
    try {
      // 1. Cadastra o usuário
      const res = await fetch(`${API_URL}/user/cadastro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!res.ok) {
        const body = await res.text();
        setError(body.replace(/"/g, '') || 'Erro ao criar conta. Verifique os dados.');
        return;
      }

      // Cadastro ok — volta pro login com mensagem de sucesso
      setIsLogin(true);
      resetForm();
      setSuccess('Conta criada com sucesso! Faça login para continuar.');
    } catch {
      setError('Erro ao criar conta. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
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

        {error && (
          <p className="text-red-500 text-sm text-center mt-1 mb-1">{error}</p>
        )}
        {success && (
          <p className="text-green-600 text-sm text-center mt-1 mb-1">✅ {success}</p>
        )}

        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: loading ? 1 : 1.05 }}
          onClick={handleSubmit}
          disabled={loading}
          className="login-btn"
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Aguarde...' : forgotPassword ? 'Redefinir senha' : isLogin ? 'Entrar' : 'Registrar'}
        </motion.button>

        {isLogin && !forgotPassword && (
          <button
            type="button"
            onClick={() => { setForgotPassword(true); setFormData({ ...formData, password: '' }); }}
            className="login-forgot"
          >
            Esqueci minha senha
          </button>
        )}

        <button type="button" onClick={handleToggleMode} className="login-toggle">
          {forgotPassword ? 'Voltar ao login' : isLogin ? 'Não tem conta? Registre-se' : 'Já tem conta? Faça login'}
        </button>
      </motion.div>
    </div>
  );
}