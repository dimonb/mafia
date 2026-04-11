import { useState, useRef, useEffect } from 'react';

interface RoleInfoProps {
  description: string;
}

export default function RoleInfo({ description }: RoleInfoProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside tap (mobile)
  useEffect(() => {
    if (!open) return;
    function handlePointer(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('pointerdown', handlePointer);
    return () => document.removeEventListener('pointerdown', handlePointer);
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative flex items-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onPointerDown={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        className="w-5 h-5 rounded-full bg-slate-600 hover:bg-slate-500 text-slate-300 text-xs font-bold flex items-center justify-center shrink-0 transition-colors"
        aria-label="Описание роли"
      >
        ?
      </button>

      {open && (
        <div className="absolute right-7 top-1/2 -translate-y-1/2 w-52 bg-slate-700 border border-slate-600 text-white text-xs leading-relaxed rounded-xl px-3 py-2.5 shadow-xl z-20 pointer-events-none">
          {description}
          {/* Arrow pointing right */}
          <span className="absolute right-[-5px] top-1/2 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-l-[5px] border-l-slate-600" />
          <span className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-l-[5px] border-l-slate-700" />
        </div>
      )}
    </div>
  );
}
