// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AspectRatioContainer from './components/layout/AspectRatioContainer';
import HomePage from './pages/home/HomePage';
import ScenarioSelectPage from './pages/scenarioSelect/ScenarioSelectPage';
import MapPage from './pages/map/MapPage';

function App() {
  return (
    <Router>
      <AspectRatioContainer ratio="5/4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/scenarios" element={<ScenarioSelectPage />} />
          <Route path="/map" element={<MapPage />} />
        </Routes>
      </AspectRatioContainer>
    </Router>
  );
}

export default App;