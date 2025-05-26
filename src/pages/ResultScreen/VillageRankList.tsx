import React from 'react';
import { useScale } from '../../hooks/useScale';
import Background from '../../components/ui/Background';
import HomeButton from '../../components/ui/HomeButton';

const mockData = Array.from({ length: 10 }, (_, i) => ({
  rank: i + 1,
  name: `마을 ${i + 1}`,
  participants: 100 + i,
  score: 90 - i,
}));

const VillageRankList = () => {
  const scale = useScale();

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

      {/* 전체 박스 조건: 844 x 437 */}
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
        
        {/* 테이블 헤더 */}
        <div 
          className="w-full text-center text-white font-black sticky top-0 z-10"
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

        {/* 랭킹 항목 박스 */}
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
                className="text-white font-black border-b hover:bg-green-600 flex justify-around items-center"
                style={{
                  fontSize: `calc(30px * ${scale})`,
                  paddingTop: `calc(20px * ${scale})`,
                  paddingBottom: `calc(20px * ${scale})`,
                  borderBottomWidth: `calc(1px * ${scale})`,
                  borderBottomColor: 'rgba(255, 255, 255, 0.3)'
                }}
              >
                <div className="w-[25%] text-center">
                  {village.rank === 1 ? (
                    <img 
                      src="/assets/images/medal_first.png" 
                      alt="1등" 
                      style={{
                        height: `calc(48px * ${scale})`,
                        margin: '0 auto'
                      }}
                    />
                  ) : village.rank === 2 ? (
                    <img 
                      src="/assets/images/medal_second.png" 
                      alt="2등" 
                      style={{
                        height: `calc(48px * ${scale})`,
                        margin: '0 auto'
                      }}
                    />
                  ) : village.rank === 3 ? (
                    <img 
                      src="/assets/images/medal_third.png" 
                      alt="3등" 
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
    </div>
  );
};

export default VillageRankList;