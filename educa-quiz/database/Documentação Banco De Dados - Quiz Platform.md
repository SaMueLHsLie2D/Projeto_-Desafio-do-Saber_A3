# Documentação do Banco de Dados

## Visão Geral

Este documento descreve a estrutura do banco de dados MySQL utilizado pela aplicação Quiz Platform, incluindo tabelas, campos, relacionamentos e exemplos de uso.

## Diagrama de Relacionamento

```
+-----------+       +-----------+       +-------------+
|   users   |       |  quizzes  |       |  attempts   |
+-----------+       +-----------+       +-------------+
| id (PK)   |       | id (PK)   |       | id (PK)     |
| username  |       | title     |       | user_id FK  |
| email     |       | difficulty|       | quiz_id FK  |
| password  |       | created_at|       | score       |
|profile_img|       +-----------+       | created_at  |
| backgr_img|             |             +-------------+
| created_at|             |              
+-----------+             |             
      |                   |
      |                   v
      |             +-------------+
      |             | questions   |
      |             +-------------+
      |             | id (PK)     |
      |             | quiz_id FK  |
      |             | question    |
      |             +-------------+
      |                    |
      |                    v
      |             +-------------+
      |             | answers     |
      |             +-------------+
      |             | id (PK)     |
      |             | question_id |
      |             | answer_text |
      |             | is_correct  |
      |             +-------------+
      |
      v
+-------------+
| leaderboard |
+-------------+
| user_id PK  |
| total_score |
| updated_at  |
+-------------+
```

## Tabelas

### users

Armazena informações dos usuários do sistema.

#### Estrutura

| Campo         | Tipo         | Descrição                      | Restrições                |
| ------------- | ------------ | ------------------------------ | ------------------------- |
| id            | INT          | Identificador único do usuário | PK, AUTO_INCREMENT        |
| username      | VARCHAR(50)  | Nome do usuário                | NOT NULL, UNIQUE          |
| email         | VARCHAR(100) | Email do usuário               | NOT NULL, UNIQUE          |
| password_hash | VARCHAR(255) | Senha do usuário (hash)        | NOT NULL                  |
| profile_image | VARCHAR(255) | Caminho ou URL                 | NOT NULL                  |
|background_image|VARCHAR(255) | Caminho ou URL                 | NOT NULL                  |
| created_at    | DATETIME     | Data de criação                | DEFAULT CURRENT_TIMESTAMP |

#### Índices

* **Primário**: `id`
* **Único**: `email`, `username`

#### Exemplo de Inserção

```sql
INSERT INTO users (username, email, password_hash)
VALUES ('samuel', 'samuel@email.com', 'hash');
```

#### Exemplo de Consulta

```sql
SELECT id, username, email
FROM users
WHERE email = 'samuel@email.com';
```

### quizzes

Armazena os quizzes disponíveis.

#### Estrutura

| Campo      | Tipo         | Descrição       | Restrições                |
| ---------- | ------------ | --------------- | ------------------------- |
| id         | INT          | Identificador   | PK, AUTO_INCREMENT        |
| title      | VARCHAR(100) | Título do quiz  | NOT NULL                  |
| difficulty | ENUM         | Dificuldade     | NOT NULL                  |
| created_at | DATETIME     | Data de criação | DEFAULT CURRENT_TIMESTAMP |

#### Exemplo de Inserção

```sql
INSERT INTO quizzes (title, difficulty)
VALUES ('Quiz de Programação', 'medium');
```

### questions

Armazena as perguntas de cada quiz.

#### Estrutura

| Campo         | Tipo | Descrição         | Restrições         |
| ------------- | ---- | ----------------- | ------------------ |
| id            | INT  | Identificador     | PK, AUTO_INCREMENT |
| quiz_id       | INT  | ID do quiz        | FK, NOT NULL       |
| question_text | TEXT | Texto da pergunta | NOT NULL           |

#### Exemplo de Inserção

```sql
INSERT INTO questions (quiz_id, question_text)
VALUES (1, 'O que é JavaScript?');
```

### answers

Armazena as respostas das perguntas.

#### Estrutura

| Campo       | Tipo    | Descrição           | Restrições         |
| ----------- | ------- | ------------------- | ------------------ |
| id          | INT     | Identificador       | PK, AUTO_INCREMENT |
| question_id | INT     | ID da pergunta      | FK, NOT NULL       |
| answer_text | TEXT    | Texto da resposta   | NOT NULL           |
| is_correct  | BOOLEAN | Indica se é correta | NOT NULL           |

#### Exemplo de Inserção

```sql
INSERT INTO answers (question_id, answer_text, is_correct)
VALUES (1, 'Linguagem de programação', TRUE);
```

### attempts

Registra as tentativas dos usuários.

#### Estrutura

| Campo      | Tipo     | Descrição         | Restrições                |
| ---------- | -------- | ----------------- | ------------------------- |
| id         | INT      | Identificador     | PK, AUTO_INCREMENT        |
| user_id    | INT      | ID do usuário     | FK, NOT NULL              |
| quiz_id    | INT      | ID do quiz        | FK, NOT NULL              |
| score      | INT      | Pontuação         | NOT NULL                  |
| created_at | DATETIME | Data da tentativa | DEFAULT CURRENT_TIMESTAMP |

#### Exemplo de Inserção

```sql
INSERT INTO attempts (user_id, quiz_id, score)
VALUES (1, 1, 80);
```

### leaderboard

Armazena o ranking dos usuários.

#### Estrutura

| Campo       | Tipo     | Descrição          | Restrições                |
| ----------- | -------- | ------------------ | ------------------------- |
| user_id     | INT      | ID do usuário      | PK, FK                    |
| total_score | INT      | Pontuação total    | NOT NULL                  |
| updated_at  | DATETIME | Última atualização | DEFAULT CURRENT_TIMESTAMP |

---

## Relacionamentos

* users → attempts (1:N)
* quizzes → questions (1:N)
* questions → answers (1:N)
* users → leaderboard (1:1)

---

## Scripts SQL

### Criação das Tabelas

```sql
CREATE DATABASE IF NOT EXISTS quiz_platform;
USE quiz_platform;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    profile_image VARCHAR(255),    -- Nova coluna
    background_image VARCHAR(255), -- Nova coluna
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE quizzes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    difficulty ENUM('easy', 'medium', 'hard') NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    question_text TEXT NOT NULL,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

CREATE TABLE answers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    answer_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

CREATE TABLE attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    quiz_id INT NOT NULL,
    score INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

CREATE TABLE leaderboard (
    user_id INT PRIMARY KEY,
    total_score INT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## Atualização do Ranking

```sql
TRUNCATE TABLE leaderboard;

INSERT INTO leaderboard (user_id, total_score, updated_at)
SELECT user_id, SUM(score), NOW()
FROM attempts
GROUP BY user_id;
```

---

## Exemplos de Uso

### Consulta de ranking

```sql
SELECT u.username, l.total_score
FROM leaderboard l
JOIN users u ON u.id = l.user_id
ORDER BY l.total_score DESC;
```

---

## Considerações de Segurança

1. Senhas devem ser armazenadas com hash
2. Uso de chaves estrangeiras para integridade
3. Uso de índices para performance
4. Controle de acesso via aplicação

---

## Observações

Este modelo pode sofrer alterações conforme evolução do sistema.
