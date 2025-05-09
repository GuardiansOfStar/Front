// src/pages/HomePage.tsx
import Background from '../../components/ui/Background';
import CharacterAnimation from './CharacterAnimation';
import Setting from '../../components/ui/SettingButton';
import StartButton from '../../components/ui/StartButton';

const title = '/assets/images/title.png';
const team_name = '/assets/images/team_name.png'

const HomePage = () => {
  return (
    <div className="relative h-full aspect-[8/5] max-w-[1300px] mx-auto overflow-hidden">
      {/* 화면 높이에 맞춰서 비율을 유지 */}

      <Background />
      <Setting/>

      <img 
        src={title}
        alt="제목"
        className="absolute top-[10%] left-1/2 transform -translate-x-1/2 w-[50%] drop-shadow-xl z-10"
      />

      <CharacterAnimation />
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