# Banco de Dados – EducaQuiz 

## 📌 Objetivo

Estrutura para suportar:

* Cadastro e login de usuários
* Personalização (avatar + cor de banner)
* Sistema de quizzes
* Segurança básica (armazenamento de senha seguro)

---

## 🗄️ Criação do Banco

```sql
CREATE DATABASE educa_quiz_db;
USE educa_quiz_db;

CREATE SCHEMA IF NOT EXISTS quiz_platform;
USE quiz_platform;
```

---

## 👤 Tabela: users

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,

  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,

  -- 🔐 Armazena HASH da senha (BCrypt)
  password VARCHAR(255) NOT NULL,

  -- 🎨 Personalização (obrigatória)
  avatar_id INT NOT NULL,
  color_id INT NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 🔐 Por que usar hash (BCrypt)?

* A senha real não fica armazenada
* Mesmo com vazamento, os dados ficam protegidos
* Padrão usado em aplicações reais

---

## 🎨 Tabela: avatars

```sql
CREATE TABLE avatars (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  image_url VARCHAR(255)
);
```

---

## 🌈 Tabela: colors

```sql
CREATE TABLE colors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50),
  hex_value VARCHAR(20)
);
```

---

## 🔗 Relacionamentos

```sql
-- User → Avatar
ALTER TABLE users
ADD CONSTRAINT fk_user_avatar
FOREIGN KEY (avatar_id) REFERENCES avatars(id);

-- User → Color
ALTER TABLE users
ADD CONSTRAINT fk_user_color
FOREIGN KEY (color_id) REFERENCES colors(id);
```

### 📌 Explicação

* `avatar_id` aponta para um avatar existente
* `color_id` aponta para uma cor existente
* garante consistência no banco

---

## 🧠 Tabela: quizzes

```sql
CREATE TABLE quizzes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  questions JSON NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
---

-- 🧠 Exemplo de quiz com JSON

INSERT INTO quizzes (title, description, questions) VALUES
(
  'Conhecimentos Gerais',
  'Quiz básico para teste',
  '[
    {
      "question": "Capital do Brasil?",
      "options": ["São Paulo", "Rio de Janeiro", "Brasília", "Belo Horizonte"],
      "correct": 2
    },
    {
      "question": "2 + 2?",
      "options": ["3", "4", "5", "6"],
      "correct": 1
    }
  ]'
);

---

## 🧪 Tabela: attempts

```sql
CREATE TABLE attempts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  quiz_id INT NOT NULL,
  score INT,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
);
```

---

## 🏆 Tabela: leaderboard

```sql
CREATE TABLE leaderboard (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  total_score INT DEFAULT 0,

  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### 📌 Observação

* `user_id UNIQUE` evita duplicação no ranking

---

## 🌱 Dados iniciais (Seed)

### 🎨 Avatares

```sql
INSERT INTO avatars (name, image_url) VALUES
('Avatar Ninja', '/avatars/avatar1.png'),
('Avatar Robô', '/avatars/avatar2.png'),
('Avatar Cavaleiro', '/avatars/avatar3.png');
```

---

### 🌈 Cores

```sql
INSERT INTO colors (name, hex_value) VALUES
('Vermelho', '#FF5733'),
('Azul', '#3498DB'),
('Verde', '#2ECC71');
```

---

## 📁 Armazenamento de imagens

```text
/wwwroot/avatars/
 ├── avatar1.png
 ├── avatar2.png
 └── avatar3.png
```

---

## 🌐 Acesso às imagens

### Ambiente local:

```text
http://localhost:5000/avatars/avatar1.png
http://localhost:5000/avatars/avatar2.png
http://localhost:5000/avatars/avatar3.png
```

### Produção (exemplo):

```text
https://educaquiz.com/avatars/avatar1.png
```

---

## 🔗 Relação com o banco

No banco, é salvo apenas:

```text
/avatars/avatar1.png
```

O frontend monta a URL:

```javascript
const url = "http://localhost:5000" + user.avatar.image_url;
```

---

## 🧠 Por que NÃO salvar imagem no banco?

* reduz tamanho do banco
* melhora performance
* facilita manutenção

---

## 🔄 Fluxo completo

1. Usuário escolhe avatar e cor
2. Frontend envia `avatarId` e `colorId`
3. Backend valida
4. Dados são salvos no banco
5. No login, backend retorna avatar + cor
6. Frontend renderiza o perfil

---

## 🔐 Segurança aplicada

| Item   | Implementação     |
| ------ | ----------------- |
| Senha  | Hash com BCrypt   |
| Login  | Validação de hash |
| Sessão | JWT               |
| Upload | Não utilizado     |

---

## 🧠 Conclusão

Esse modelo:

* Suporta autenticação completa
* Garante consistência dos dados
* Permite personalização do usuário
* Está pronto para integração com ASP.NET + React
* Está adequado para apresentação e evolução futura

---
