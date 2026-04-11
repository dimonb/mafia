import { useGame } from '../hooks/useGame';
import { ALL_ROLE_IDS, ROLE_DEFINITIONS, FACTION_LABELS } from '../constants/roles';
import RoleCounter from '../components/RoleCounter';

export default function SetupScreen() {
  const { state, dispatch } = useGame();

  const total = state.roleCounts.reduce((s, rc) => s + rc.count, 0);
  const isReady = total === state.playerCount;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="px-5 pt-10 pb-4">
        <div className="text-3xl font-bold text-white text-center">🎭 Мафия</div>
        <div className="text-slate-400 text-center text-sm mt-1">Настройка игры</div>
      </div>

      {/* Player count */}
      <div className="mx-5 bg-slate-800 rounded-2xl p-4 mb-4">
        <div className="text-slate-300 text-sm mb-3 font-medium">Количество игроков</div>
        <div className="flex items-center justify-between">
          <button
            className="w-12 h-12 rounded-full bg-slate-700 text-white text-2xl font-bold flex items-center justify-center active:bg-slate-600 disabled:opacity-30"
            onClick={() => dispatch({ type: 'SET_PLAYER_COUNT', count: state.playerCount - 1 })}
            disabled={state.playerCount <= 4}
          >
            −
          </button>
          <div className="text-5xl font-bold text-white">{state.playerCount}</div>
          <button
            className="w-12 h-12 rounded-full bg-slate-700 text-white text-2xl font-bold flex items-center justify-center active:bg-slate-600 disabled:opacity-30"
            onClick={() => dispatch({ type: 'SET_PLAYER_COUNT', count: state.playerCount + 1 })}
            disabled={state.playerCount >= 20}
          >
            +
          </button>
        </div>
      </div>

      {/* Role list */}
      <div className="mx-5 bg-slate-800 rounded-2xl overflow-hidden mb-4 flex-1">
        <div className="px-4 py-3 border-b border-slate-700">
          <div className="text-slate-300 text-sm font-medium">Роли</div>
        </div>
        {ALL_ROLE_IDS.map((roleId) => {
          const role = ROLE_DEFINITIONS[roleId];
          const rc = state.roleCounts.find((r) => r.roleId === roleId)!;
          const factionColor =
            role.faction === 'mafia' ? 'text-red-400' :
            role.faction === 'solo' ? 'text-purple-400' :
            'text-sky-400';

          return (
            <div
              key={roleId}
              className="flex items-center px-4 py-3 border-b border-slate-700/50 last:border-0"
            >
              <div className={`w-8 h-8 rounded-full ${role.bgClass} flex items-center justify-center text-base mr-3 shrink-0`}>
                {role.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium">{role.name}</div>
                <div className={`text-xs ${factionColor}`}>{FACTION_LABELS[role.faction]}</div>
              </div>
              <RoleCounter
                value={rc.count}
                max={state.playerCount}
                onChange={(val) => dispatch({ type: 'SET_ROLE_COUNT', roleId, count: val })}
              />
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 px-5 pb-8 pt-3 bg-slate-900">
        <div className={`text-center text-sm mb-3 font-medium ${isReady ? 'text-green-400' : 'text-red-400'}`}>
          Настроено: {total} / {state.playerCount}
          {!isReady && ` (${total < state.playerCount ? `добавьте ещё ${state.playerCount - total}` : `уберите ${total - state.playerCount}`})`}
        </div>
        <button
          onClick={() => dispatch({ type: 'START_DEALING' })}
          disabled={!isReady}
          className="w-full py-4 rounded-2xl text-white text-lg font-bold bg-indigo-600 active:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          Начать раздачу
        </button>
      </div>
    </div>
  );
}
