import { Question } from './types';

export const questions: Question[] = [
  // Matemática - Fácil
  {
    id: 'mat-fac-1',
    category: 'matematica',
    level: 'facil',
    question: 'Quanto é 2 + 3?',
    options: ['4', '5', '6', '7'],
    correctAnswer: 1,
    explanation: 'Muito bem! 2 + 3 = 5. Você pode contar nos dedos!'
  },
  {
    id: 'mat-fac-2',
    category: 'matematica',
    level: 'facil',
    question: 'Se eu tenho 4 balas e ganho mais 2, quantas balas tenho?',
    options: ['5', '6', '7', '8'],
    correctAnswer: 1,
    explanation: 'Isso mesmo! 4 + 2 = 6 balas. Delícia!'
  },
  {
    id: 'mat-fac-3',
    category: 'matematica',
    level: 'facil',
    question: 'Quanto é 10 - 3?',
    options: ['6', '7', '8', '9'],
    correctAnswer: 1,
    explanation: 'Parabéns! 10 - 3 = 7. Você é muito esperto!'
  },
  {
    id: 'mat-fac-4',
    category: 'matematica',
    level: 'facil',
    question: 'Qual é o dobro de 6?',
    options: ['10', '12', '14', '16'],
    correctAnswer: 1,
    explanation: 'Muito bem! O dobro de 6 é 12 (6 × 2 = 12)!'
  },
  {
    id: 'mat-fac-5',
    category: 'matematica',
    level: 'facil',
    question: 'Quanto é 20 dividido por 4?',
    options: ['4', '5', '6', '7'],
    correctAnswer: 1,
    explanation: 'Perfeito! 20 ÷ 4 = 5!'
  },
  
  // Matemática - Médio
  {
    id: 'mat-med-1',
    category: 'matematica',
    level: 'medio',
    question: 'Quanto é 5 × 4?',
    options: ['15', '20', '25', '30'],
    correctAnswer: 1,
    explanation: 'Excelente! 5 × 4 = 20. A tabuada do 5 é legal!'
  },
  {
    id: 'mat-med-2',
    category: 'matematica',
    level: 'medio',
    question: 'Se uma dúzia tem 12 unidades, meia dúzia tem quantas?',
    options: ['4', '6', '8', '10'],
    correctAnswer: 1,
    explanation: 'Perfeito! Meia dúzia = 12 ÷ 2 = 6 unidades.'
  },
  {
    id: 'mat-med-3',
    category: 'matematica',
    level: 'medio',
    question: 'Qual é o resultado de 8 × 7?',
    options: ['54', '56', '58', '60'],
    correctAnswer: 1,
    explanation: 'Excelente! 8 × 7 = 56!'
  },
  {
    id: 'mat-med-4',
    category: 'matematica',
    level: 'medio',
    question: 'Pedro tem 50 reais e gastou 18. Quanto sobrou?',
    options: ['30', '32', '34', '32'],
    correctAnswer: 1,
    explanation: 'Correto! 50 - 18 = 32 reais!'
  },
  {
    id: 'mat-med-5',
    category: 'matematica',
    level: 'medio',
    question: 'Quanto é 100 dividido por 5?',
    options: ['15', '20', '25', '30'],
    correctAnswer: 1,
    explanation: 'Ótimo! 100 ÷ 5 = 20!'
  },
  
  // Matemática - Difícil
  {
    id: 'mat-dif-1',
    category: 'matematica',
    level: 'dificil',
    question: 'Qual é o resultado de 15 + 8 - 5?',
    options: ['16', '17', '18', '19'],
    correctAnswer: 2,
    explanation: 'Fantástico! 15 + 8 = 23, depois 23 - 5 = 18!'
  },
  {
    id: 'mat-dif-2',
    category: 'matematica',
    level: 'dificil',
    question: 'Qual é 25% de 80?',
    options: ['15', '20', '25', '30'],
    correctAnswer: 1,
    explanation: 'Perfeito! 25% de 80 = 20 (80 ÷ 4 = 20)!'
  },
  {
    id: 'mat-dif-3',
    category: 'matematica',
    level: 'dificil',
    question: 'Qual é o resultado de 12 × 11?',
    options: ['120', '132', '144', '156'],
    correctAnswer: 1,
    explanation: 'Excelente! 12 × 11 = 132!'
  },
  {
    id: 'mat-dif-4',
    category: 'matematica',
    level: 'dificil',
    question: 'Se 3x = 27, quanto vale x?',
    options: ['7', '9', '11', '13'],
    correctAnswer: 1,
    explanation: 'Ótimo! x = 9 porque 3 × 9 = 27!'
  },
  
  // Português - Fácil
  {
    id: 'port-fac-1',
    category: 'portugues',
    level: 'facil',
    question: 'Quantas vogais existem no alfabeto?',
    options: ['3', '4', '5', '6'],
    correctAnswer: 2,
    explanation: 'Isso aí! São 5 vogais: A, E, I, O, U.'
  },
  {
    id: 'port-fac-2',
    category: 'portugues',
    level: 'facil',
    question: 'Qual palavra começa com a letra B?',
    options: ['Casa', 'Bola', 'Dado', 'Fada'],
    correctAnswer: 1,
    explanation: 'Correto! BOLA começa com a letra B!'
  },
  {
    id: 'port-fac-3',
    category: 'portugues',
    level: 'facil',
    question: 'Como se escreve o número 2?',
    options: ['DOIS', 'DOSE', 'DUIS', 'DEIS'],
    correctAnswer: 0,
    explanation: 'Muito bem! O número 2 se escreve DOIS.'
  },
  {
    id: 'port-fac-4',
    category: 'portugues',
    level: 'facil',
    question: 'Qual palavra rima com GATO?',
    options: ['RATO', 'PATO', 'SAPATO', 'Todas as anteriores'],
    correctAnswer: 3,
    explanation: 'Perfeito! GATO rima com RATO, PATO e SAPATO!'
  },
  {
    id: 'port-fac-5',
    category: 'portugues',
    level: 'facil',
    question: 'Qual é a primeira letra do alfabeto?',
    options: ['A', 'B', 'C', 'D'],
    correctAnswer: 0,
    explanation: 'Correto! A letra A é a primeira do alfabeto!'
  },
  
  // Português - Médio
  {
    id: 'port-med-1',
    category: 'portugues',
    level: 'medio',
    question: 'Qual é o plural de "animal"?',
    options: ['Animals', 'Animales', 'Animais', 'Animalos'],
    correctAnswer: 2,
    explanation: 'Perfeito! O plural de animal é ANIMAIS.'
  },
  {
    id: 'port-med-2',
    category: 'portugues',
    level: 'medio',
    question: 'Quantas sílabas tem a palavra BANANA?',
    options: ['2', '3', '4', '5'],
    correctAnswer: 1,
    explanation: 'Isso mesmo! BA-NA-NA = 3 sílabas!'
  },
  {
    id: 'port-med-3',
    category: 'portugues',
    level: 'medio',
    question: 'Qual é o sinônimo de FELIZ?',
    options: ['Triste', 'Alegre', 'Bravo', 'Cansado'],
    correctAnswer: 1,
    explanation: 'Muito bem! FELIZ e ALEGRE significam a mesma coisa!'
  },
  {
    id: 'port-med-4',
    category: 'portugues',
    level: 'medio',
    question: 'Qual é o plural de PAPEL?',
    options: ['Papéis', 'Papeles', 'Papels', 'Papéus'],
    correctAnswer: 0,
    explanation: 'Correto! O plural de PAPEL é PAPÉIS!'
  },
  {
    id: 'port-med-5',
    category: 'portugues',
    level: 'medio',
    question: 'Complete: "O cachorro _____ no quintal"',
    options: ['corre', 'correm', 'correndo', 'correram'],
    correctAnswer: 0,
    explanation: 'Excelente! "O cachorro corre" está correto!'
  },
  
  // Português - Difícil
  {
    id: 'port-dif-1',
    category: 'portugues',
    level: 'dificil',
    question: 'Qual palavra está escrita corretamente?',
    options: ['Esxemplo', 'Exemplo', 'Ezemplo', 'Exenplo'],
    correctAnswer: 1,
    explanation: 'Excelente! A forma correta é EXEMPLO.'
  },
  {
    id: 'port-dif-2',
    category: 'portugues',
    level: 'dificil',
    question: 'Qual é o aumentativo de CASA?',
    options: ['Casinha', 'Casarão', 'Casita', 'Casona'],
    correctAnswer: 1,
    explanation: 'Perfeito! O aumentativo de CASA é CASARÃO!'
  },
  {
    id: 'port-dif-3',
    category: 'portugues',
    level: 'dificil',
    question: 'Qual é o coletivo de PEIXES?',
    options: ['Cardume', 'Bando', 'Matilha', 'Enxame'],
    correctAnswer: 0,
    explanation: 'Ótimo! O coletivo de peixes é CARDUME!'
  },
  {
    id: 'port-dif-4',
    category: 'portugues',
    level: 'dificil',
    question: 'Qual frase está correta?',
    options: ['Nós vai na escola', 'Nós vamos na escola', 'Nós vão na escola', 'Nós vamo na escola'],
    correctAnswer: 1,
    explanation: 'Correto! "Nós vamos" é a conjugação certa!'
  },
  
  // Ciências - Fácil
  {
    id: 'cien-fac-1',
    category: 'ciencias',
    level: 'facil',
    question: 'Qual é a cor do sol?',
    options: ['Azul', 'Verde', 'Amarelo', 'Rosa'],
    correctAnswer: 2,
    explanation: 'Isso aí! O sol é amarelo e nos dá luz e calor!'
  },
  {
    id: 'cien-fac-2',
    category: 'ciencias',
    level: 'facil',
    question: 'Quantas patas tem um cachorro?',
    options: ['2', '3', '4', '5'],
    correctAnswer: 2,
    explanation: 'Muito bem! Os cachorros têm 4 patas!'
  },
  {
    id: 'cien-fac-3',
    category: 'ciencias',
    level: 'facil',
    question: 'As plantas precisam de água para viver?',
    options: ['Sim', 'Não', 'Às vezes', 'Nunca'],
    correctAnswer: 0,
    explanation: 'Correto! Todas as plantas precisam de água!'
  },
  {
    id: 'cien-fac-4',
    category: 'ciencias',
    level: 'facil',
    question: 'Qual destes é um inseto?',
    options: ['Cachorro', 'Gato', 'Borboleta', 'Peixe'],
    correctAnswer: 2,
    explanation: 'Muito bem! A borboleta é um inseto!'
  },
  {
    id: 'cien-fac-5',
    category: 'ciencias',
    level: 'facil',
    question: 'De onde vem o leite?',
    options: ['Das árvores', 'Da vaca', 'Do mar', 'Das nuvens'],
    correctAnswer: 1,
    explanation: 'Correto! O leite vem da vaca!'
  },
  
  // Ciências - Médio
  {
    id: 'cien-med-1',
    category: 'ciencias',
    level: 'medio',
    question: 'Qual destes animais é um mamífero?',
    options: ['Peixe', 'Gato', 'Borboleta', 'Cobra'],
    correctAnswer: 1,
    explanation: 'Perfeito! O gato é um mamífero, assim como você!'
  },
  {
    id: 'cien-med-2',
    category: 'ciencias',
    level: 'medio',
    question: 'Quantos planetas existem no Sistema Solar?',
    options: ['6', '7', '8', '9'],
    correctAnswer: 2,
    explanation: 'Ótimo! São 8 planetas no nosso Sistema Solar!'
  },
  {
    id: 'cien-med-3',
    category: 'ciencias',
    level: 'medio',
    question: 'Qual é o maior órgão do corpo humano?',
    options: ['Coração', 'Pulmão', 'Pele', 'Fígado'],
    correctAnswer: 2,
    explanation: 'Perfeito! A pele é o maior órgão do nosso corpo!'
  },
  {
    id: 'cien-med-4',
    category: 'ciencias',
    level: 'medio',
    question: 'O que as plantas produzem através da fotossíntese?',
    options: ['Água', 'Oxigênio', 'Gás carbônico', 'Nitrogênio'],
    correctAnswer: 1,
    explanation: 'Excelente! As plantas produzem oxigênio!'
  },
  {
    id: 'cien-med-5',
    category: 'ciencias',
    level: 'medio',
    question: 'Qual é o estado físico da água no gelo?',
    options: ['Líquido', 'Gasoso', 'Sólido', 'Plasma'],
    correctAnswer: 2,
    explanation: 'Correto! O gelo é água no estado sólido!'
  },
  
  // Ciências - Difícil
  {
    id: 'cien-dif-1',
    category: 'ciencias',
    level: 'dificil',
    question: 'O que acontece com a água quando esquenta muito?',
    options: ['Congela', 'Vira gelo', 'Evapora', 'Fica vermelha'],
    correctAnswer: 2,
    explanation: 'Excelente! A água evapora e vira vapor quando esquenta!'
  },
  {
    id: 'cien-dif-2',
    category: 'ciencias',
    level: 'dificil',
    question: 'Qual é a velocidade da luz?',
    options: ['100.000 km/s', '200.000 km/s', '300.000 km/s', '400.000 km/s'],
    correctAnswer: 2,
    explanation: 'Incrível! A luz viaja a aproximadamente 300.000 km/s!'
  },
  {
    id: 'cien-dif-3',
    category: 'ciencias',
    level: 'dificil',
    question: 'Qual planeta é conhecido como "planeta vermelho"?',
    options: ['Vênus', 'Marte', 'Júpiter', 'Saturno'],
    correctAnswer: 1,
    explanation: 'Perfeito! Marte é chamado de planeta vermelho!'
  },
  {
    id: 'cien-dif-4',
    category: 'ciencias',
    level: 'dificil',
    question: 'Qual é o processo de transformação da água em gelo?',
    options: ['Evaporação', 'Condensação', 'Solidificação', 'Sublimação'],
    correctAnswer: 2,
    explanation: 'Ótimo! Solidificação é quando a água vira gelo!'
  },
];