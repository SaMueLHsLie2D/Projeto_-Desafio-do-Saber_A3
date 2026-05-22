# Documentação Detalhada das Páginas

Este arquivo explica em detalhes as principais páginas da aplicação.
Cada seção descreve o objetivo, os estados usados, as funções principais e o fluxo de renderização.

## `Home.tsx`

### Objetivo
Tela inicial do aplicativo. Mostra o nome do usuário, pontos, energia, uma dica ecológica e cards para navegar entre as funcionalidades.

### Estado e lógica
- `openProfile` - controla um modal de perfil que não está em uso atualmente.
- `ecoTip` - dica ecológica aleatória mostrada na tela.
- `toast` - mensagem temporária exibida no canto superior direito.
- `pointsAnim` - animação visual de pontos quando o usuário clica em um card.

### Componentes principais
- `WelcomeScreen` - modal que aparece na primeira visita para perguntar nome e idade.
- `Link` - cada card usa `Link` para navegar sem recarregar a página.
- `motion.div` - animações de entrada e efeitos de hover em cards.

### Fluxo
1. Ao abrir a home, `useEffect` chama `getRandomEcoTip()` para escolher uma dica.
2. A tela mostra o usuário atual e seus pontos/energia a partir de `useUser()`.
3. Ao clicar em um card, ele dispara `triggerPoints()` e `showToast()` antes de navegar.
4. Páginas navegadas são definidas em `routes.tsx`.

## `Quiz.tsx`

### Objetivo
Controlar o fluxo de um quiz educativo com seleção de categoria e nível, e exibição das perguntas.

### Estado e lógica
- `selectedCategory` - categoria escolhida pelo jogador.
- `selectedLevel` - nível de dificuldade escolhido.
- `currentQuestions` - perguntas filtradas conforme categoria e nível.
- `currentQuestionIndex` - índice da pergunta atual.
- `selectedAnswer` - alternativa escolhida pelo usuário.
- `showResult` - mostra se a resposta foi avaliada.
- `score` - pontuação atual do quiz.
- `quizCompleted` - indica que o quiz terminou.

### Componentes e comportamento
- Usa `questions` de `src/app/data/questions`.
- `useEffect` filtra as perguntas quando categoria e nível são selecionados.
- `handleAnswerSelect()` atualiza pontuação e energia via `addPoints()` e `addEnergy()`.
- `handleNext()` avança para a próxima pergunta ou marca o quiz como concluído.
- `speakQuestion()` usa a API de `speechSynthesis` para ler a pergunta em voz alta.

### Fluxo de telas
1. Seleção de categoria.
2. Seleção de nível.
3. Exibição da pergunta.
4. Exibição do feedback da resposta.
5. Resultado final ao concluir todas as perguntas.

## `Rewards.tsx`

### Objetivo
Permitir que o usuário desbloqueie e equipe avatares e fundos usando pontos.

### Estado e lógica
- `pokemonData` - lista de avatares de Pokémon com imagens carregadas da API.
- `loading` - indica se as imagens ainda estão sendo buscadas.
- `user` - estado global do usuário com pontos, itens desbloqueados e itens selecionados.

### Comportamento
- Busca imagens do Pokémon com `fetch` para exibir avatares reais.
- `handleAvatarClick()` desbloqueia, equipa ou desequipa um avatar.
- `handleBackgroundClick()` faz o mesmo para fundos.
- Exibe abas com `Tabs` para organizar `Avatares` e `Fundos`.

### Dica
Se `user.totalPoints` não for suficiente, o card exibe um overlay de bloqueio.
O usuário pode clicar em um avatar ou fundo já desbloqueado para equipar ou remover.

## `Profile.tsx`

### Objetivo
Exibir e permitir a edição dos dados pessoais do usuário.

### Estado e lógica
- `isEditing` - ativa o modo de edição.
- `name` e `age` - campos de formulário controlados.
- `updateUser()` - atualiza o contexto global do usuário.

### Interface
- Painel lateral com avatar, pontos e estatísticas de avatares e fundos desbloqueados.
- Formulário principal com `Input` para nome e idade.
- Botões `Voltar` e `Editar/Salvar` para controlar o modo de edição.

### Fluxo
1. O usuário vê seus dados carregados de `user`.
2. Clica em `Editar` para mudar o nome ou idade.
3. Clica em `Salvar` para enviar os dados ao contexto.

## `Ranking.tsx`

### Objetivo
Mostrar a lista de jogadores ordenada por energia e destacar a posição do usuário.

### Estado e lógica
- `rankings` - lista de jogadores calculada a partir de dados simulados.
- `user` - usado para determinar a posição atual do jogador.

### Comportamento
- Ordena os dados por energia em ordem decrescente.
- Recalcula as posições com `map()` após a ordenação.
- Destaque visual para o usuário atual e para os top 3 colocados.

### Dica
O ranking mostra uma posição fixa do usuário com `currentUserRank`, mesmo que os dados sejam simulados.

## Como estudar com este arquivo

1. Abra a página que você deseja entender primeiro.
2. Leia esta descrição para saber o propósito e os estados usados.
3. Depois, abra o arquivo e procure os comentários `//` no código.
4. Teste no navegador e observe como a interação muda o estado em tempo real.
