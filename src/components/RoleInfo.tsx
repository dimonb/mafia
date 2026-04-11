import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface RoleInfoProps {
  bgClass: string;
  icon: string;
  description: string;
}

export default function RoleInfo({ bgClass, icon, description }: RoleInfoProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLButtonElement>(null);

  function show() {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos({ top: r.top + r.height / 2, left: r.right + 8 });
    setOpen(true);
  }

  function hide() { setOpen(false); }

  // Close on outside tap (mobile)
  useEffect(() => {
    if (!open) return;
    function handle(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) hide();
    }
    document.addEventListener('pointerdown', handle);
    return () => document.removeEventListener('pointerdown', handle);
  }, [open]);

  return (
    <>
      <button
        ref={ref}
        onMouseEnter={show}
        onMouseLeave={hide}
        onPointerDown={(e) => { e.stopPropagation(); open ? hide() : show(); }}
        className={`w-9 h-9 rounded-full ${bgClass} flex items-center justify-center text-lg shrink-0 mr-3 cursor-pointer`}
        aria-label="Описание роли"
      >
        {icon}
      </button>

      {open && createPortal(
        <div
          className="fixed z-50 w-56 bg-slate-700 border border-slate-600 text-white text-xs leading-relaxed rounded-xl px-3 py-2.5 shadow-xl pointer-events-none"
          style={{ top: pos.top, left: pos.left, transform: 'translateY(-50%)' }}
        >
          {description}
          <span className="absolute left-[-5px] top-1/2 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-r-[5px] border-r-slate-600" />
          <span className="absolute left-[-3px] top-1/2 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-r-[5px] border-r-slate-700" />
        </div>,
        document.body
      )}
    </>
  );
}
