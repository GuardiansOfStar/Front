// src/App.tsx - 완전 수정 버전
import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CharacterProvider } from './context/CharacterContext';
import AspectRatioContainer from './components/layout/AspectRatioContainer';
import EnhancedLoadingScreen from './components/ui/EnhancedLoadingScreen';
import { useDragPrevention } from './hooks/useDragPrevention';

// 레이아웃 컴포넌트들
import StartPrologueLayout from './components/layout/StartPrologueLayout';
import QuestLayout from './components/layout/QuestLayout';
import ResultLayout from './components/layout/ResultLayout'

// 페이지 컴포넌트들
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
import MakgeolliQuest from './pages/quest/MakgeolliQuest';
import HarvestQuest from './pages/quest/HarvestQuest';
import ReturnQuest from './pages/quest/ReturnQuest';
import PerfectScore from './pages/ResultScreen/PerfectScore';
import Memory from './pages/ResultScreen/Memory';
import VillageRank from './pages/ResultScreen/VillageRank';
import DevelopmentNotice from './pages/DevelopmentNotice';

function App() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  useDragPrevention();

  const handleLoadComplete = () => {
    setIsInitialLoading(false);
    console.log('[App] 초기 로딩 완료');
  };

  if (isInitialLoading) {
    return <EnhancedLoadingScreen onLoadComplete={handleLoadComplete} />;
  }

  return (
    <CharacterProvider>
      <AspectRatioContainer>
        <Routes>
          {/* 시작 및 프롤로그 화면들 */}
          <Route element={<StartPrologueLayout />}>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/setting" element={<SettingPage />} />
            <Route path="/scenario-select" element={<ScenarioSelectPage />} />
            <Route path="/character-select" element={<CharacterSelectPage />} />
            <Route path="/prologue" element={<ProloguePage />} />
            <Route path="/driving-prep" element={<DrivingPrepPage />} />
          </Route>

          {/* 퀘스트 화면들 */}
          <Route element={<QuestLayout />}>
            <Route path="/quest" element={<MemoryCardQuest />} />
            <Route path="/pothole-quest" element={<PotholeQuest />} />
            <Route path="/makgeolli-quest" element={<MakgeolliQuest/>} />
            <Route path="/harvest-quest" element={<HarvestQuest />} />
            <Route path="/return-quest" element={<ReturnQuest/>}/>
            <Route path="/score" element={<ScorePage />} />
          </Route>
           
          {/* 주행 완료 관련 화면들 */}
          <Route path="/success" element={<SuccessBackground />} />
          <Route path="/completion" element={<CompletionBackground />} />
          <Route path='/perfect' element={<PerfectScore/>} />
           
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