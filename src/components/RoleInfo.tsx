import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';

interface RoleInfoProps {
  description: string;
  children: ReactNode;
}

export default function RoleInfo({ description, children }: RoleInfoProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLDivElement>(null);

  function show() {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos({ top: r.top + r.height / 2, left: r.right + 8 });
    setOpen(true);
  }

  function hide() { setOpen(false); }

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
      <div
        ref={ref}
        onMouseEnter={show}
        onMouseLeave={hide}
        onPointerDown={(e) => { e.stopPropagation(); open ? hide() : show(); }}
        className="flex items-center gap-3 flex-1 min-w-0 cursor-default select-none"
      >
        {children}
      </div>

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
