# Pasta `src/app`

A pasta `src/app` contém o núcleo do front-end: o componente raiz, rotas, contexto e as páginas principais.

## O que é o contexto de usuário?

O contexto (`UserContext.tsx`) armazena os dados do usuário que devem estar disponíveis em várias páginas.
Ele funciona como um "armazenamento global" que evita enviar props de pai para filho repetidamente.

## `UserContext.tsx`

### O que está no estado inicial

O `defaultUser` contém campos como:
- `name` e `age` - informações básicas do usuário.
- `totalPoints` e `energy` - pontuação e energia acumulada.
- `selectedAvatar` e `selectedBackground` - itens escolhidos pelo usuário.
- `unlockedAvatars` e `unlockedBackgrounds` - itens desbloqueados.

### Funções disponíveis

O contexto expõe estas ações:
- `updateUser(updates)`
  - Atualiza qualquer campo do usuário.
  - Usado no perfil e na tela de boas-vindas.
- `addPoints(points)`
  - Soma pontos ao total.
- `spendPoints(points)`
  - Diminui pontos, sem deixar negativo.
- `addEnergy(energy)`
  - Soma energia.
- `unlockAvatar(avatarUrl)` / `unlockBackground(backgroundUrl)`
  - Adicionam itens desbloqueados ao usuário.
- `setAvatar(avatarUrl | null)` / `setBackground(backgroundUrl | null)`
  - Selecionam ou removem o avatar e fundo atuais.

### Provider e hook

- `UserProvider` envolve a aplicação em `App.tsx`.
- Isso significa que todas as páginas dentro do app podem acessar o mesmo estado.
- `useUser()` é o hook personalizado que lê o contexto.

Exemplo de uso em uma página:

```tsx
const { user, addPoints, unlockAvatar } = useUser();
```

### Por que isso é importante?

Sem contexto, cada página teria seu próprio estado isolado.
Com contexto, quando o usuário ganha pontos no quiz, essa mudança aparece imediatamente em `Home`, `Profile`, `Rewards` e `Ranking`.

## Aplicação do fundo selecionado

Dentro do `UserProvider`, há um `useEffect` que observa `user.selectedBackground`.
Quando o usuário escolhe um novo fundo, o código aplica um gradiente diretamente no elemento `#root`.

Isso permite que a cor de fundo mude sem precisar passar o valor por props para todas as páginas.

## Dicas para estudar

1. Leia `UserContext.tsx` e entenda como o estado é criado.
2. Procure onde `useUser()` é usado nas páginas.
3. Veja como `updateUser`, `addPoints` e `setBackground` afetam o app em tempo real.
