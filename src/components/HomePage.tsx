// src/pages/HomePage.tsx
import Background from './Background';
import CharacterAnimation from './CharacterAnimation';
import Setting from './Setting';
//import CharacterAnimation from './CharacterAnimation';
import StartButton from './StartButton';

const HomePage = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Background />
      <Setting/>
      <img 
        src="/title.png"
        alt="제목"
        className="absolute top-3/7 left-1/2 transform -translate-x-1/2
        drop-shadow-lg z-10"
      />
      <CharacterAnimation />
      <StartButton />
      <img 
        src="/team_name.png"
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



