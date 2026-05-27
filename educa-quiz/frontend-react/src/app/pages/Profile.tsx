import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { API_URL } from '../../services/api';
import "./Profile.css";

interface PerfilData {
  name: string;
  email: string;
  avatar: string;
  color: string;
  score: number;
  avatarId: number | null;
  colorId: number | null;
  unlockedAvatars: number;
  unlockedBackgrounds: number;
}

function hexToHarmoniousGradient(hex: string): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), delta = max - min;
  let h = 0;
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
  }
  h = Math.round(h * 60); if (h < 0) h += 360;
  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  const sP = Math.round(s * 100), lP = Math.round(l * 100);
  return `linear-gradient(135deg, hsl(${h},${sP}%,${Math.min(lP+10,80)}%) 0%, hsl(${(h+20)%360},${Math.min(sP+5,100)}%,${Math.min(lP+22,88)}%) 50%, hsl(${(h+40)%360},${Math.max(sP-10,30)}%,${Math.min(lP+35,94)}%) 100%)`;
}

function hexToSoftColor(hex: string): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), delta = max - min;
  let h = 0;
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
  }
  h = Math.round(h * 60); if (h < 0) h += 360;
  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  return `hsl(${h}, ${Math.round(Math.min(s*100,60))}%, ${Math.max(Math.min(Math.round(l*100),52),42)}%)`;
}

function hexToVeryLight(hex: string): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), delta = max - min;
  let h = 0;
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
  }
  h = Math.round(h * 60); if (h < 0) h += 360;
  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  return `hsl(${h}, ${Math.round(Math.min(s*100,35))}%, 94%)`;
}

