import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScale } from '../../hooks/useScale';
import Background from '../../components/ui/Background';
import HomeButton from '../../components/ui/HomeButton';

const EduScreen = () => {
  const navigate = useNavigate();
  const scale = useScale();
  const [totalScore] = useState(80); // 임시 점수, 실제로는 props나 상태에서 가져올 수 있음
  
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
    <div className="relative w-full h-full">
      <Background />
      <HomeButton />
      
      {/* 점수 표시 섹션 */}
      <div 
        className="absolute bg-white bg-opacity-90 border-green-600 text-center z-50"
        style={{
          width: `calc(619px * ${scale})`,
          height: `calc(50px * ${scale})`,
          left: `calc(196px * ${scale})`,
          top: `calc(128px * ${scale})`,
          borderWidth: `calc(10px * ${scale})`,
          borderStyle: 'solid',
          fontSize: `calc(80px * ${scale})`,
          lineHeight: `calc(50px * ${scale})`,
          letterSpacing: '0.05em',
          color: '#FFFFFF',
          backgroundColor: '#0DA429',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 900
        }}
      >
        안전 점수 {totalScore}점
      </div>

      {/* 칭찬해요 카드 */}
      <div 
        className="absolute bg-white bg-opacity-90 border-green-700 z-50"
        style={{
          width: `calc(410px * ${scale})`,
          height: `calc(395px * ${scale})`,
          left: `calc(81px * ${scale})`,
          top: `calc(242px * ${scale})`,
          borderWidth: `calc(10px * ${scale})`,
          borderStyle: 'solid',
          borderRadius: `calc(20px * ${scale})`,
          borderColor: '#0E8E12',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: `calc(24px * ${scale})`
        }}
      >
        {/* 칭찬해요 아이콘 */}
        <img
          src="/assets/images/clap.png"
          alt="박수"
          style={{
            width: `calc(80px * ${scale})`,
            height: `calc(80px * ${scale})`,
            marginBottom: `calc(16px * ${scale})`
          }}
        />
        
        <h3 
          className="font-black text-green-600"
          style={{ 
            fontSize: `calc(50px * ${scale})`,
            marginBottom: `calc(16px * ${scale})`
          }}
        >
          칭찬해요
        </h3>
        
        <p 
          className="font-black text-black"
          style={{ fontSize: `calc(45px * ${scale})` }}
        >
          안전모를 착용하고<br/>
          구덩이를 조심히 피한<br/>
          안전 운전
        </p>
      </div>

      {/* 조심해요 카드 */}
      <div 
        className="absolute bg-white bg-opacity-90 border-green-700 z-50"
        style={{
          width: `calc(410px * ${scale})`,
          height: `calc(395px * ${scale})`,
          left: `calc(538px * ${scale})`,
          top: `calc(242px * ${scale})`,
          borderWidth: `calc(10px * ${scale})`,
          borderStyle: 'solid',
          borderRadius: `calc(20px * ${scale})`,
          borderColor: '#0E8E12',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: `calc(24px * ${scale})`
        }}
      >
        {/* 기억해요 아이콘 */}
        <img
          src="/assets/images/check.png"
          alt="체크"
          style={{
            width: `calc(58px * ${scale})`,
            height: `calc(58px * ${scale})`,
            marginBottom: `calc(16px * ${scale})`
          }}
        />
        
        <h3 
          className="font-black text-red-600"
          style={{ 
            fontSize: `calc(50px * ${scale})`,
            marginBottom: `calc(16px * ${scale})`
          }}
        >
          기억해요
        </h3>
        
        <p 
          className="font-black text-black"
          style={{ fontSize: `calc(45px * ${scale})` }}
        >
          막걸리 치우기<br/>
          무거운 짐 운반 시<br/>
          주의사항
        </p>
      </div>
      
      {/* 클릭 영역 - 전체 화면 */}
      <div 
        className="absolute inset-0 z-40 cursor-pointer"
        onClick={() => navigate('/certificate')}
      />
    </div>
  );
};

export default EduScreen;