import type { GameState, RoleId } from '../types/game';
import type { GameAction } from './actions';
import { ALL_ROLE_IDS, getDefaultRoleCounts } from '../constants/roles';
import { shuffle } from '../utils/shuffle';
import type { GameSettings } from './gameSettings';

const DEFAULT_PLAYER_COUNT = 6;

function buildInitialRoleCounts(playerCount: number) {
  const defaults = getDefaultRoleCounts(playerCount);
  return ALL_ROLE_IDS.map((id) => ({ roleId: id, count: defaults[id] }));
}

export function createInitialState(settings?: GameSettings | null): GameState {
  const playerCount = settings?.playerCount ?? DEFAULT_PLAYER_COUNT;
  return {
    phase: 'setup',
    playerCount,
    roleCounts: settings?.roleCounts.map((role) => ({ ...role })) ?? buildInitialRoleCounts(playerCount),
    players: [],
    currentDealingIndex: 0,
    isRevealing: false,
    currentDayNightPhase: 'day',
    dayNumber: 1,
    winner: null,
  };
}

export const initialState = createInitialState();

function checkWinner(players: GameState['players']): GameState['winner'] {
  const alive = players.filter((p) => p.isAlive);
  const mafiaAlive = alive.filter((p) => {
    const def = p.roleId;
    return def === 'mafia' || def === 'don' || def === 'werewolf' || def === 'lawyer';
  }).length;
  const maniacAlive = alive.filter((p) => p.roleId === 'maniac').length;
  const townAlive = alive.filter((p) => {
    return p.roleId !== 'mafia' && p.roleId !== 'don' && p.roleId !== 'werewolf' && p.roleId !== 'lawyer' && p.roleId !== 'maniac';
  }).length;

  if (maniacAlive > 0 && mafiaAlive === 0 && townAlive === 0) return 'solo';
  if (mafiaAlive === 0 && maniacAlive === 0) return 'town';
  if (mafiaAlive >= townAlive + maniacAlive) return 'mafia';
  return null;
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_PLAYER_COUNT': {
      const count = Math.min(20, Math.max(4, action.count));
      if (count === state.playerCount) return state;
      return { ...state, playerCount: count, roleCounts: buildInitialRoleCounts(count) };
    }

    case 'SET_ROLE_COUNT': {
      const updated = state.roleCounts.map((rc) =>
        rc.roleId === action.roleId ? { ...rc, count: Math.max(0, action.count) } : rc
      );
      return { ...state, roleCounts: updated };
    }

    case 'START_DEALING': {
      const total = state.roleCounts.reduce((s, rc) => s + rc.count, 0);
      if (total !== state.playerCount) return state;

      const roleList: RoleId[] = state.roleCounts.flatMap((rc) =>
        Array<RoleId>(rc.count).fill(rc.roleId)
      );
      const shuffled = shuffle(roleList);
      const players = shuffled.map((roleId, i) => ({
        id: i + 1,
        roleId,
        isAlive: true,
      }));

      return {
        ...state,
        phase: 'dealing',
        players,
        currentDealingIndex: 0,
        isRevealing: false,
      };
    }

    case 'REVEAL_ROLE':
      return { ...state, isRevealing: true };

    case 'HIDE_AND_ADVANCE': {
      const next = state.currentDealingIndex + 1;
      return {
        ...state,
        isRevealing: false,
        currentDealingIndex: next,
      };
    }

    case 'START_GAME':
      return {
        ...state,
        phase: 'game',
        currentDayNightPhase: 'day',
        dayNumber: 1,
        winner: null,
      };

    case 'TOGGLE_PLAYER_ALIVE': {
      const players = state.players.map((p) =>
        p.id === action.playerId ? { ...p, isAlive: !p.isAlive } : p
      );
      return { ...state, players, winner: checkWinner(players) };
    }

    case 'SET_PHASE': {
      const dayNumber =
        action.phase === 'day' ? state.dayNumber + 1 : state.dayNumber;
      return { ...state, currentDayNightPhase: action.phase, dayNumber };
    }

    case 'RESET_GAME':
      return createInitialState(state);

    default:
      return state;
  }
}
