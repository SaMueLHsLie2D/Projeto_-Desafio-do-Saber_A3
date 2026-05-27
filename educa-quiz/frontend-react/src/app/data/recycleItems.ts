import { RecycleItem } from '../types';

export const recycleItems: RecycleItem[] = [
  // Papel
  { id: 'papel-1', name: 'Jornal', type: 'papel', emoji: '📰' },
  { id: 'papel-2', name: 'Caderno', type: 'papel', emoji: '📓' },
  { id: 'papel-3', name: 'Caixa de Papelão', type: 'papel', emoji: '📦' },
  { id: 'papel-4', name: 'Revista', type: 'papel', emoji: '📕' },
  
  // Plástico
  { id: 'plastico-1', name: 'Garrafa PET', type: 'plastico', emoji: '🍼' },
  { id: 'plastico-2', name: 'Sacola Plástica', type: 'plastico', emoji: '🛍️' },
  { id: 'plastico-3', name: 'Pote de Iogurte', type: 'plastico', emoji: '🥤' },
  { id: 'plastico-4', name: 'Brinquedo de Plástico', type: 'plastico', emoji: '🎮' },
  
  // Vidro
  { id: 'vidro-1', name: 'Garrafa de Vidro', type: 'vidro', emoji: '🍾' },
  { id: 'vidro-2', name: 'Pote de Conserva', type: 'vidro', emoji: '🫙' },
  { id: 'vidro-3', name: 'Copo de Vidro', type: 'vidro', emoji: '🥃' },
  
  // Orgânico
  { id: 'organico-1', name: 'Casca de Banana', type: 'organico', emoji: '🍌' },
  { id: 'organico-2', name: 'Casca de Maçã', type: 'organico', emoji: '🍎' },
  { id: 'organico-3', name: 'Folhas Secas', type: 'organico', emoji: '🍂' },
  { id: 'organico-4', name: 'Restos de Comida', type: 'organico', emoji: '🍽️' },
];