export default function Profile() {
  const { user, updateUser } = useUser();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [perfil, setPerfil] = useState<PerfilData | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // campos de senha
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const token = localStorage.getItem('token');

  const softColor = perfil?.color ? hexToSoftColor(perfil.color) : '#2563eb';
  const veryLight = perfil?.color ? hexToVeryLight(perfil.color) : '#eef2ff';
  const avatarUrl  = perfil?.avatar || user.selectedAvatar || '';

  const fetchPerfil = useCallback(async () => {
    if (!token) return;
    const res = await fetch(`${API_URL}/user/perfil`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data: PerfilData = await res.json();
    setPerfil(data);
    setName(data.name);
    setEmail(data.email ?? '');

    if (data.color) {
      const root = document.getElementById('root');
      if (root) {
        root.style.background = hexToHarmoniousGradient(data.color);
        root.style.minHeight = '100vh';
      }
    }
  }, [token]);

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchPerfil();
  }, [fetchPerfil, navigate, token]);

  const clearPasswordFields = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
  };

  const handleSave = async () => {
    setPasswordError('');
    setSaveError('');

    // Validação de senha só se o usuário preencheu algum campo de senha
    const wantsToChangePassword = currentPassword || newPassword || confirmPassword;
    if (wantsToChangePassword) {
      if (!currentPassword) {
        setPasswordError('Digite sua senha atual.');
        return;
      }
      if (!newPassword) {
        setPasswordError('Digite a nova senha.');
        return;
      }
      if (newPassword.length < 6) {
        setPasswordError('A nova senha deve ter pelo menos 6 caracteres.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setPasswordError('As senhas não coincidem.');
        return;
      }
    }

    setSaving(true);
    try {
      const body: Record<string, string> = { name, email };
      if (wantsToChangePassword) {
        body.currentPassword = currentPassword;
        body.password = newPassword;
      }

      const res = await fetch(`${API_URL}/user/perfil`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        // Se o backend retornar erro de senha incorreta, mostra no campo de senha
        const msg = err?.message || 'Erro ao salvar.';
        if (msg.toLowerCase().includes('senha')) {
          setPasswordError(msg);
        } else {
          setSaveError(msg);
        }
        return;
      }

      const updated = await res.json();
      updateUser({ name: updated.name });
      clearPasswordFields();
      setIsEditing(false);
      await fetchPerfil();
    } catch {
      setSaveError('Não foi possível salvar as alterações. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (perfil) {
      setName(perfil.name);
      setEmail(perfil.email ?? '');
    }
    clearPasswordFields();
    setSaveError('');
    setIsEditing(false);
  };

  // Mostra o bloco de senha expandido só se o usuário começou a preencher
  const showPasswordFields = isEditing;

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header */}
        <div
          className="profile-header"
          style={{
            background: `linear-gradient(180deg, ${softColor}12, ${softColor}08)`,
            borderBottom: `1px solid ${softColor}22`,
          }}
        >
          <div>
            <p className="profile-welcome">Bem-vindo, {perfil?.name || user.name}</p>
            <h1 className="profile-title" style={{ color: softColor }}>Meu Perfil</h1>
          </div>
          <div className="profile-header-actions">
            <Button
              variant="outline"
              onClick={() => navigate('/home')}
              className="profile-button profile-back"
              style={{ color: softColor, borderColor: `${softColor}55` }}
            >
              ← Voltar
            </Button>
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="profile-button"
                  style={{ color: softColor, borderColor: `${softColor}55` }}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="profile-button profile-save"
                  style={{ background: softColor, borderColor: softColor }}
                >
                  {saving ? 'Salvando...' : 'Salvar'}
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                className="profile-button profile-edit"
                style={{ background: softColor, borderColor: softColor }}
              >
                Editar
              </Button>
            )}
          </div>
        </div>

        {saveError && (
          <div className="mx-8 mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm">
            ⚠️ {saveError}
          </div>
        )}

        <div className="profile-grid">
          {/* Sidebar */}
          <aside className="profile-card profile-card-side">
            <div className="profile-avatar-card">
              <div
                className="profile-avatar-ring"
                style={{
                  background: perfil?.color
                    ? `linear-gradient(135deg, ${softColor}, ${perfil.color})`
                    : 'linear-gradient(135deg, #818cf8, #a855f7, #fb7185)',
                }}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="profile-avatar" />
                ) : (
                  <div className="profile-avatar-inner">👤</div>
                )}
              </div>
              <h2 className="profile-name">{perfil?.name || user.name}</h2>
              <p className="profile-email">{perfil?.email || '—'}</p>
            </div>

            <div className="profile-stats">
              <div className="profile-stat-item" style={{ background: veryLight }}>
                <span style={{ background: `${softColor}22`, color: softColor }}>⭐</span>
                <div>
                  <strong style={{ color: softColor }}>{perfil?.score ?? 0}</strong>
                  <p>Pontos Totais</p>
                </div>
              </div>
              <div className="profile-stat-item" style={{ background: veryLight }}>
                <span style={{ background: `${softColor}22`, color: softColor }}>👤</span>
                <div>
                  <strong style={{ color: softColor }}>{perfil?.unlockedAvatars ?? 0}</strong>
                  <p>Avatares</p>
                </div>
              </div>
              <div className="profile-stat-item" style={{ background: veryLight }}>
                <span style={{ background: `${softColor}22`, color: softColor }}>🎨</span>
                <div>
                  <strong style={{ color: softColor }}>{perfil?.unlockedBackgrounds ?? 0}</strong>
                  <p>Fundos</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main */}
          <main className="profile-card profile-card-main">
            <div className="profile-form-header">
              <h2 style={{ color: softColor }}>Informações Pessoais</h2>
              <p>Edite seu perfil e veja seu progresso.</p>
            </div>

            <div className="profile-form-grid">
              <div className="profile-form-field">
                <label style={{ color: softColor }}>Nome</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing}
                  placeholder="Seu nome"
                />
              </div>

              <div className="profile-form-field">
                <label style={{ color: softColor }}>E-mail</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing}
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            {/* Seção de alteração de senha — só aparece no modo edição */}
            {showPasswordFields && (
              <div style={{ marginTop: '1.75rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '1rem',
                }}>
                  <div style={{
                    flex: 1,
                    height: '1px',
                    background: `${softColor}30`,
                  }} />
                  <span style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: softColor,
                    whiteSpace: 'nowrap',
                  }}>
                    Alterar senha (opcional)
                  </span>
                  <div style={{
                    flex: 1,
                    height: '1px',
                    background: `${softColor}30`,
                  }} />
                </div>

                <div className="profile-form-grid">
                  <div className="profile-form-field" style={{ gridColumn: '1 / -1' }}>
                    <label style={{ color: softColor }}>Senha atual</label>
                    <Input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => { setCurrentPassword(e.target.value); setPasswordError(''); }}
                      placeholder="Digite sua senha atual"
                    />
                  </div>

                  <div className="profile-form-field">
                    <label style={{ color: softColor }}>Nova senha</label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setPasswordError(''); }}
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>

                  <div className="profile-form-field">
                    <label style={{ color: softColor }}>Confirmar nova senha</label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError(''); }}
                      placeholder="Repita a nova senha"
                    />
                  </div>
                </div>

                {passwordError && (
                  <p style={{
                    marginTop: '0.75rem',
                    fontSize: '0.875rem',
                    color: '#dc2626',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    ⚠️ {passwordError}
                  </p>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}