interface RoleCounterProps {
  value: number;
  onChange: (value: number) => void;
  max: number;
}

export default function RoleCounter({ value, onChange, max }: RoleCounterProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        className="w-9 h-9 rounded-full bg-slate-700 text-white text-xl font-bold flex items-center justify-center active:bg-slate-600 disabled:opacity-30"
        onClick={() => onChange(value - 1)}
        disabled={value <= 0}
      >
        −
      </button>
      <span className="w-7 text-center text-lg font-bold text-white">{value}</span>
      <button
        className="w-9 h-9 rounded-full bg-slate-700 text-white text-xl font-bold flex items-center justify-center active:bg-slate-600 disabled:opacity-30"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
      >
        +
      </button>
    </div>
  );
}
