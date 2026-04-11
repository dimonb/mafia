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
  const dead = players.filter((p) => !p.isAlive);
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
        className={`w-full py-3 md:py-4 flex items-center justify-center gap-3 text-lg font-bold transition-colors ${isNight ? 'bg-indigo-950 text-indigo-200 hover:bg-indigo-900' : 'bg-amber-500 text-amber-950 hover:bg-amber-400'}`}
      >
        <span className="text-2xl">{isNight ? '🌙' : '☀️'}</span>
        <span>{isNight ? `Ночь ${dayNumber}` : `День ${dayNumber}`}</span>
        <span className="text-sm opacity-50 ml-1">нажмите для переключения</span>
      </button>

      {/* Content: stacked on mobile, side-by-side on desktop */}
      <div className="flex-1 w-full max-w-4xl mx-auto md:flex md:gap-0 md:p-6 md:items-start">

        {/* Players grid */}
        <div className="flex-1 p-4 md:p-0 md:pr-6">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 gap-3">
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

        {/* Sidebar stats — bottom bar on mobile, right column on desktop */}
        <div className="md:w-52 md:shrink-0">
          {/* Mobile bottom bar */}
          <div className="md:hidden bg-slate-900 px-5 py-3 flex justify-around border-t border-slate-700">
            <StatItem value={alive.length} label="Живых" color="text-white" />
            <StatItem value={townAlive} label="Мирных" color="text-sky-400" />
            <StatItem value={mafiaAlive} label="Мафии" color="text-red-400" />
            <button onClick={() => dispatch({ type: 'RESET_GAME' })} className="text-center">
              <div className="text-2xl">🔄</div>
              <div className="text-slate-400 text-xs">Заново</div>
            </button>
          </div>

          {/* Desktop sidebar */}
          <div className="hidden md:flex md:flex-col gap-3">
            <div className="bg-slate-900/70 rounded-2xl p-4 flex flex-col gap-3">
              <StatCard value={alive.length} label="Живых" color="text-white" />
              <div className="border-t border-slate-700/50" />
              <StatCard value={townAlive} label="Мирных" color="text-sky-400" />
              <StatCard value={mafiaAlive} label="Мафии" color="text-red-400" />
              <StatCard value={dead.length} label="Выбыло" color="text-slate-500" />
            </div>
            <button
              onClick={() => dispatch({ type: 'RESET_GAME' })}
              className="w-full py-3 rounded-2xl bg-slate-700/70 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
            >
              🔄 Новая игра
            </button>
          </div>
        </div>
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
            className="mt-4 px-8 py-4 rounded-2xl bg-white/20 hover:bg-white/30 text-white text-lg font-bold transition-colors"
          >
            Новая игра
          </button>
        </div>
      )}
    </div>
  );
}

function StatItem({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="text-center">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-slate-400 text-xs">{label}</div>
    </div>
  );
}

function StatCard({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-slate-400 text-sm">{label}</div>
      <div className={`text-2xl font-bold tabular-nums ${color}`}>{value}</div>
    </div>
  );
}
