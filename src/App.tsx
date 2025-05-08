// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import ScenarioSelectPage from './pages/scenarioSelect/ScenarioSelectPage';
import MapPage from './pages/map/MapPage';
import EduScreen from './pages/ResultScreen/EduScreen';
import Certificate from './pages/ResultScreen/Certificate';
import PersonalInfo from './pages/ResultScreen/PersonalInfo';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/result" element={<EduScreen />} />
        <Route path="/scenarios" element={<ScenarioSelectPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/certificate" element={<Certificate />} />
        <Route path='/info' element={<PersonalInfo />} />
      </Routes>
    </Router>
  );
}

export default App;