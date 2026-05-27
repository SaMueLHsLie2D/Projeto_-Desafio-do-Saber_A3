# Estrutura do Front-end

A organização do front-end é a seguinte:

- `src/`
  - `main.tsx` - ponto de entrada do app React.
  - `App.css` - estilos globais usados pelo app.
  - `app/`
    - `App.tsx` - componente raiz que envolve o app com contexto e rotas.
    - `routes.tsx` - define as rotas do React Router.
    - `UserContext.tsx` - contexto global para dados do usuário.
    - `types.ts` - tipos TypeScript usados pelo app.
    - `pages/` - páginas principais da aplicação.
    - `components/` - componentes reutilizáveis e blocos de interface.
    - `components/ui/` - componentes de interface genéricos (botões, inputs, tabs etc.).
    - `data/` - dados estáticos consumidos pelo app, como dicas e perguntas.

O fluxo principal é: `main.tsx` → `App.tsx` → `RouterProvider` → páginas.
Os arquivos de página exibem UI e usam o `UserContext` para estado compartilhado.
