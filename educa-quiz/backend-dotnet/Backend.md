# Backend 

Este documento descreve de forma clara e organizada o funcionamento do backend do projeto Desafio do Saber. Aqui você encontrará: visão geral, ferramentas utilizadas, estrutura do projeto, descrição de cada endpoint, DTOs (Data Transfer Objects), Models e serviços auxiliares.

---

## Visão geral

O backend é uma API REST construída com ASP.NET Core (.NET 10) e Entity Framework Core. Ele fornece recursos para autenticação via JWT, gerenciamento de usuários, criação e execução de quizzes, armazenamento de tentativas (attempts), leaderboard (pontuação total) e personalizações (avatars e cores) que podem ser desbloqueadas com pontos.

---

## Ferramentas e tecnologias

- **Plataforma:** .NET 10 (net10.0)
- **Web API:** ASP.NET Core Web API
- **ORM:** Entity Framework Core com provedor MySQL (MySqlServerVersion 8.4.8)
- **Autenticação:** JWT (TokenService)
- **Segurança de senhas:** BCrypt.Net
- **Swagger:** documentação automática da API em ambiente de desenvolvimento
- **CORS:** política `AllowAll` para permitir requisições do frontend (React)
- **Armazenamento de assets estáticos:** pasta `wwwroot/avatars` (AvatarSeedService)
- **Migrations:** pasta `Migrations/` para controle do esquema do banco

---

## Estrutura do projeto (pasta principal)

