// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AspectRatioContainer from './components/layout/AspectRatioContainer';
import HomePage from './pages/home/HomePage';
import ScenarioSelectPage from './pages/scenarioSelect/ScenarioSelectPage';
import MapPage from './pages/map/MapPage';
import EduScreen from './pages/ResultScreen/EduScreen';
import Certificate from './pages/ResultScreen/Certificate';
import PersonalInfo from './pages/ResultScreen/PersonalInfo';
import StarSurvey from './pages/ResultScreen/StarSurvey';

import ProloguePage from './pages/prologue/ProloguePage';
import DrivingPrepPage from './pages/driving/DrivingPrepPage';
import QuestPage from './pages/quest/QuestPage';
import MemoryCardQuest from './pages/quest/MemoryCardQuest';
import ScorePage from './pages/score/ScorePage';

import CompletionBackground from './pages/questFinish/CompletionBackground';
import SuccessBackground from './pages/questFinish/SuccessBackground';


function App() {
  return (
    <Router>
      <AspectRatioContainer ratio="16/10">
      <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/result" element={<SuccessBackground />} />
        <Route path="/scenarios" element={<ScenarioSelectPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/prologue" element={<ProloguePage />} />
          <Route path="/driving-prep" element={<DrivingPrepPage />} />
          <Route path="/quest" element={<MemoryCardQuest />} />
          <Route path="/score" element={<ScorePage />} />  {/* 추가된 부분 */}
          <Route path="/certificate" element={<Certificate />} />
        <Route path='/info' element={<PersonalInfo />} />
        <Route path='/star' element={<StarSurvey />} />
      </Routes>
      </AspectRatioContainer>
    </Router>
  );
}

export default App;