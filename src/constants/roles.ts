import type { RoleDefinition, RoleId } from '../types/game';

export const ROLE_DEFINITIONS: Record<RoleId, RoleDefinition> = {
  civilian: {
    id: 'civilian',
    name: 'Мирный житель',
    description: 'Голосуй днём, вычисляй мафию, защищай город.',
    faction: 'town',
    bgClass: 'bg-sky-500',
    icon: '🏘️',
  },
  mafia: {
    id: 'mafia',
    name: 'Мафия',
    description: 'Ночью вместе с командой выбираете жертву для устранения.',
    faction: 'mafia',
    bgClass: 'bg-red-700',
    icon: '🔫',
  },
  don: {
    id: 'don',
    name: 'Дон Мафии',
    description: 'Глава мафии. Ночью можешь проверить — шериф ли игрок.',
    faction: 'mafia',
    bgClass: 'bg-red-900',
    icon: '👑',
  },
  sheriff: {
    id: 'sheriff',
    name: 'Шериф',
    description: 'Ночью проверяешь одного игрока — мирный он или мафия.',
    faction: 'town',
    bgClass: 'bg-yellow-500',
    icon: '⭐',
  },
  doctor: {
    id: 'doctor',
    name: 'Доктор',
    description: 'Ночью лечишь одного игрока (можно себя). Спасаешь от убийства.',
    faction: 'town',
    bgClass: 'bg-green-600',
    icon: '💊',
  },
  lucky: {
    id: 'lucky',
    name: 'Везунчик',
    description: 'Мафия не может убить тебя ночью — пуля не берёт. Голосованием убить можно.',
    faction: 'town',
    bgClass: 'bg-pink-500',
    icon: '🍀',
  },
  maniac: {
    id: 'maniac',
    name: 'Маньяк',
    description: 'Одиночка. Ночью убиваешь сам. Побеждаешь, если останешься последним.',
    faction: 'solo',
    bgClass: 'bg-purple-700',
    icon: '🔪',
  },
  suicide_bomber: {
    id: 'suicide_bomber',
    name: 'Суицидник',
    description: 'Побеждаешь, если город убивает тебя на дневном голосовании. Если убивает мафия — обычная смерть.',
    faction: 'solo',
    bgClass: 'bg-orange-600',
    icon: '💣',
  },
  werewolf: {
    id: 'werewolf',
    name: 'Оборотень',
    description: 'Выглядишь как мирный. Действуешь вместе с мафией. Шериф видит тебя мирным.',
    faction: 'mafia',
    bgClass: 'bg-slate-600',
    icon: '🐺',
  },
  lawyer: {
    id: 'lawyer',
    name: 'Адвокат',
    description: 'Ночью блокируешь одного игрока — он не может использовать способность.',
    faction: 'town',
    bgClass: 'bg-amber-600',
    icon: '⚖️',
  },
};

export const FACTION_LABELS: Record<string, string> = {
  town: 'Мирные',
  mafia: 'Мафия',
  solo: 'Одиночка',
};

export const ALL_ROLE_IDS: RoleId[] = [
  'civilian',
  'mafia',
  'don',
  'sheriff',
  'doctor',
  'lucky',
  'maniac',
  'suicide_bomber',
  'werewolf',
  'lawyer',
];

export function getDefaultRoleCounts(playerCount: number) {
  const mafiaCount = Math.max(1, Math.floor(playerCount * 0.3));
  const donCount = playerCount >= 7 ? 1 : 0;
  const totalMafia = mafiaCount + donCount;
  const sheriffCount = 1;
  const doctorCount = playerCount >= 6 ? 1 : 0;
  const civilianCount = Math.max(1, playerCount - totalMafia - sheriffCount - doctorCount);

  return {
    civilian: civilianCount,
    mafia: mafiaCount,
    don: donCount,
    sheriff: sheriffCount,
    doctor: doctorCount,
    lucky: 0,
    maniac: 0,
    suicide_bomber: 0,
    werewolf: 0,
    lawyer: 0,
  } as Record<RoleId, number>;
}
