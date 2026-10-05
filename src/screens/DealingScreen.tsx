import { useEffect, useCallback } from 'react';
import { useGame } from '../hooks/useGame';
import RoleCard from '../components/RoleCard';
import LockScreen from '../components/LockScreen';
import Brand from '../components/Brand';

export default function DealingScreen() {
  const { state, dispatch } = useGame();
  const { players, currentDealingIndex, isRevealing, playerCount } = state;
  const allDealt = currentDealingIndex >= playerCount;
  const currentPlayer = players[currentDealingIndex];

  useEffect(() => {
    let wakeLock: WakeLockSentinel | null = null;
    let disposed = false;
    if ('wakeLock' in navigator) {
      navigator.wakeLock.request('screen').then(lock => {
        if (disposed) void lock.release();
        else wakeLock = lock;
      }).catch(() => {});
    }
    return () => { disposed = true; void wakeLock?.release(); };
  }, []);

  const handleReveal = useCallback(() => dispatch({ type: 'REVEAL_ROLE' }), [dispatch]);
  const handleHide = useCallback(() => dispatch({ type: 'HIDE_AND_ADVANCE' }), [dispatch]);

  if (allDealt) {
    return (
      <div className="app-screen">
        <div className="mobile-shell completion-screen">
          <Brand dealing />
          <main className="completion-content">
            <span className="completion-mark" aria-hidden="true">✓</span>
            <h1>Все роли розданы</h1>
            <p className="secondary">Каждый знает свою роль. Передай телефон ведущему — можно начинать игру.</p>
            <button type="button" className="primary-action" onClick={() => dispatch({ type: 'START_GAME' })}>Начать игру <span aria-hidden="true">→</span></button>
            <button type="button" className="text-action" onClick={() => dispatch({ type: 'RESET_GAME' })}>Вернуться к настройке</button>
          </main>
        </div>
      </div>
    );
  }

  if (!isRevealing) {
    return <LockScreen playerNumber={currentDealingIndex + 1} totalPlayers={playerCount} onReveal={handleReveal} />;
  }

  return (
    <div className="app-screen no-select">
      <div className="mobile-shell reveal-screen">
        <Brand dealing />
        <main className="reveal-content">
          <p className="dealing-progress">РАЗДАЧА · {currentDealingIndex + 1} ИЗ {playerCount}</p>
          <h1>Игрок {currentDealingIndex + 1}</h1>
          <p className="secondary">Запомни роль и скрой её</p>
          <RoleCard roleId={currentPlayer.roleId} revealed={isRevealing} />
        </main>
        <footer className="reveal-footer">
          <button type="button" className="primary-action" onClick={handleHide}>Скрыть и передать <span aria-hidden="true">→</span></button>
          <p className="secondary">Сначала скрой роль, потом передай телефон</p>
        </footer>
      </div>
    </div>
  );
}
