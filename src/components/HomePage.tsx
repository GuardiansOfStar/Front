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
      <h1 className="absolute top-[150px] left-1/2 transform -translate-x-1/2
      text-7xl font-bold text-green-600 
      drop-shadow-lg z-10">
        이륜차 안전교육
      </h1>
      <CharacterAnimation />
      <StartButton />
      <h2 className="absolute bottom-[50px] right-[50px]
      text-3xl font-bold text-gray-400 
      z-10">
        별 따러 가자       한양대 불가사리팀 
      </h2>
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



