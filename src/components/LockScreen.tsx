interface LockScreenProps {
  playerNumber: number;
  totalPlayers: number;
  onReveal: () => void;
}

export default function LockScreen({ playerNumber, totalPlayers, onReveal }: LockScreenProps) {
  return (
    <div
      className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center gap-8 no-select"
      onClick={onReveal}
    >
      <div className="text-slate-500 text-sm uppercase tracking-widest">
        Игрок {playerNumber} из {totalPlayers}
      </div>
      <div className="w-28 h-28 rounded-full bg-slate-800 flex items-center justify-center text-5xl font-bold text-white shadow-lg">
        {playerNumber}
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="text-white text-xl font-semibold">Возьмите телефон</div>
        <div className="text-slate-400 text-sm">и нажмите, чтобы увидеть роль</div>
      </div>
      <div className="absolute bottom-16 text-slate-600 text-xs">
        Не показывайте другим игрокам
      </div>
    </div>
  );
}
