import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import "./Profile.css";

export default function Profile() {
  // Hook de usuário para obter dados e atualizar o perfil
  const { user, updateUser } = useUser();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [age, setAge] = useState(user.age);

  // Salva as alterações do nome e idade no contexto do usuário
  const handleSave = () => {
    updateUser({ name, age });
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div>
            <p className="profile-welcome">Bem-vindo, {user.name}</p>
            <h1 className="profile-title">Meu Perfil</h1>
          </div>
          <div className="profile-header-actions">
            <Button
              variant="outline"
              onClick={() => navigate('/home')}
              className="profile-button profile-back"
            >
              ← Voltar
            </Button>
            <Button
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              className={`profile-button ${isEditing ? 'profile-save' : 'profile-edit'}`}
            >
              {isEditing ? 'Salvar' : 'Editar'}
            </Button>
          </div>
        </div>

        <div className="profile-grid">
          <aside className="profile-card profile-card-side">
            <div className="profile-avatar-card">
              <div className="profile-avatar-ring">
                {user.selectedAvatar ? (
                  <img src={user.selectedAvatar} alt="Avatar" className="profile-avatar" />
                ) : (
                  <div className="profile-avatar-inner">👤</div>
                )}
              </div>
              <h2 className="profile-name">{user.name}</h2>
              <p className="profile-email">{user.email || 'sem-email@exemplo.com'}</p>
            </div>

            <div className="profile-stats">
              <div className="profile-stat-item">
                <span>⭐</span>
                <div>
                  <strong>{user.totalPoints}</strong>
                  <p>Pontos Totais</p>
                </div>
              </div>
              <div className="profile-stat-item">
                <span>👤</span>
                <div>
                  <strong>{user.unlockedAvatars.length}</strong>
                  <p>Avatares</p>
                </div>
              </div>
              <div className="profile-stat-item">
                <span>🎨</span>
                <div>
                  <strong>{user.unlockedBackgrounds.length}</strong>
                  <p>Fundos</p>
                </div>
              </div>
            </div>
          </aside>

          <main className="profile-card profile-card-main">
            <div className="profile-form-header">
              <h2>Informações Pessoais</h2>
              <p>Edite seu perfil e veja seu progresso.</p>
            </div>

            <div className="profile-form-grid">
              <div className="profile-form-field">
                <label>Nome completo</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="profile-form-field">
                <label>Idade</label>
                <Input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
