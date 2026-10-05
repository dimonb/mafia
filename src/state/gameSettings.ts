import { ALL_ROLE_IDS } from '../constants/roles';
import type { GameState, RoleCount, RoleId } from '../types/game';

export type GameSettings = Pick<GameState, 'playerCount' | 'roleCounts'>;

export const GAME_SETTINGS_KEY = 'mafia:game-settings';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function loadGameSettings(storage?: Pick<Storage, 'getItem'>): GameSettings | null {
  try {
    const raw = (storage ?? window.localStorage).getItem(GAME_SETTINGS_KEY);
    if (raw === null) return null;

    const saved: unknown = JSON.parse(raw);
    if (!isRecord(saved) || saved.version !== 1) return null;

    const { playerCount, roleCounts } = saved;
    if (typeof playerCount !== 'number' || !Number.isInteger(playerCount)
      || playerCount < 4 || playerCount > 20 || !Array.isArray(roleCounts)
      || roleCounts.length !== ALL_ROLE_IDS.length) return null;

    const counts = new Map<RoleId, number>();
    for (const role of roleCounts) {
      if (!isRecord(role) || !ALL_ROLE_IDS.includes(role.roleId as RoleId)
        || counts.has(role.roleId as RoleId) || typeof role.count !== 'number'
        || !Number.isInteger(role.count) || role.count < 0 || role.count > 20) return null;
      counts.set(role.roleId as RoleId, role.count);
    }

    // In-progress setups may have a role total different from the player count.
    return {
      playerCount,
      roleCounts: ALL_ROLE_IDS.map((roleId): RoleCount => ({ roleId, count: counts.get(roleId)! })),
    };
  } catch {
    // Storage may be blocked, unavailable, or contain invalid JSON.
    return null;
  }
}

export function saveGameSettings(settings: GameSettings, storage?: Pick<Storage, 'setItem'>): void {
  try {
    (storage ?? window.localStorage).setItem(GAME_SETTINGS_KEY, JSON.stringify({
      version: 1,
      playerCount: settings.playerCount,
      roleCounts: settings.roleCounts.map(({ roleId, count }) => ({ roleId, count })),
    }));
  } catch {
    // A storage failure must never prevent playing the game.
  }
}