- **Controllers/**: endpoints HTTP (API controllers).
- **Data/**: `AppDbContext.cs` — configuração do DbContext e mapeamentos.
- **DTOs/**: objetos usados para transferência de dados entre cliente/servidor.
- **Models/**: entidades principais da aplicação (User, Quiz, Attempt, Avatar, Color, Leaderboard).
- **Services/**: serviços auxiliares (`TokenService`, `AvatarSeedService`).
- **wwwroot/avatars/**: imagens de avatar que são carregadas automaticamente para a tabela `Avatars`.
- **Migrations/**: arquivos de migração do EF Core.

---

## Controllers e Endpoints

Notas: a maior parte dos endpoints usa prefixo `api/` conforme rotas definidas nos controllers.

- **UserController** (`api/user`)
	- `POST /api/user/Cadastro` : Cadastra um novo usuário. Recebe `CadastroDto` (nome, email, password). Senha é armazenada com hash BCrypt.
	- `POST /api/user/login` : Autentica usuário com `LoginDto` (email, password). Retorna `LoginResponseDto` com `Token`, `Name`, `Avatar`, `Color` e `Score` (pontuação total do leaderboard).
	- `GET /api/user/perfil` : (Authorize) Retorna perfil do usuário autenticado (nome, avatar, color, score, avatarId, colorId).
	- `PUT /api/user/perfil/avatar` : (Authorize) `EquiparAvatarDto` — troca o avatar do usuário (verifica se usuário tem pontos suficientes).
	- `PUT /api/user/perfil/color` : (Authorize) `EquiparColorDto` — troca a cor do usuário (verifica requisitos de pontos).
	- `GET /api/user/stats` : (Authorize) Retorna estatísticas do usuário (quizzes jogados, total de pontos, média).
	- `GET /api/user/proxima-conquista` : (Authorize) Retorna próxima personalização (avatar/color) a ser desbloqueada e pontos necessários.
	- `POST /api/user/logout` : Logout (resposta simples; token expira naturalmente).

- **QuizController** (`api/quiz`)
	- `GET /api/quiz` : Lista todos os quizzes cadastrados.
	- `GET /api/quiz/{title}/{description}?count=5` : Busca um quiz por título e descrição e retorna `count` perguntas aleatórias (serializadas). As perguntas são armazenadas em `Quiz.Questions` como JSON.
	- `POST /api/quiz` : Cria um novo quiz a partir de `CreateQuizDto` (title, description e lista de `QuestionDto`).
	- `PUT /api/quiz/pontos` : (Authorize) `QuizPointsDto` — registra uma tentativa (`Attempt`) do usuário autenticado, atualiza (ou cria) seu `Leaderboard` e soma pontos.
	- `POST /api/quiz/reciclagempontos` : (Authorize) `ScoreRequest` — endpoint para adicionar pontos de reciclagem ao leaderboard do usuário.

- **RankingController** (`api/ranking`)
	- `GET /api/ranking` : (Authorize) Retorna o ranking ordenado por `TotalScore`, com `top5` e os dados do usuário atual (se autenticado). Carrega `User`, `Avatar` e demais informações para exibir posição, nome, avatar e pontuação.

- **AvatarController** (`api/avatar`)
	- `GET /api/avatar/avatars/user/me` : (Authorize) Retorna todos os avatars com flag `IsUnlocked` indicando se o usuário atual tem pontos suficientes para desbloquear cada avatar.

- **ColorController** (`api/color`)
	- `GET /api/color/colors/user/me` : (Authorize) Retorna todas as cores com `IsUnlocked` (semelhante aos avatars).

---

## DTOs (Data Transfer Objects)

- `CadastroDto` (DTOs/CadastroDto.cs): **Name, Email, Password** — usado em registro de usuário.
- `LoginDto` (DTOs/LoginDto.cs): **Email, Password** — usado para login.
- `LoginResponseDto` (DTOs/LoginResponseDto.cs): **Token, Name, Avatar, Color, Score** — resposta do login contendo JWT e dados do usuário.
- `CreateQuizDto` (DTOs/CreateQuizDto.cs): **Title, Description, List<QuestionDto>** — usado para criar quizzes.
- `QuestionDto` (DTOs/QuestionDto.cs): **Question (string), Options (List<string> tamanho 4), Correct (int 0-3)** — representa uma questão.
- `QuizPointsDto` (DTOs/QuizPointsDto.cs): **UserId, QuizId, Score** — usado para registrar pontos de um quiz (o `UserId` atualmente é ignorado e substituído pelo usuário autenticado).
- `ScoreRequest` (DTOs/ScoreRequest.cs): **score (int)** — usado em reciclagem de pontos.
- `EquiparAvatarDto` (DTOs/EquiparAvatarDto.cs): **AvatarId** — request para trocar avatar do usuário.
- `EquiparColorDto` (DTOs/EquiparColorDto.cs): **ColorId** — request para trocar cor do usuário.

---

## Models (entidades)

- `User` (Models/User.cs):
	- `Id`, `Name`, `Email`, `Password` (hash), `AvatarId` (FK), `Avatar` (navegação), `ColorId` (FK), `Color` (navegação), `CreatedAt`, `UpdateAt`, `Attempts` (coleção) e `Leaderboard` (1:1).

- `Quiz` (Models/Quiz.cs):
	- `Id`, `Title`, `Description`, `Questions` (string JSON), `CreatedAt`, `Attempts` (coleção). As questões são armazenadas serializadas em JSON; o controller as desserializa para `List<QuestionDto>` ao servir perguntas.

- `Attempt` (Models/Attempt.cs):
	- `Id`, `UserId` (FK), `User` (navegação), `QuizId` (FK), `Quiz` (navegação), `Score` (int?), `CompletedAt`.

- `Leaderboard` (Models/LeaderBoard.cs):
	- `Id`, `UserId` (FK), `User` (navegação), `TotalScore` (int, default 0). Usado para armazenar o score acumulado do usuário — utilizado para desbloqueios de avatars/cores e ranking.

- `Avatar` (Models/Avatar.cs):
	- `Id`, `Name`, `ImageUrl`, `RequiredValue` (pontos necessários para desbloquear), lista de `Users` que usam esse avatar.

- `Color` (Models/Color.cs):
	- `Id`, `Name`, `HexValue`, `RequiredValue`, lista de `Users` relacionados.

---

## Serviços auxiliares

- `TokenService` (Services/TokenService.cs): gera tokens JWT contendo `NameIdentifier` e `Email`. O tempo de expiração padrão é 2 horas e os parâmetros de emissão/audiência são lidos de `appsettings.json` (`Jwt:Key`, `Jwt:Issuer`, `Jwt:Audience`).
- `AvatarSeedService` (Services/AvatarSeedService.cs): varre a pasta `wwwroot/avatars`, cria registros em `Avatars` para arquivos encontrados e remove avatares que não existem mais na pasta. O nome e `RequiredValue` são extraídos do nome do arquivo (padrão: `nome_valor.ext` — exemplo: `pikachu_100.png` gera `Name = "pikachu"` e `RequiredValue = 100`).

---

## Banco de dados e Migrations

- O `AppDbContext` configura as entidades e mapeamentos. Observações:
	- `Quiz.Questions` é mapeado para coluna do tipo `JSON`.
	- Campos de data (`CreatedAt`, `UpdateAt`, `CompletedAt`) usam `TIMESTAMP` e `CURRENT_TIMESTAMP` como default.
	- Provider configurado em `Program.cs` usa MySQL com `UseMySql` e `MySqlServerVersion(8.4.8)`.

- Migrations geradas estão na pasta `Migrations/` — para aplicar localmente use as ferramentas do EF Core.

---


## Onde olhar no código

- Controllers principais: [Controllers/](educa-quiz/backend-dotnet/Controllers)
- DTOs: [DTOs/](educa-quiz/backend-dotnet/DTOs)
- Models: [Models/](educa-quiz/backend-dotnet/Models)
- DbContext: [Data/AppDbContext.cs](educa-quiz/backend-dotnet/Data/AppDbContext.cs)
- Serviços: [Services/TokenService.cs](educa-quiz/backend-dotnet/Services/TokenService.cs), [Services/AvatarSeedService.cs](educa-quiz/backend-dotnet/Services/AvatarSeedService.cs)

---


