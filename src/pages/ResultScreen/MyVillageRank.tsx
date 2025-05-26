import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScale } from '../../hooks/useScale';
import Background from '../../components/ui/Background';
import HomeButton from '../../components/ui/HomeButton';

const myVillage = {
  rank: 2,
  name: '예산군',
  participants: 150,
  score: 85,
};

const MyVillageRank = () => {
  const navigate = useNavigate();
  const scale = useScale();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/rank');
    }, 5000); // 5초 후 이동

    return () => clearTimeout(timer); //타이머 정리
  }, [navigate]);

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 bg-[#FFF9C4]/70 z-10" />
      <Background />
      <HomeButton />

      {/* 제목 */}
      <div
        className="absolute bg-green-600 border-green-700 text-white font-black text-center z-20"
        style={{
          width: `calc(718px * ${scale})`,
          height: `calc(100px * ${scale})`,
          left: `calc(153px * ${scale})`,
          top: `calc(123px * ${scale})`,
          borderWidth: `calc(10px * ${scale})`,
          borderStyle: 'solid',
          borderColor: '#0E8E12',
          borderRadius: `calc(30px * ${scale})`,
          backgroundColor: '#0DA429',
          boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: `calc(60px * ${scale})`,
          lineHeight: `calc(72px * ${scale})`
        }}
      >
        우리 마을 안전 등수
      </div>

      {/* 사용자 마을 강조 박스 */}
      <div 
        className="absolute bg-green-700 border-green-700 z-30 shadow-2xl flex items-center justify-around text-white font-black"
        style={{
          width: `calc(908px * ${scale})`,
          height: `calc(135px * ${scale})`,
          left: `calc(58px * ${scale})`,
          top: `calc(420px * ${scale})`,
          borderWidth: `calc(7px * ${scale})`,
          borderStyle: 'solid',
          borderColor: '#0E8E12',
          borderRadius: `calc(20px * ${scale})`,
          backgroundColor: '#0E8E12',
          fontSize: `calc(50px * ${scale})`,
          lineHeight: `calc(70px * ${scale})`,
          paddingLeft: `calc(32px * ${scale})`,
          paddingRight: `calc(32px * ${scale})`
        }}
      >
        <div className="w-[10%] text-center">
          {myVillage.rank === 1 ? (
            <img 
              src="/assets/images/medal_first.png" 
              alt="1등" 
              style={{
                height: `calc(64px * ${scale})`,
                margin: '0 auto'
              }}
            />
          ) : myVillage.rank === 2 ? (
            <img 
              src="/assets/images/medal_second.png" 
              alt="2등" 
              style={{
                height: `calc(64px * ${scale})`,
                margin: '0 auto'
              }}
            />
          ) : myVillage.rank === 3 ? (
            <img 
              src="/assets/images/medal_third.png" 
              alt="3등" 
              style={{
                height: `calc(64px * ${scale})`,
                margin: '0 auto'
              }}
            />
          ) : (
            myVillage.rank + "등"
          )}
        </div>
        <div className="w-[15%] text-center">{myVillage.rank}등</div>
        <div className="w-[25%] text-center">{myVillage.name}</div>
        <div className="w-[25%] text-center">{myVillage.participants}명</div>
        <div className="w-[25%] text-center">{myVillage.score}점</div>
      </div>

      {/* 표 틀만 유지 */}
      <div 
        className="absolute bg-green-700 bg-opacity-50 border-green-700 shadow-lg flex flex-col items-center justify-start z-20"
        style={{
          width: `calc(844px * ${scale})`,
          height: `calc(437px * ${scale})`,
          left: `calc(90px * ${scale})`,
          top: `calc(276px * ${scale})`,
          borderWidth: `calc(10px * ${scale})`,
          borderStyle: 'solid',
          borderColor: '#0E8E12',
          borderRadius: `calc(20px * ${scale})`,
          backgroundColor: 'rgba(14, 142, 18, 0.5)',
          paddingTop: `calc(16px * ${scale})`,
          paddingBottom: `calc(16px * ${scale})`,
          paddingLeft: `calc(24px * ${scale})`,
          paddingRight: `calc(24px * ${scale})`
        }}
      >
        <div 
          className="w-full text-center text-white font-black"
          style={{
            fontSize: `calc(35px * ${scale})`,
            lineHeight: `calc(70px * ${scale})`,
            paddingTop: `calc(8px * ${scale})`
          }}
        >
          <div className="flex justify-around">
            <div className="w-[25%]">등수</div>
            <div className="w-[25%]">마을 이름</div>
            <div className="w-[25%]">참여자 수</div>
            <div className="w-[25%]">안전 점수</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyVillageRank;