import { useGame } from '../hooks/useGame';
import { ALL_ROLE_IDS, ROLE_DEFINITIONS, FACTION_LABELS } from '../constants/roles';
import RoleCounter from '../components/RoleCounter';
import RoleInfo from '../components/RoleInfo';

export default function SetupScreen() {
  const { state, dispatch } = useGame();

  const total = state.roleCounts.reduce((s, rc) => s + rc.count, 0);
  const isReady = total === state.playerCount;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="px-5 pt-10 pb-6 text-center">
        <div className="text-4xl font-bold text-white">🎭 Мафия</div>
        <div className="text-slate-400 text-sm mt-1">Настройка игры</div>
      </header>

      {/* Main content: single column on mobile, two columns on desktop */}
      <div className="flex-1 w-full max-w-4xl mx-auto px-4 md:px-8 md:flex md:gap-6 pb-6">

        {/* Left column: player count + start */}
        <div className="md:w-72 md:shrink-0 md:flex md:flex-col md:gap-4">
          {/* Player count */}
          <div className="bg-slate-800 rounded-2xl p-5 mb-4 md:mb-0">
            <div className="text-slate-300 text-sm mb-4 font-medium">Количество игроков</div>
            <div className="flex items-center justify-between">
              <button
                className="w-12 h-12 rounded-full bg-slate-700 text-white text-2xl font-bold flex items-center justify-center active:bg-slate-600 hover:bg-slate-600 disabled:opacity-30 transition-colors"
                onClick={() => dispatch({ type: 'SET_PLAYER_COUNT', count: state.playerCount - 1 })}
                disabled={state.playerCount <= 4}
              >
                −
              </button>
              <div className="text-6xl font-bold text-white tabular-nums">{state.playerCount}</div>
              <button
                className="w-12 h-12 rounded-full bg-slate-700 text-white text-2xl font-bold flex items-center justify-center active:bg-slate-600 hover:bg-slate-600 disabled:opacity-30 transition-colors"
                onClick={() => dispatch({ type: 'SET_PLAYER_COUNT', count: state.playerCount + 1 })}
                disabled={state.playerCount >= 20}
              >
                +
              </button>
            </div>
            <div className="text-slate-400 text-xs leading-relaxed mt-4">
              При изменении числа игроков роли подбираются автоматически. Их можно изменить вручную.
            </div>
          </div>

          {/* Start button — visible in left column on desktop, sticky footer on mobile */}
          <div className="hidden md:block mt-auto">
            <div className={`text-center text-sm mb-3 font-medium ${isReady ? 'text-green-400' : 'text-red-400'}`}>
              {isReady
                ? `Все ${state.playerCount} игроков распределены`
                : `Настроено: ${total} / ${state.playerCount} (${total < state.playerCount ? `+${state.playerCount - total}` : `−${total - state.playerCount}`})`}
            </div>
            <button
              onClick={() => dispatch({ type: 'START_DEALING' })}
              disabled={!isReady}
              className="w-full py-4 rounded-2xl text-white text-lg font-bold bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Начать раздачу
            </button>
          </div>
        </div>

        {/* Right column: role list */}
        <div className="flex-1 bg-slate-800 rounded-2xl overflow-hidden mb-4 md:mb-0">
          <div className="px-4 py-3 border-b border-slate-700">
            <div className="text-slate-300 text-sm font-medium">Роли</div>
          </div>
          <div className="md:grid md:grid-cols-2">
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
                  className="flex items-center px-4 py-3 border-b border-slate-700/50 last:border-0 md:last:border-b md:[&:nth-last-child(2)]:border-b-0"
                >
                  <RoleInfo description={role.description}>
                    <div className={`w-9 h-9 rounded-full ${role.bgClass} flex items-center justify-center text-lg shrink-0`}>
                      {role.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-white text-sm font-medium">{role.name}</div>
                      <div className={`text-xs ${factionColor}`}>{FACTION_LABELS[role.faction]}</div>
                    </div>
                  </RoleInfo>
                  <RoleCounter
                    value={rc.count}
                    max={state.playerCount}
                    onChange={(val) => dispatch({ type: 'SET_ROLE_COUNT', roleId, count: val })}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile sticky footer */}
      <div className="md:hidden sticky bottom-0 px-4 pb-8 pt-3 bg-slate-900">
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
