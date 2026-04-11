export type RoleId =
  | 'civilian'
  | 'mafia'
  | 'don'
  | 'sheriff'
  | 'doctor'
  | 'prostitute'
  | 'maniac'
  | 'suicide_bomber'
  | 'werewolf'
  | 'lawyer';

export type Faction = 'town' | 'mafia' | 'solo';
export type DayNightPhase = 'day' | 'night';
export type GamePhase = 'setup' | 'dealing' | 'game';

export interface RoleDefinition {
  id: RoleId;
  name: string;
  description: string;
  faction: Faction;
  bgClass: string;
  icon: string;
}

export interface PlayerState {
  id: number;
  roleId: RoleId;
  isAlive: boolean;
}

export interface RoleCount {
  roleId: RoleId;
  count: number;
}

export interface GameState {
  phase: GamePhase;
  playerCount: number;
  roleCounts: RoleCount[];
  players: PlayerState[];
  currentDealingIndex: number;
  isRevealing: boolean;
  currentDayNightPhase: DayNightPhase;
  dayNumber: number;
  winner: Faction | null;
}
