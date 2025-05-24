import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScale } from '../../hooks/useScale';
import Background from '../../components/ui/Background';

const EduScreen = () => {
  const navigate = useNavigate();
  const scale = useScale();
  
  useEffect(() => {
    console.log("EduScreen - 결과 화면 표시 중");
    // 5초 후 자동으로 수료증 화면으로 이동
    const timer = setTimeout(() => {
      console.log("EduScreen - 수료증 화면으로 이동");
      navigate('/certificate');
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center"
      onClick={() => navigate('/certificate')}
    >
      <Background />

      <img
        src="/assets/images/score_background.png"
        alt="점수 이미지"
        className="z-50"
        style={{
          width: `calc(60% * ${scale})`,
          marginBottom: `calc(20px * ${scale})`
        }}
      />

      <div 
        className="flex justify-between z-50"
        style={{
          width: `calc(75% * ${scale})`,
          gap: `calc(16px * ${scale})`
        }}
      >
        <div 
          className="bg-white text-green-600 font-bold flex items-center justify-center"
          style={{
            width: `calc(48% * ${scale})`,
            height: `calc(160px * ${scale})`,
            borderWidth: `calc(8px * ${scale})`,
            borderColor: '#16a34a', // green-600
            borderStyle: 'solid',
            borderRadius: `calc(8px * ${scale})`,
            fontSize: `calc(1.25rem * ${scale})`
          }}
        >
          칭찬해요
        </div>
        <div 
          className="bg-white text-green-600 font-bold flex items-center justify-center"
          style={{
            width: `calc(48% * ${scale})`,
            height: `calc(160px * ${scale})`,
            borderWidth: `calc(8px * ${scale})`,
            borderColor: '#16a34a', // green-600
            borderStyle: 'solid',
            borderRadius: `calc(8px * ${scale})`,
            fontSize: `calc(1.25rem * ${scale})`
          }}
        >
          기억해요
        </div>
      </div>
    </div>
  );
};

export default EduScreen;