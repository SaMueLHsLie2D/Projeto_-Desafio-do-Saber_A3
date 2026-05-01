# EducaQuiz – Guidelines Frontend (React + TypeScript)

## Objetivo

O frontend deve consumir a API e implementar o fluxo:

```text
Login → Cadastro → Dashboard → Quizzes → Jogar Quiz
```

---

# Estrutura obrigatória

```text
src/
├── pages/
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   ├── Quizzes.tsx
│   └── QuizPlay.tsx
├── services/
│   └── api.ts
├── App.tsx
└── main.tsx
```

---

# Integração com API

Base URL:

```ts
http://localhost:5000/api
```

---

## Auth

### Login

```http
POST /api/auth/login
```

Response:

```json
{
  "name": "Samuel",
  "avatar": "/avatars/avatar1.png",
  "color": "#3498DB"
}
```

Salvar no `localStorage`:

```ts
localStorage.setItem("user", JSON.stringify(data));
```

---

### Cadastro

```http
POST /api/auth/register
```

Body:

```json
{
  "name": "Samuel",
  "email": "email@email.com",
  "password": "123456",
  "avatarId": 1,
  "colorId": 2
}
```

---

# Avatares e Cores

### Buscar avatares

```http
GET /api/avatar
```

### Buscar cores

```http
GET /api/color
```

---

## Regras

* Avatar → usar `image_url`
* Cor → usar `hex_value`
* Sempre montar URL:

```ts
http://localhost:5000 + image_url
```

---

# Dashboard

## Deve exibir:

* Nome do usuário
* Avatar
* Cor de fundo (banner)
* Botão → "Ver Quizzes"

---

# Quizzes

## Listar quizzes

```http
GET /api/quiz
```

## Exibir:

* Título
* Descrição
* Botão "Jogar"

---

# Jogar Quiz

## Buscar quiz

```http
GET /api/quiz/:id
```

Response:

```json
{
  "id": 1,
  "title": "Quiz Teste",
  "questions": [
    {
      "question": "Pergunta?",
      "options": ["A", "B", "C", "D"],
      "correct": 1
    }
  ]
}
```

---

## Renderização

* Mostrar pergunta
* Mostrar opções como botões
* Ao clicar → validar resposta

---

## Lógica mínima

* Controlar índice da pergunta atual
* Avançar para próxima pergunta
* Calcular score simples

---

# Proteção de Rotas

Rotas protegidas:

* `/dashboard`
* `/quizzes`
* `/quiz/:id`

Se não tiver usuário no `localStorage`:

```ts
Navigate("/")
```

---

# Boas práticas obrigatórias

* Não confiar só no frontend
* Tratar null no localStorage
* Separar lógica de UI
* Evitar código duplicado
* Usar `useEffect` corretamente

---

# Erros comuns (evitar)

* Esquecer `JSON.parse`
* URL errada da API
* Não tratar loading
* Não validar campos no cadastro

---

# O que tem q ser implementado/alterado

* Feedback visual (acertou/errou)
* Score na tela final
* Layout melhorado
* Adicionar as telas que estão faltando
* Adicionar o jogo da recilagem

---

# Observação final

O backend já está preparado para fornecer:

* Usuário autenticado
* Avatares e cores
* Quizzes dinâmicos

O frontend deve apenas consumir e exibir corretamente.
