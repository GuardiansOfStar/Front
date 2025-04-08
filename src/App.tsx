import './App.css'
import GameComponent from './components/game/GameComponent';

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">
        고령 이륜차 운전자를 위한 안전 교육 시뮬레이션
      </h1>
      <div className="w-full max-w-4xl aspect-video bg-white rounded-lg shadow-lg overflow-hidden">
        <GameComponent />
      </div>
    </div>
  );
}

export default App;