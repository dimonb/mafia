import { useState } from 'react';
import { useGame } from '../hooks/useGame';
import PlayerAvatar from '../components/PlayerAvatar';
import ConfirmDialog from '../components/ConfirmDialog';
import type { Faction } from '../types/game';

const WINNER_CONFIG: Record<Faction, { label: string; emoji: string; bg: string }> = {
  town: { label: 'Мирные победили!', emoji: '🎉', bg: 'bg-sky-600' },
  mafia: { label: 'Мафия победила!', emoji: '💀', bg: 'bg-red-700' },
  solo: { label: 'Маньяк победил!', emoji: '🔪', bg: 'bg-purple-700' },
};

export default function GameScreen() {
  const { state, dispatch } = useGame();
  const { players, currentDayNightPhase, dayNumber, winner } = state;

  const [confirmPlayerId, setConfirmPlayerId] = useState<number | null>(null);

  const alive = players.filter((p) => p.isAlive);
  const mafiaAlive = alive.filter((p) =>
    ['mafia', 'don', 'werewolf', 'lawyer'].includes(p.roleId)
  ).length;
  const townAlive = alive.filter((p) =>
    !['mafia', 'don', 'werewolf', 'lawyer', 'maniac'].includes(p.roleId)
  ).length;

  const isNight = currentDayNightPhase === 'night';

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${isNight ? 'bg-slate-950' : 'bg-slate-800'}`}>
      {/* Phase toggle */}
      <button
        onClick={() => dispatch({ type: 'SET_PHASE', phase: isNight ? 'day' : 'night' })}
        className={`w-full py-4 flex items-center justify-center gap-3 text-lg font-bold transition-colors ${isNight ? 'bg-indigo-950 text-indigo-200' : 'bg-amber-500 text-amber-950'}`}
      >
        <span className="text-2xl">{isNight ? '🌙' : '☀️'}</span>
        <span>{isNight ? `Ночь ${dayNumber}` : `День ${dayNumber}`}</span>
        <span className="text-sm opacity-60 ml-1">→ переключить</span>
      </button>

      {/* Players grid */}
      <div className="flex-1 p-4">
        <div className="grid grid-cols-3 gap-3">
          {players.map((p) => (
            <PlayerAvatar
              key={p.id}
              id={p.id}
              isAlive={p.isAlive}
              onClick={() => setConfirmPlayerId(p.id)}
            />
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-slate-900 px-5 py-3 flex justify-around border-t border-slate-700">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{alive.length}</div>
          <div className="text-slate-400 text-xs">Живых</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-sky-400">{townAlive}</div>
          <div className="text-slate-400 text-xs">Мирных</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-400">{mafiaAlive}</div>
          <div className="text-slate-400 text-xs">Мафии</div>
        </div>
        <button
          onClick={() => dispatch({ type: 'RESET_GAME' })}
          className="text-center"
        >
          <div className="text-2xl">🔄</div>
          <div className="text-slate-400 text-xs">Заново</div>
        </button>
      </div>

      {/* Confirm kill dialog */}
      {confirmPlayerId !== null && (
        <ConfirmDialog
          message={`Убить Игрока ${confirmPlayerId}?`}
          onConfirm={() => {
            dispatch({ type: 'TOGGLE_PLAYER_ALIVE', playerId: confirmPlayerId });
            setConfirmPlayerId(null);
          }}
          onCancel={() => setConfirmPlayerId(null)}
        />
      )}

      {/* Winner overlay */}
      {winner && (
        <div className={`fixed inset-0 ${WINNER_CONFIG[winner].bg} flex flex-col items-center justify-center gap-6 z-50`}>
          <div className="text-8xl">{WINNER_CONFIG[winner].emoji}</div>
          <div className="text-white text-3xl font-bold text-center px-6">
            {WINNER_CONFIG[winner].label}
          </div>
          <button
            onClick={() => dispatch({ type: 'RESET_GAME' })}
            className="mt-4 px-8 py-4 rounded-2xl bg-white/20 text-white text-lg font-bold active:bg-white/30"
          >
            Новая игра
          </button>
        </div>
      )}
    </div>
  );
}
