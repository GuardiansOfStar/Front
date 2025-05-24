import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/rank');
    }, 5000); // 5초 후 이동

    return () => clearTimeout(timer); //타이머 정리
  }, [navigate]);

  return (
    <div className="w-full h-full bg-[#F2F2F2] p-6 flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-[#FFF9C4]/70 z-10" />
      <Background />

      {/* 제목 */}
      <h2
        className="
          w-[718px] h-[120px]
          text-[60px] text-[#FFFAFA]
          bg-[#0DA429] border-[10px] border-[#0E8E12] 
          rounded-[30px] 
          flex items-center justify-center 
          font-bold text-center z-20 mb-9
        "
      >
        우리 마을 안전 등수
      </h2>

      <HomeButton />

      {/* 사용자 마을 강조 박스 */}
      <div className="absolute top-[375px] w-[950px] h-[140px] bg-[#0E8E12] border-[8px] border-[#0E8E12]
      rounded-[25px] z-30 shadow-2xl flex items-center justify-around px-8 
      text-[48px] font-bold text-white">
        <div className="w-[10%] text-center">
          {myVillage.rank === 1 ? (
            <img src="/assets/images/medal_first.png" alt="1등" className="h-16 mx-auto" />
          ) : myVillage.rank === 2 ? (
            <img src="/assets/images/medal_second.png" alt="2등" className="h-16 mx-auto"/>
          ) : myVillage.rank === 3 ? (
            <img src="/assets/images/medal_third.png" alt="3등" className="h-16 mx-auto" />
          ) : (
            ""
          )}
        </div>
        <div className="w-[15%] text-center">{myVillage.rank}등</div>
        <div className="w-[25%] text-center">{myVillage.name}</div>
        <div className="w-[25%] text-center">{myVillage.participants}명</div>
        <div className="w-[25%] text-center">{myVillage.score}점</div>
      </div>

      {/* 표 틀만 유지 */}
      <div className="w-[844px] h-[437px] bg-[#0E8E12]/50 border-[10px] border-[#0E8E12] rounded-[20px] shadow-lg flex flex-col items-center justify-start py-4 px-6 z-20">
        <table className="w-full table-fixed text-center">
          <thead className="text-3xl text-white sticky top-0 z-10">
            <tr>
              <th className="w-[35%] py-2">등수</th>
              <th className="w-[35%]">마을 이름</th>
              <th className="w-[35%]">참여자 수</th>
              <th className="w-[35%]">안전 점수</th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  );
};

export default MyVillageRank;
