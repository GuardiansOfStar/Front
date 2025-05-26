import { useEffect, useState } from 'react';
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

const mockData = Array.from({ length: 10 }, (_, i) => ({
  rank: i + 1,
  name: i + 1 === myVillage.rank ? myVillage.name : `마을 ${i + 1}`,
  participants: i + 1 === myVillage.rank ? myVillage.participants : 100 + i,
  score: i + 1 === myVillage.rank ? myVillage.score : 90 - i,
}));

const VillageRank = () => {
  const navigate = useNavigate();
  const scale = useScale();
  const [phase, setPhase] = useState<'highlight' | 'transition' | 'list'>('highlight');

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setPhase('transition');
    }, 3000);

    const timer2 = setTimeout(() => {
      setPhase('list');
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

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
          height: `calc(120px * ${scale})`,
          left: `calc(153px * ${scale})`,
          top: `calc(123px * ${scale})`,
          borderWidth: `calc(8px * ${scale})`,
          borderStyle: 'solid',
          borderColor: '#0E8E12',
          borderRadius: `calc(30px * ${scale})`,
          backgroundColor: '#0DA429',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: `calc(60px * ${scale})`,
          lineHeight: `calc(72px * ${scale})`
        }}
      >
        우리 마을 안전 등수
      </div>

      {/* 리스트 프레임 (항상 보임) */}
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
        {/* 테이블 헤더 (항상 보임) */}
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

        <div 
          className="overflow-y-auto"
          style={{
            width: `calc(770px * ${scale})`,
            height: `calc(299px * ${scale})`,
            backgroundColor: 'rgba(14, 142, 18, 0.2)',
            borderRadius: `calc(20px * ${scale})`,
            marginTop: `calc(8px * ${scale})`
          }}
        >
          <div className="w-full">
            {mockData.map((village, idx) => (
              <div 
                key={idx} 
                className={`text-white font-black border-b flex justify-around items-center transition-all duration-500 ${
                  village.rank === myVillage.rank 
                    ? 'bg-green-600 shadow-lg scale-105' 
                    : 'hover:bg-green-600'
                } ${
                  phase === 'highlight' && village.rank !== myVillage.rank 
                    ? 'opacity-0' 
                    : phase === 'list' 
                    ? 'opacity-100' 
                    : village.rank === myVillage.rank 
                    ? 'opacity-100 animate-pulse' 
                    : 'opacity-0'
                }`}
                style={{
                  fontSize: `calc(30px * ${scale})`,
                  paddingTop: `calc(20px * ${scale})`,
                  paddingBottom: `calc(20px * ${scale})`,
                  borderBottomWidth: `calc(1px * ${scale})`,
                  borderBottomColor: 'rgba(255, 255, 255, 0.3)',
                  transform: phase === 'list' || village.rank === myVillage.rank ? 'translateX(0)' : 'translateX(-100%)',
                  transition: village.rank === myVillage.rank 
                    ? 'all 0.5s ease-out' 
                    : `all ${0.3 + idx * 0.1}s ease-out ${phase === 'list' ? idx * 100 : 0}ms`,
                }}
              >
                <div className="w-[25%] text-center">
                  {village.rank <= 3 ? (
                    <img 
                      src={`/assets/images/medal_${village.rank === 1 ? 'first' : village.rank === 2 ? 'second' : 'third'}.png`}
                      alt={`${village.rank}등`}
                      style={{
                        height: `calc(48px * ${scale})`,
                        margin: '0 auto'
                      }}
                    />
                  ) : (
                    village.rank
                  )}
                </div>
                <div className="w-[25%] text-center">{village.name}</div>
                <div className="w-[25%] text-center">{village.participants}명</div>
                <div className="w-[25%] text-center">{village.score}점</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Phase 1: 사용자 마을 강조 오버레이 */}
      <div 
        className={`absolute bg-green-700 border-green-700 z-30 shadow-2xl flex items-center justify-around text-white font-black transition-all duration-1000 ease-in-out ${
          phase === 'highlight' ? 'opacity-100 scale-110' : 'opacity-0 scale-90'
        }`}
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
          {myVillage.rank === 2 && (
            <img 
              src="/assets/images/medal_second.png" 
              alt="2등" 
              style={{
                height: `calc(64px * ${scale})`,
                margin: '0 auto'
              }}
            />
          )}
        </div>
        <div className="w-[15%] text-center">{myVillage.rank}등</div>
        <div className="w-[25%] text-center">{myVillage.name}</div>
        <div className="w-[25%] text-center">{myVillage.participants}명</div>
        <div className="w-[25%] text-center">{myVillage.score}점</div>
      </div>

      {/* CSS 애니메이션 */}
      <style>{`
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: .8;
          }
        }
      `}</style>
    </div>
  );
};

export default VillageRank;