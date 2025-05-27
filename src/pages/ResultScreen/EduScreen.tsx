import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScale } from '../../hooks/useScale';
import Background from '../../components/ui/Background';
import GameTitle from '../../components/ui/GameTitle';

const next_button = '/assets/images/next_button.png';

const EduScreen = () => {
  const navigate = useNavigate();
  const scale = useScale();
  const [totalScore] = useState(80);
  
  return (
    <div className="relative w-full h-full">
      {/* 배경 - z-index를 낮게 설정 */}
      <div className="absolute inset-0 z-0">
        <Background />
      </div>
      
      {/* 점수 표시 섹션 */}
      <div 
        className="absolute z-20"
        style={{
          width: `calc(619px * ${scale})`,
          height: `calc(50px * ${scale})`,
          left: `calc(196px * ${scale})`,
          top: `calc(108px * ${scale})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <GameTitle 
          text={`안전 점수 ${totalScore}점`}
          fontSize={`calc(80px * ${scale})`}
          color="text-white"
          strokeWidth={`calc(18px * ${scale})`}
          strokeColor="#0DA429"
          className="leading-none tracking-wider"
        />
      </div>

            {/* 칭찬해요 카드 */}
      <div 
        className="absolute z-30"
        style={{
          width: `calc(410px * ${scale})`,
          height: `calc(395px * ${scale})`,
          left: `calc(81px * ${scale})`,
          top: `calc(242px * ${scale})`,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          border: `calc(10px * ${scale}) solid #0E8E12`,
          borderRadius: `calc(20px * ${scale})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: `calc(24px * ${scale})`,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* 칭찬해요 타이틀과 아이콘 */}
        <div 
          className="flex items-center justify-center"
          style={{ 
            marginBottom: `calc(16px * ${scale})`,
            gap: `calc(12px * ${scale})`,
            width: '100%'
          }}
        >
          <img
            src="/assets/images/clap.png"
            alt="박수"
            style={{
              width: `calc(50px * ${scale})`,
              height: `calc(50px * ${scale})`
            }}
          />
          <h3 
            className="font-black"
            style={{ 
              fontSize: `calc(50px * ${scale})`,
              margin: 0,
              color: '#059669'
            }}
          >
            칭찬해요
          </h3>
        </div>
        
        <p 
          className="font-black"
          style={{ 
            fontSize: `calc(45px * ${scale})`,
            color: '#000000',
            lineHeight: '1.5',
            margin: 3
          }}
        >
          주행 전에<br/>
          안전모 쓰는 모습이<br/>
          멋져요
        </p>
      </div>

      {/* 기억해요 카드 */}
      <div 
        className="absolute z-30"
        style={{
          width: `calc(410px * ${scale})`,
          height: `calc(395px * ${scale})`,
          left: `calc(538px * ${scale})`,
          top: `calc(242px * ${scale})`,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          border: `calc(10px * ${scale}) solid #0E8E12`,
          borderRadius: `calc(20px * ${scale})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: `calc(24px * ${scale})`,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* 기억해요 타이틀과 아이콘 */}
        <div 
          className="flex items-center justify-center"
          style={{ 
            marginBottom: `calc(16px * ${scale})`,
            gap: `calc(12px * ${scale})`,
            width: '100%'
          }}
        >
          <img
            src="/assets/images/check.png"
            alt="체크"
            style={{
              width: `calc(50px * ${scale})`,
              height: `calc(50px * ${scale})`
            }}
          />
          <h3 
            className="font-black"
            style={{ 
              fontSize: `calc(50px * ${scale})`,
              margin: 0,
              color: '#DC2626'
            }}
          >
            기억해요
          </h3>
        </div>
        
        <p 
          className="font-black"
          style={{ 
            fontSize: `calc(45px * ${scale})`,
            color: '#000000',
            lineHeight: '1.5',
            margin: 3,
            
          }}
        >
          구덩이를<br/>
          만나면<br/>
          속도를 줄여요
        </p>
      </div>
      
      {/* 다음 버튼 */}
      <img
        src={next_button}
        alt="다음 버튼"
        onClick={() => navigate('/certificate')}
        className="absolute cursor-pointer z-40 hover:scale-105 transition-transform duration-300"
        style={{
          bottom: `calc(20px * ${scale})`,
          left: '50%',
          transform: 'translateX(-50%)',
          width: `calc(180px * ${scale})`
        }}
      />
    </div>
  );
};

export default EduScreen;