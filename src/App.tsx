// Front/src/App.tsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CharacterProvider } from './context/CharacterContext';
import AspectRatioContainer from './components/layout/AspectRatioContainer';
import LoadingScreen from './components/ui/LoadingScreen';
import { CRITICAL_IMAGES } from './utils/imagePreloader';
import { useDragPrevention } from './hooks/useDragPrevention';

// 배경음 전용
import StartPrologueLayout from './components/layout/StartPrologueLayout';
import QuestLayout from './components/layout/QuestLayout';
import ResultLayout from './components/layout/ResultLayout'

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
  const [isLoaded, setIsLoaded] = useState(false);
  useDragPrevention();

  if (!isLoaded) {
    return (
      <CharacterProvider>
        <AspectRatioContainer fillMode="fit">
          <LoadingScreen
            images={CRITICAL_IMAGES}
            onLoadComplete={() => setIsLoaded(true)}
            minLoadTime={2000}
          />
        </AspectRatioContainer>
      </CharacterProvider>
    );
  }

 return (
     <CharacterProvider>
       <AspectRatioContainer fillMode="fit">
         <Routes>
           
           {/* 기본 화면들 + 첫 BGM 구역*/}
           <Route element={<StartPrologueLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/settings" element={<SettingPage />} />
            <Route path="/scenarios" element={<ScenarioSelectPage />} />
            <Route path="/character-select" element={<CharacterSelectPage />} />
           </Route>
           
           {/* 주행 관련 화면들 + 두 번째 BGM 구역*/}
           {/* <Route element={<QuestLayout />}> */}
            <Route path="/prologue" element={<ProloguePage />} />
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
           {/* </Route> */}
           
           {/* 결과 및 수료 관련 화면들 */}
           <Route element={<ResultLayout />}>
            <Route path="/result" element={<EduScreen />} />
            <Route path="/certificate" element={<Certificate />} />
            <Route path="/info" element={<PersonalInfo/>} />
            <Route path="/survey" element={<StarSurvey />} />
            <Route path="/memory" element={<Memory />} />
            <Route path='/rank' element={<VillageRank/>} />
           </Route>


           {/* 추가: 개발 중 알림 페이지 */}
           <Route path="/development-notice" element={<DevelopmentNotice />} />
         </Routes>
       </AspectRatioContainer>
     </CharacterProvider>
 );
}

export default App;