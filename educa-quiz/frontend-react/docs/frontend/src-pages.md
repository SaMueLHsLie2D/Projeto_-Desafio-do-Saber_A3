# Pasta `src/app/pages`

A pasta `src/app/pages` contém as páginas principais do projeto. Cada arquivo aqui representa uma tela que o usuário vê no navegador.

## Principais páginas

- `Login.tsx`
  - Primeira tela do app.
  - Exibe formulário de login e direciona para `/home` quando o usuário entra.
  - Simula autenticação para acessar o conteúdo do app.

- `Home.tsx`
  - Tela inicial com os cards de navegação para cada seção do app.
  - Mostra o nome do usuário, pontos, energia e uma dica ecológica aleatória.
  - Usa `WelcomeScreen` para pedir nome e idade na primeira visita.
  - Cada card é um `Link` que leva para outra página.

- `Quiz.tsx`
  - Controla o fluxo completo do quiz.
  - Tem etapas: seleção de categoria, seleção de nível, perguntas, resultado final.
  - Atualiza pontos e energia pelo contexto quando o usuário acerta.
  - Usa animações para transição entre perguntas.

- `QuizPlay.tsx`
  - Página que pode conter a jogada do quiz em um formato mais específico.
  - Serve como uma estrutura para separar lógica de interface, se necessário.

- `RecycleGame.tsx`
  - Jogo da reciclagem onde o usuário aprende a separar o lixo.
  - Exibe itens e resposta correta para ensinar reciclagem.

- `Rewards.tsx`
  - Mostra recompensas disponíveis para desbloquear.
  - Tem duas abas: Avatares e Fundos.
  - Permite equipar e desequipar itens com pontos.
  - Usa `useEffect` para buscar imagens de Pokémon e mostrar cards.

- `Profile.tsx`
  - Mostra os dados do usuário, estatísticas e avatar atual.
  - Permite entrar no modo de edição e ajustar nome e idade.
  - Usa componentes `Input` e `Button` para um formulário simples.

- `Ranking.tsx`
  - Exibe a lista de jogadores ordenada por energia.
  - Mostra a posição atual do usuário com destaque.
  - Usa dados simulados para montar o ranking.

- `NotFound.tsx`
  - Tela de erro 404.
  - Exibida sempre que o usuário visita uma rota desconhecida.

## Como as páginas se conectam

- `routes.tsx` define o caminho e a página correspondente.
- `Link` e `useNavigate` são usados para navegar sem recarregar a página.
- O estado global de usuário (`UserContext`) é acessado por páginas como `Home`, `Quiz`, `Profile`, `Rewards` e `Ranking`.

## Fluxo de navegação básico

1. O usuário entra em `/` e vê `Login.tsx`.
2. Após login, ele vai para `/home`.
3. Na home, escolhe onde ir: `/quiz`, `/reciclagem`, `/recompensas`, `/perfil` ou `/ranking`.
4. Cada página usa seus próprios componentes e lógica local, mas compartilha o mesmo estado global.
