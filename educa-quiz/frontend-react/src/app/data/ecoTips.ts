export const ecoTips = [
  'Você sabia? Uma garrafa de plástico pode levar até 400 anos para se decompor! 🌍',
  'Reciclar uma tonelada de papel salva 17 árvores! 🌳',
  'O vidro pode ser reciclado infinitas vezes sem perder qualidade! ♻️',
  'Restos de comida viram adubo para as plantas! 🌱',
  'Separar o lixo corretamente ajuda o meio ambiente e os animais! 🐻',
  'Uma lata de alumínio pode ser reciclada e voltar às prateleiras em 60 dias! 🥫',
  'Reciclar economiza energia e recursos naturais! ⚡',
  'O plástico que jogamos no lixo pode ir parar no oceano e prejudicar os peixes! 🐠',
  'Cada pessoa produz cerca de 1kg de lixo por dia! Vamos reduzir? 🗑️',
  'Compostar restos de comida reduz o desperdício e cria fertilizante natural! 🍂',
];

export function getRandomEcoTip(): string {
  return ecoTips[Math.floor(Math.random() * ecoTips.length)];
}
