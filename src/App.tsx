// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AspectRatioContainer from './components/layout/AspectRatioContainer';
import HomePage from './pages/home/HomePage';
import ScenarioSelectPage from './pages/scenarioSelect/ScenarioSelectPage';
import MapPage from './pages/map/MapPage';
<<<<<<< HEAD
import EduScreen from './pages/ResultScreen/EduScreen';
import Certificate from './pages/ResultScreen/Certificate';
import PersonalInfo from './pages/ResultScreen/PersonalInfo';
import StarSurvey from './pages/ResultScreen/StarSurvey';
=======
import ProloguePage from './pages/prologue/ProloguePage';
import DrivingPrepPage from './pages/driving/DrivingPrepPage';
import QuestPage from './pages/quest/QuestPage';
>>>>>>> main

function App() {
  return (
    <Router>
<<<<<<< HEAD
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/result" element={<EduScreen />} />
        <Route path="/scenarios" element={<ScenarioSelectPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/certificate" element={<Certificate />} />
        <Route path='/info' element={<PersonalInfo />} />
        <Route path='/star' element={<StarSurvey />} />
      </Routes>
=======
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
>>>>>>> main
    </Router>
  );
}

export default App;