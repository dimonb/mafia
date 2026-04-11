interface PlayerAvatarProps {
  id: number;
  isAlive: boolean;
  onClick: () => void;
}

export default function PlayerAvatar({ id, isAlive, onClick }: PlayerAvatarProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all no-select
        ${isAlive
          ? 'bg-slate-700 active:bg-slate-600'
          : 'bg-slate-900 opacity-50'
        }
      `}
    >
      <div className={`
        w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold relative
        ${isAlive ? 'bg-slate-600 text-white' : 'bg-slate-800 text-slate-600'}
      `}>
        {isAlive ? id : '💀'}
      </div>
      <div className={`text-xs font-medium ${isAlive ? 'text-slate-300' : 'text-slate-600'}`}>
        Игрок {id}
      </div>
    </button>
  );
}
