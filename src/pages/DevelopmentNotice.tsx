// src/pages/DevelopmentNotice.tsx
import { useNavigate } from 'react-router-dom';
import Background from '../components/ui/Background';
import BackButton from '../components/ui/BackButton';

const DevelopmentNotice = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-full">
      <Background />
      <BackButton />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="bg-white bg-opacity-90 border-8 border-green-600 rounded-3xl p-12 max-w-2xl mx-auto text-center shadow-xl">
          <h1 className="text-4xl font-extrabold text-green-700 mb-6">개발 진행 중</h1>
          <p className="text-2xl text-green-800 mb-8">
            축하합니다! 모든 미션을 완료하셨습니다.<br/>
            결과 화면 및 수료증 기능은 현재 개발 중입니다.
          </p>
          
          <button
            onClick={() => navigate('/')}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-colors duration-300"
          >
            홈으로 돌아가기
          </button>
        </div>
        
        <img 
          src="/assets/images/star_character.png" 
          alt="별별이 캐릭터" 
          className="absolute bottom-10 right-10 w-32 h-auto"
        />
      </div>
    </div>
  );
};

export default DevelopmentNotice;