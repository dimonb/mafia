import { createContext, useEffect, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { GameState } from '../types/game';
import type { GameAction } from './actions';
import { createInitialState, gameReducer } from './gameReducer';
import { loadGameSettings, saveGameSettings } from './gameSettings';

export const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, null, () => createInitialState(loadGameSettings()));

  useEffect(() => {
    saveGameSettings({ playerCount: state.playerCount, roleCounts: state.roleCounts });
  }, [state.playerCount, state.roleCounts]);
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}
