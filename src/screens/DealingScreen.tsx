import { useEffect, useCallback } from 'react';
import { useGame } from '../hooks/useGame';
import RoleCard from '../components/RoleCard';
import LockScreen from '../components/LockScreen';

export default function DealingScreen() {
  const { state, dispatch } = useGame();
  const { players, currentDealingIndex, isRevealing, playerCount } = state;

  const allDealt = currentDealingIndex >= playerCount;
  const currentPlayer = players[currentDealingIndex];

  // Keep screen awake during dealing
  useEffect(() => {
    let wakeLock: WakeLockSentinel | null = null;
    if ('wakeLock' in navigator) {
      navigator.wakeLock.request('screen').then((lock) => {
        wakeLock = lock;
      }).catch(() => {});
    }
    return () => {
      wakeLock?.release();
    };
  }, []);

  const handleReveal = useCallback(() => {
    dispatch({ type: 'REVEAL_ROLE' });
  }, [dispatch]);

  const handleHide = useCallback(() => {
    dispatch({ type: 'HIDE_AND_ADVANCE' });
  }, [dispatch]);

  const handleStartGame = useCallback(() => {
    dispatch({ type: 'START_GAME' });
  }, [dispatch]);

  // All players have received roles
  if (allDealt) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 gap-8">
        <div className="text-6xl">✅</div>
        <div className="text-white text-2xl font-bold text-center">Все роли розданы!</div>
        <div className="text-slate-400 text-center">
          Каждый знает свою роль. Можно начинать игру.
        </div>
        <button
          onClick={handleStartGame}
          className="w-full max-w-xs py-4 rounded-2xl text-white text-lg font-bold bg-indigo-600 active:bg-indigo-500"
        >
          Начать игру
        </button>
        <button
          onClick={() => dispatch({ type: 'RESET_GAME' })}
          className="text-slate-500 text-sm"
        >
          Вернуться к настройке
        </button>
      </div>
    );
  }

  // Lock screen between players
  if (!isRevealing) {
    return (
      <LockScreen
        playerNumber={currentDealingIndex + 1}
        totalPlayers={playerCount}
        onReveal={handleReveal}
      />
    );
  }

  // Reveal screen — hold to see role
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-between p-6 no-select">
      <div className="w-full flex justify-between items-center pt-4">
        <div className="text-slate-500 text-sm">Игрок {currentDealingIndex + 1}</div>
        <div className="text-slate-500 text-sm">{currentDealingIndex + 1} / {playerCount}</div>
      </div>

      <div className="w-full max-w-xs">
        <RoleCard roleId={currentPlayer.roleId} revealed={isRevealing} />
      </div>

      <div className="w-full max-w-xs flex flex-col gap-3 pb-4">
        <div className="text-slate-400 text-xs text-center mb-1">
          Запомните роль и передайте телефон
        </div>
        <button
          onClick={handleHide}
          className="w-full py-4 rounded-2xl text-white text-base font-bold bg-slate-700 active:bg-slate-600"
        >
          Скрыть и передать →
        </button>
      </div>
    </div>
  );
}
