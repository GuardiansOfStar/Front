// Front/src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { ScoreProvider } from './context/ScoreContext';
import { CharacterProvider } from './context/CharacterContext';
import AspectRatioContainer from './components/layout/AspectRatioContainer';
import { useDragPrevention } from './hooks/useDragPrevention';

import HomePage from './pages/home/HomePage';
import SettingPage from './pages/home/SettingPage';
import ScenarioSelectPage from './pages/scenarioSelect/ScenarioSelectPage';
import CharacterSelectPage from './pages/characterSelect/CharacterSelectPage';
import EduScreen from './pages/ResultScreen/EduScreen';
import Certificate from './pages/ResultScreen/Certificate';
import PersonalInfo from './pages/ResultScreen/PersonalInfo';
import StarSurvey from './pages/ResultScreen/StarSurvey';

import ProloguePage from './pages/prologue/ProloguePage';
import DrivingPrepPage from './pages/driving/DrivingPrepPage';
import MemoryCardQuest from './pages/quest/MemoryCardQuest';
import ScorePage from './pages/score/ScorePage';
import PotholeQuest from './pages/quest/PotholeQuest';

import CompletionBackground from './pages/questFinish/CompletionBackground';
import SuccessBackground from './pages/questFinish/SuccessBackground';
import HarvestQuest from './pages/quest/HarvestQuest';
import MakgeolliQuest from './pages/quest/MakgeolliQuest';
import ReturnQuest from './pages/quest/ReturnQuest';
import DevelopmentNotice from './pages/DevelopmentNotice';
import Memory from './pages/ResultScreen/Memory';
import PerfectScore from './pages/ResultScreen/PerfectScore';
import VillageRank from './pages/ResultScreen/VillageRank';

function App() {

  useDragPrevention();

 return (
   //<ScoreProvider>
     <CharacterProvider>
       <AspectRatioContainer fillMode="fit">
         <Routes>
           {/* 기본 화면들 */}
           <Route path="/" element={<HomePage />} />
           <Route path="/settings" element={<SettingPage />} />
           <Route path="/scenarios" element={<ScenarioSelectPage />} />
           <Route path="/character-select" element={<CharacterSelectPage />} />
           <Route path="/prologue" element={<ProloguePage />} />

           {/* 주행 관련 화면들 */}
           <Route path="/driving-prep" element={<DrivingPrepPage />} />
           <Route path="/quest" element={<MemoryCardQuest />} />
           <Route path="/pothole-quest" element={<PotholeQuest />} />
           <Route path="/makgeolli-quest" element={<MakgeolliQuest/>} />
           <Route path="/harvest-quest" element={<HarvestQuest />} />
           <Route path="/return-quest" element={<ReturnQuest/>}/>
           <Route path="/score" element={<ScorePage />} />
           
           {/* 주행 완료 관련 화면들 */}
           <Route path="/success" element={<SuccessBackground />} />
           <Route path="/completion" element={<CompletionBackground />} />
           <Route path='/perfect' element={<PerfectScore/>} />
           
           {/* 결과 및 수료 관련 화면들 */}
           <Route path="/result" element={<EduScreen />} />
           <Route path="/certificate" element={<Certificate />} />
           <Route path="/info" element={<PersonalInfo/>} />
           <Route path="/survey" element={<StarSurvey />} />
           <Route path="/memory" element={<Memory />} />
           <Route path='/rank' element={<VillageRank/>} />


           {/* 추가: 개발 중 알림 페이지 */}
           <Route path="/development-notice" element={<DevelopmentNotice />} />
         </Routes>
       </AspectRatioContainer>
     </CharacterProvider>
   //</ScoreProvider>
 );
}

export default App;