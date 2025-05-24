// src/pages/DevelopmentNotice.tsx
import { useNavigate } from 'react-router-dom';
import { useScale } from '../hooks/useScale';
import Background from '../components/ui/Background';
import BackButton from '../components/ui/BackButton';

const DevelopmentNotice = () => {
  const navigate = useNavigate();
  const scale = useScale();

  return (
    <div className="relative w-full h-full">
      <Background />
      <BackButton />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div 
          className="bg-white bg-opacity-90 text-center shadow-xl mx-auto"
          style={{
            borderWidth: `calc(8px * ${scale})`,
            borderColor: '#16a34a', // green-600
            borderStyle: 'solid',
            borderRadius: `calc(24px * ${scale})`,
            padding: `calc(48px * ${scale})`,
            maxWidth: `calc(512px * ${scale})`
          }}
        >
          <h1 
            className="font-extrabold text-green-700"
            style={{ 
              fontSize: `calc(4xl * ${scale})`,
              marginBottom: `calc(24px * ${scale})`
            }}
          >
            개발 진행 중
          </h1>
          <p 
            className="text-green-800"
            style={{ 
              fontSize: `calc(2xl * ${scale})`,
              marginBottom: `calc(32px * ${scale})`
            }}
          >
            축하합니다! 모든 미션을 완료하셨습니다.<br/>
            결과 화면 및 수료증 기능은 현재 개발 중입니다.
          </p>
          
          <button
            onClick={() => navigate('/')}
            className="bg-green-600 hover:bg-green-700 text-white font-bold transition-colors duration-300"
            style={{
              paddingTop: `calc(16px * ${scale})`,
              paddingBottom: `calc(16px * ${scale})`,
              paddingLeft: `calc(32px * ${scale})`,
              paddingRight: `calc(32px * ${scale})`,
              borderRadius: `calc(12px * ${scale})`,
              fontSize: `calc(1.25rem * ${scale})`
            }}
          >
            홈으로 돌아가기
          </button>
        </div>
        
        <img 
          src="/assets/images/star_character.png" 
          alt="별별이 캐릭터" 
          className="absolute"
          style={{
            bottom: `calc(40px * ${scale})`,
            right: `calc(40px * ${scale})`,
            width: `calc(128px * ${scale})`,
            height: 'auto'
          }}
        />
      </div>
    </div>
  );
};

export default DevelopmentNotice;