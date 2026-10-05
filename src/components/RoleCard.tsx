import { ROLE_DEFINITIONS, FACTION_LABELS } from '../constants/roles';
import type { RoleId } from '../types/game';

interface RoleCardProps {
  roleId: RoleId;
  revealed: boolean;
}

export default function RoleCard({ roleId, revealed }: RoleCardProps) {
  const role = ROLE_DEFINITIONS[roleId];
  return (
    <div className="secret-card revealed-card" aria-live="polite">
      {/* Every role uses the same mark and palette, including in reflections. */}
      <span className="secret-mark" aria-hidden="true">{revealed ? 'М' : '?'}</span>
      <h2 className="secret-title">{revealed ? role.name : 'Твоя тайная роль'}</h2>
      {revealed && <>
        <p className="role-description">{role.description}</p>
        <span className="faction-label">{FACTION_LABELS[role.faction]}</span>
      </>}
    </div>
  );
}
