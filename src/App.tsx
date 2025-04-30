// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AspectRatioContainer from './components/layout/AspectRatioContainer';
import HomePage from './pages/home/HomePage';
import ScenarioSelectPage from './pages/scenarioSelect/ScenarioSelectPage';
import MapPage from './pages/map/MapPage';
import ProloguePage from './pages/prologue/ProloguePage';
import DrivingPrepPage from './pages/driving/DrivingPrepPage';
import QuestPage from './pages/quest/QuestPage';

function App() {
  return (
    <Router>
      <AspectRatioContainer ratio="5/4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/scenarios" element={<ScenarioSelectPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/prologue" element={<ProloguePage />} />
          <Route path="/driving-prep" element={<DrivingPrepPage />} />
          <Route path="/quest" element={<QuestPage />} />
        </Routes>
      </AspectRatioContainer>
    </Router>
  );
}

export default App;