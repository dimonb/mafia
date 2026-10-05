import { useState, useRef, useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import type { CSSProperties, ReactNode } from 'react';

interface RoleInfoProps {
  name: string;
  description: string;
  children: ReactNode;
}

export default function RoleInfo({ name, description, children }: RoleInfoProps) {
  const [open, setOpen] = useState(false);
  const [style, setStyle] = useState<CSSProperties>({});
  const ref = useRef<HTMLButtonElement>(null);
  const tooltipId = useId();

  function show() {
    const rect = ref.current!.getBoundingClientRect();
    const width = Math.min(256, window.innerWidth - 32);
    setStyle({
      width,
      top: Math.max(8, Math.min(rect.bottom + 8, window.innerHeight - 140)),
      left: Math.max(16, Math.min(rect.left, window.innerWidth - width - 16)),
    });
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    function outside(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    }
    function dismiss() { setOpen(false); }
    function onKey(event: KeyboardEvent) { if (event.key === 'Escape') dismiss(); }
    document.addEventListener('click', outside);
    document.addEventListener('scroll', dismiss, true);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', dismiss);
    return () => {
      document.removeEventListener('click', outside);
      document.removeEventListener('scroll', dismiss, true);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', dismiss);
    };
  }, [open]);

  return (
    <>
      <button ref={ref} type="button" className="role-info" aria-label={`О роли: ${name}`}
        aria-expanded={open} aria-describedby={open ? tooltipId : undefined}
        onClick={() => open ? setOpen(false) : show()}
        onPointerEnter={event => { if (event.pointerType === 'mouse') show(); }}
        onPointerLeave={event => { if (event.pointerType === 'mouse') setOpen(false); }}
        onBlur={() => setOpen(false)}>
        {children}
      </button>
      {open && createPortal(
        <div id={tooltipId} role="tooltip" className="role-tooltip" style={style}>{description}</div>,
        document.body,
      )}
    </>
  );
}
