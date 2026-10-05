import { useGame } from './hooks/useGame';
import SetupScreen from './screens/SetupScreen';
import DealingScreen from './screens/DealingScreen';
import GameScreen from './screens/GameScreen';

export default function App() {
  const { state } = useGame();

  return (
    <div className="app-root">
      {state.phase === 'setup' && <SetupScreen />}
      {state.phase === 'dealing' && <DealingScreen />}
      {state.phase === 'game' && <GameScreen />}
    </div>
  );
}
