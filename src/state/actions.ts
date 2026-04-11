import type { RoleId, DayNightPhase } from '../types/game';

export type GameAction =
  | { type: 'SET_PLAYER_COUNT'; count: number }
  | { type: 'SET_ROLE_COUNT'; roleId: RoleId; count: number }
  | { type: 'START_DEALING' }
  | { type: 'REVEAL_ROLE' }
  | { type: 'HIDE_AND_ADVANCE' }
  | { type: 'START_GAME' }
  | { type: 'TOGGLE_PLAYER_ALIVE'; playerId: number }
  | { type: 'SET_PHASE'; phase: DayNightPhase }
  | { type: 'RESET_GAME' };
