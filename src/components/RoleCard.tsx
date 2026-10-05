import { ROLE_DEFINITIONS, FACTION_LABELS } from '../constants/roles';
import type { RoleId } from '../types/game';

interface RoleCardProps {
  roleId: RoleId;
  revealed: boolean;
}

export default function RoleCard({ roleId, revealed }: RoleCardProps) {
  const role = ROLE_DEFINITIONS[roleId];

  return (
    <div className="card-container w-full" style={{ height: 'clamp(320px, 45vw, 400px)' }}>
      <div className={`card-inner ${revealed ? 'flipped' : ''}`}>
        {/* Back */}
        <div className="card-face card-back flex flex-col items-center justify-center gap-3">
          <div className="text-6xl opacity-60 grayscale" aria-hidden="true">🎭</div>
          <div className="text-slate-400 text-sm font-medium tracking-widest uppercase">Мафия</div>
        </div>

        {/* Front */}
        <div className="card-face card-front bg-slate-800 flex flex-col items-center justify-center p-6 gap-4">
          {/* The same neutral icon and palette avoid revealing roles in reflections. */}
          <div className="text-7xl grayscale" aria-hidden="true">🎭</div>
          <div className="text-white text-2xl font-bold text-center">{role.name}</div>
          <div className="text-white/80 text-sm text-center leading-relaxed">{role.description}</div>
          <div className="mt-2 px-4 py-1.5 rounded-full bg-black/30 text-white/90 text-xs font-semibold uppercase tracking-wide">
            {FACTION_LABELS[role.faction]}
          </div>
        </div>
      </div>
    </div>
  );
}
