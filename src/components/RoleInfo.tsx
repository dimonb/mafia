import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';

interface RoleInfoProps {
  description: string;
  children: ReactNode;
}

export default function RoleInfo({ description, children }: RoleInfoProps) {
  const [open, setOpen] = useState(false);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const ref = useRef<HTMLDivElement>(null);

  function showDesktop() {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setStyle({
      top: r.top + r.height / 2,
      left: r.right + 8,
      transform: 'translateY(-50%)',
    });
    setOpen(true);
  }

  function showMobile() {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const tooltipWidth = 224; // w-56
    const left = Math.max(8, Math.min(r.left, window.innerWidth - tooltipWidth - 8));
    setStyle({
      top: r.bottom + 6,
      left,
    });
    setOpen(true);
  }

  function hide() { setOpen(false); }

  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) hide();
    }
    document.addEventListener('click', handle);
    return () => document.removeEventListener('click', handle);
  }, [open]);

  return (
    <>
      <div
        ref={ref}
        onPointerEnter={(e) => { if (e.pointerType === 'mouse') showDesktop(); }}
        onPointerLeave={(e) => { if (e.pointerType === 'mouse') hide(); }}
        onClick={(e) => {
          if (e.nativeEvent.pointerType === 'touch') {
            open ? hide() : showMobile();
          }
        }}
        className="flex items-center gap-3 flex-1 min-w-0 cursor-default select-none"
      >
        {children}
      </div>

      {open && createPortal(
        <div
          className="fixed z-50 w-56 bg-slate-700 border border-slate-600 text-white text-xs leading-relaxed rounded-xl px-3 py-2.5 shadow-xl pointer-events-none"
          style={style}
        >
          {description}
        </div>,
        document.body
      )}
    </>
  );
}
