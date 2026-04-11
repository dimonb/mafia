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
    return () => { wakeLock?.release(); };
  }, []);

  const handleReveal = useCallback(() => dispatch({ type: 'REVEAL_ROLE' }), [dispatch]);
  const handleHide = useCallback(() => dispatch({ type: 'HIDE_AND_ADVANCE' }), [dispatch]);
  const handleStartGame = useCallback(() => dispatch({ type: 'START_GAME' }), [dispatch]);

  if (allDealt) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 gap-6">
        <div className="text-7xl">✅</div>
        <div className="text-white text-2xl md:text-3xl font-bold text-center">Все роли розданы!</div>
        <div className="text-slate-400 text-center max-w-sm">
          Каждый знает свою роль. Можно начинать игру.
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xs mt-2">
          <button
            onClick={handleStartGame}
            className="w-full py-4 rounded-2xl text-white text-lg font-bold bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-500 transition-colors"
          >
            Начать игру
          </button>
          <button
            onClick={() => dispatch({ type: 'RESET_GAME' })}
            className="text-slate-500 hover:text-slate-400 text-sm text-center transition-colors py-2"
          >
            Вернуться к настройке
          </button>
        </div>
      </div>
    );
  }

  if (!isRevealing) {
    return (
      <LockScreen
        playerNumber={currentDealingIndex + 1}
        totalPlayers={playerCount}
        onReveal={handleReveal}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-between p-6 no-select">
      <div className="w-full max-w-sm flex justify-between items-center pt-4">
        <div className="text-slate-500 text-sm">Игрок {currentDealingIndex + 1}</div>
        <div className="flex gap-1.5">
          {Array.from({ length: playerCount }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${i < currentDealingIndex ? 'bg-indigo-500' : i === currentDealingIndex ? 'bg-white' : 'bg-slate-700'}`}
            />
          ))}
        </div>
        <div className="text-slate-500 text-sm">{currentDealingIndex + 1} / {playerCount}</div>
      </div>

      <div className="w-full max-w-sm md:max-w-md">
        <RoleCard roleId={currentPlayer.roleId} revealed={isRevealing} />
      </div>

      <div className="w-full max-w-sm flex flex-col gap-3 pb-4">
        <div className="text-slate-400 text-xs text-center">
          Запомните роль и передайте телефон
        </div>
        <button
          onClick={handleHide}
          className="w-full py-4 rounded-2xl text-white text-base font-bold bg-slate-700 hover:bg-slate-600 active:bg-slate-600 transition-colors"
        >
          Скрыть и передать →
        </button>
      </div>
    </div>
  );
}
