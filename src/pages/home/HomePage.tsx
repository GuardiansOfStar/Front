// src/pages/HomePage.tsx
import Background from '../../components/Background';
import CharacterAnimation from './CharacterAnimation';
import Setting from './Setting';
import StartButton from './StartButton';

import title from 'assets/images/title.png';
import team_name from 'assets/images/team_name.png';


const HomePage = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Background />
      <Setting/>
      <img 
        src={title}
        alt="제목"
        className="absolute top-3/7 left-1/2 transform -translate-x-1/2
        drop-shadow-lg z-10"
      />
      <CharacterAnimation />
      <StartButton />
      <img 
        src={team_name}
        alt="팀이름"
        className="absolute bottom-[50px] right-[50px] z-10"
      />
    </div>
  );
};


/*const HomePage = () => {
  return (
    <div className="text-3xl text-white">홈 화면입니다!</div>
  );
};
*/
export default HomePage;



