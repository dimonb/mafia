import { useGame } from '../hooks/useGame';
import { ALL_ROLE_IDS, ROLE_DEFINITIONS } from '../constants/roles';
import type { Faction } from '../types/game';
import RoleCounter from '../components/RoleCounter';
import RoleInfo from '../components/RoleInfo';
import RoleIcon from '../components/RoleIcon';
import Brand from '../components/Brand';

const groups: { faction: Faction; label: string }[] = [
  { faction: 'town', label: 'Мирные' },
  { faction: 'mafia', label: 'Мафия' },
  { faction: 'solo', label: 'Одиночки' },
];

export default function SetupScreen() {
  const { state, dispatch } = useGame();
  const total = state.roleCounts.reduce((sum, role) => sum + role.count, 0);
  const remaining = state.playerCount - total;
  const isReady = remaining === 0;

  return (
    <div className="app-screen setup-screen">
      <div className="mobile-shell">
        <Brand />
        <main className="setup-content">
          <h1>Собираем стол</h1>
          <p className="secondary">Сколько вас сегодня?</p>
          <div className="player-count-row">
            <div>
              <h2>Игроки</h2>
              <p className="secondary">От 4 до 20 участников</p>
            </div>
            <div className="player-stepper">
              <button type="button" aria-label="Уменьшить число игроков"
                onClick={() => dispatch({ type: 'SET_PLAYER_COUNT', count: state.playerCount - 1 })}
                disabled={state.playerCount <= 4}>−</button>
              <output aria-label="Количество игроков" aria-live="polite">{state.playerCount}</output>
              <button type="button" aria-label="Увеличить число игроков"
                onClick={() => dispatch({ type: 'SET_PLAYER_COUNT', count: state.playerCount + 1 })}
                disabled={state.playerCount >= 20}>+</button>
            </div>
          </div>
          <p className="setup-hint">Роли подбираются автоматически. Меняй состав ниже; нажми на название, чтобы узнать о роли.</p>
          {groups.map(({ faction, label }) => (
            <section key={faction} className="role-group" aria-label={label}>
              <h2 className="group-label">{label}</h2>
              {ALL_ROLE_IDS.filter(id => ROLE_DEFINITIONS[id].faction === faction).map(roleId => {
                const role = ROLE_DEFINITIONS[roleId];
                const count = state.roleCounts.find(r => r.roleId === roleId)!.count;
                return (
                  <div key={roleId} className={`role-row ${count === 0 ? 'role-zero' : ''}`}>
                    <RoleInfo name={role.name} description={role.description}>
                      <span className="role-icon"><RoleIcon roleId={roleId} /></span>
                      <span className="role-name">{role.name}</span>
                    </RoleInfo>
                    <RoleCounter label={role.name} value={count} max={state.playerCount}
                      onChange={value => dispatch({ type: 'SET_ROLE_COUNT', roleId, count: value })} />
                  </div>
                );
              })}
            </section>
          ))}
        </main>
      </div>
      <footer className="setup-footer">
        <div className="footer-content">
          <div className={`setup-status ${isReady ? '' : 'invalid'}`} role="status">
            <span>{isReady ? '✓ Можно начинать' : remaining > 0 ? `Не хватает ролей: ${remaining}` : `Лишних ролей: ${-remaining}`}</span>
            <span>{total} / {state.playerCount}</span>
          </div>
          <button type="button" className="primary-action" disabled={!isReady}
            onClick={() => dispatch({ type: 'START_DEALING' })}>Раздать роли <span aria-hidden="true">→</span></button>
        </div>
      </footer>
    </div>
  );
}
