interface LockScreenProps {
  playerNumber: number;
  totalPlayers: number;
  onReveal: () => void;
}

export default function LockScreen({ playerNumber, totalPlayers, onReveal }: LockScreenProps) {
  return (
    <button type="button" className="lock-screen no-select" onClick={onReveal}
      aria-label={`Игрок ${playerNumber} из ${totalPlayers}. Показать мою роль`}>
      <span className="lock-brand" aria-hidden="true">Мафия</span>
      <span className="dealing-progress">РАЗДАЧА · {playerNumber} ИЗ {totalPlayers}</span>
      <span className="lock-player">Игрок {playerNumber}</span>
      <span className="secondary">Возьми телефон. Смотри только ты.</span>
      <span className="secret-card">
        <span className="secret-mark" aria-hidden="true">?</span>
        <span className="secret-title">Твоя тайная роль</span>
        <span className="secondary">Коснись любого места экрана</span>
      </span>
      <span className="lock-note">Не показывай другим игрокам</span>
    </button>
  );
}
