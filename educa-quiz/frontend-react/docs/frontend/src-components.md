# Pasta `src/app/components`

A pasta `src/app/components` contém componentes reutilizáveis que não são páginas inteiras.
Eles ajudam a dividir a interface em pedaços menores, facilitando manutenção e reaproveitamento.

## Componentes importantes

- `WelcomeScreen.tsx`
  - Modal de boas-vindas exibido na primeira visita.
  - Pergunta nome e idade do usuário e salva os dados no contexto global usando `useUser()`.
  - Usa animações e transições para aparecer/desaparecer.

- `Cards.tsx`
  - Componente que renderiza um bloco de cartão genérico.
  - Pode ser usado em diferentes páginas para organizar informações em cartões.

- `components/figma/ImageWithFallback.tsx`
  - Carrega imagens com fallback automático.
  - Se a URL da imagem falhar, exibe um substituto sem quebrar a interface.

## Componentes de UI genéricos

A pasta `components/ui` contém componentes básicos de interface usados em todo o app.
Eles são como "peças de Lego" que constroem a UI.

- `components/ui/button.tsx`
  - Botão reutilizável com variantes como `default`, `outline`, `secondary`, `ghost` e `link`.
  - Usa `class-variance-authority` para controlar estilos com variantes e tamanhos.
  - Exemplo: `<Button variant="outline">Voltar</Button>`.

- `components/ui/input.tsx`
  - Campo de texto padrão com aparência consistente.
  - Usado em formulários, como o perfil e a tela de boas-vindas.

- `components/ui/label.tsx`
  - Rótulo de formulário estilizado.
  - Permite associar texto a um campo de entrada.

- `components/ui/tabs.tsx`
  - Componente de abas para alternar entre seções.
  - Usado em `Rewards.tsx` para alternar entre Avatares e Fundos.

- `components/ui/table.tsx`, `components/ui/checkbox.tsx`, `components/ui/dialog.tsx`, etc.
  - Fornecem elementos de interface prontos e padronizados.
  - Reduzem a necessidade de repetir classes CSS em vários arquivos.

## Como os componentes são usados

- Páginas como `Home.tsx` usam `Button`, `motion.div` e componentes visuais para criar a tela principal.
- `Profile.tsx` usa `Input` e `Button` para editar os dados do usuário.
- `Rewards.tsx` usa `Tabs` para separar categorias de recompensas.
- O objetivo é manter o código das páginas mais limpo e concentrado na lógica, enquanto os componentes cuidam da aparência.

## Dica para estudar

Procure primeiro a página que você quer entender (`Home.tsx`, `Quiz.tsx`, etc.), depois abra os componentes de UI usados nela.
Isso ajuda a ver como cada peça funciona em conjunto.
