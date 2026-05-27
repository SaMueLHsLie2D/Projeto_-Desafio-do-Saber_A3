# Pasta `src`

A pasta `src` contém todo o código fonte do front-end.

## Arquivos principais

- `main.tsx`
  - Inicializa o React e renderiza o componente `App`.
  - Importa o CSS global `App.css`.

- `App.css`
  - Estilos globais do projeto.
  - Contém classes comuns usadas por várias páginas.

- `app/App.tsx`
  - Componente de alto nível que inicia o app.
  - Envolve a aplicação com o `UserProvider` para estado global e com o `RouterProvider` para navegação.
  - Não contém interface do usuário diretamente; ele apenas monta o ambiente.

- `app/routes.tsx`
  - Configura as rotas do React Router.
  - Cada rota conecta um caminho da URL a um componente de página.
  - Permite navegar entre `/home`, `/quiz`, `/recompensas`, `/perfil`, `/ranking` e outros.

- `app/UserContext.tsx`
  - Define o estado global do usuário e as ações disponíveis.
  - Mantém `user`, `totalPoints`, `energy`, `selectedAvatar`, `selectedBackground`, `unlockedAvatars`, e `unlockedBackgrounds`.
  - Fornece funções para atualizar esses valores em qualquer página.

- `app/types.ts`
  - Contém os tipos TypeScript usados no projeto.
  - Por exemplo, define a forma de `User`, `Question`, `Attempt` ou outros dados.

## Fluxo geral

1. `main.tsx` carrega `App`.
2. `App.tsx` adiciona contexto e rotas.
3. `routes.tsx` escolhe a página que será exibida.
4. As páginas consumem `UserContext` para ler e atualizar os dados do usuário.
