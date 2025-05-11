// src/pages/home/HomePage.tsx
import { useState, useEffect } from 'react';
import Background from '../../components/ui/Background';
import CharacterAnimation from './CharacterAnimation';
import Setting from '../../components/ui/SettingButton';
import StartButton from '../../components/ui/StartButton';
import RegionBubble from '../../components/ui/RegionBubble';

const title = '/assets/images/title.png';
const team_name = '/assets/images/team_name.png'

const HomePage = () => {
  // 지역 설정 여부 상태 (localStorage에서 확인)
  const [hasRegion, setHasRegion] = useState(() => {
    return localStorage.getItem('selectedRegion') !== null;
  });
  
  // 말풍선 표시 상태
  const [showBubble, setShowBubble] = useState(false);
  // 애니메이션 완료 상태
  const [animationCompleted, setAnimationCompleted] = useState(false);
  
  // 캐릭터 애니메이션 완료 후 호출될 콜백
  const handleAnimationComplete = () => {
    setAnimationCompleted(true);
  };

  // 애니메이션 완료 후 0.5초 뒤에 말풍선 표시
  useEffect(() => {
    if (animationCompleted && !hasRegion) {
      const timer = setTimeout(() => {
        setShowBubble(true);
      }, 500); // 0.5초 딜레이
      
      return () => clearTimeout(timer);
    }
  }, [animationCompleted, hasRegion]);

  return (
    <div className="relative h-full aspect-[4/3] max-w-[100vw] max-h-[100vh] mx-auto overflow-hidden">
      {/* 화면 높이에 맞춰서 비율을 유지 */}
      <Background />
      <Setting />

      {/* 말풍선 컴포넌트 */}
      <RegionBubble show={showBubble} />

      <img 
        src={title}
        alt="제목"
        className="absolute top-[10%] left-1/2 transform -translate-x-1/2 w-[65%] drop-shadow-xl z-10"
      />

      <CharacterAnimation onAnimationComplete={handleAnimationComplete} />
      <StartButton />

      <img 
        src={team_name}
        alt="팀이름"
        className="absolute bottom-[7%] right-[10%] w-[30%] z-10"
      />
    </div>
  );
};

export default HomePage;