# EducaQuiz – Guidelines Backend (ASP.NET Core + MySQL)

## Objetivo

O backend é responsável por:

* Autenticação de usuários
* Gerenciamento de perfil (avatar + cor)
* Fornecimento de quizzes (JSON)
* Registro de tentativas e ranking

---

# Arquitetura

```text
Controller → DTO → Service (opcional) → DbContext → MySQL
```

---

# Estrutura obrigatória

```text
backend-dotnet/
├── Controllers/
├── DTOs/
├── Models/
├── Data/
│   └── AppDbContext.cs
├── Services/
│   └── AvatarSeedService.cs
├── wwwroot/
│   └── avatars/
├── Program.cs
└── appsettings.json
```

---

# Banco de Dados

* MySQL
* Schema: `quiz_platform`

## Tabelas principais:

* users
* avatars
* colors
* quizzes (com JSON)
* attempts
* leaderboard

---

# Autenticação

## Login

```http
POST /api/auth/login
```

### Regras:

* Validar email e senha
* Comparar senha com hash (BCrypt)
* Retornar dados do usuário

---

## Cadastro

```http
POST /api/auth/register
```

### Regras:

* Hash da senha com BCrypt
* Salvar avatar_id e color_id
* Não salvar senha em texto puro

---

# Avatares (AUTO-SEED)

## Origem

```text
wwwroot/avatars/
```

## Funcionamento

* Backend lê os arquivos ao iniciar
* Gera URL automaticamente:

```text
/avatars/nome.png
```

* Insere no banco se não existir

## Regras

* Não duplicar registros
* Não alterar existentes

---

# Cores

* Armazenadas no banco (hex_value)
* Consumidas via API

```http
GET /api/color
```

---

# Quizzes (JSON)

## Estrutura

```json
{
  "question": "Pergunta?",
  "options": ["A", "B", "C", "D"],
  "correct": 1
}
```

## Armazenamento

* Campo `questions` do tipo JSON no MySQL

---

## Criar quiz

```http
POST /api/quiz
```

* Recebe objeto
* Serializa para JSON
* Salva no banco

---

## Buscar quiz

```http
GET /api/quiz/:id
```

* Desserializa JSON antes de retornar

---

# Tentativas

```http
POST /api/attempt
```

## Dados:

* user_id
* quiz_id
* score

---

# Ranking

```http
GET /api/leaderboard
```

* Ordenado por score

---

# CORS

Permitir acesso do frontend:

```csharp
AllowAnyOrigin()
AllowAnyMethod()
AllowAnyHeader()
```

---

# DTOs (obrigatório)

Separar entrada e saída de dados.

## Exemplo:

```csharp
public class RegisterDto
{
    public string Name { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public int AvatarId { get; set; }
    public int ColorId { get; set; }
}
```

---

# Boas práticas obrigatórias

* Nunca expor senha
* Sempre usar DTO
* Validar entrada
* Tratar null
* Não retornar entidade direto sem controle

---

# Erros comuns (evitar)

* Salvar senha sem hash
* Não validar email duplicado
* Não tratar exceções
* Hardcode de dados
* Misturar lógica no Controller

---

# Middleware importante

```csharp
app.UseStaticFiles(); // servir imagens
app.UseCors("AllowAll");
app.MapControllers();
```

---

# Testes

Usar Swagger:

```text
http://localhost:5000/swagger
```

---

# Fluxo geral

```text
Login → Dashboard → Quizzes → Quiz → Score → Ranking
```

---

# Resumo

O backend deve:

✔ Autenticar usuários
✔ Servir imagens estáticas
✔ Fornecer quizzes via JSON
✔ Persistir dados no banco

---

# Observação final

O backend já está preparado para:

* Escalar quizzes facilmente
* Adicionar novos avatares automaticamente
* Integrar com frontend React sem mudanças estruturais

Mais precisa adicionar a integração com as novas telas e o sistema de ranking 