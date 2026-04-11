import { createContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { GameState } from '../types/game';
import type { GameAction } from './actions';
import { gameReducer, initialState } from './gameReducer';

export const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}
