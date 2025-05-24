import React from 'react';
import Background from '../../components/ui/Background';
import HomeButton from '../../components/ui/HomeButton';

const mockData = Array.from({ length: 10 }, (_, i) => ({
  rank: i + 1,
  name: `마을 ${i + 1}`,
  participants: 100 + i,
  score: 90 - i,
}));

const VillageRankList = () => {
  return (
    <div className="w-full h-full bg-[#F2F2F2] p-6 flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-[#FFF9C4]/70 z-10" />
      <Background />

      {/* ✅ 제목 */}
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

      {/* ✅ 전체 박스 조건: 844 x 437 */}
      <div className="w-[844px] h-[437px] bg-[#0E8E12]/50 border-[10px] border-[#0E8E12] rounded-[20px] shadow-lg flex flex-col items-center justify-start py-4 px-6 z-20">
        
        {/* ✅ 테이블 헤더 */}
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

        {/*랭킹 항목 박스 */}
        <div className="w-[750px] h-[299px] bg-[#0E8E12]/20 rounded-[20px] overflow-y-auto mt-2">
          <table className="w-full table-fixed text-center">
            <tbody className="text-lg">
              {mockData.map((village, idx) => (
                <tr key={idx} className="text-white text-3xl font-bold border-b hover:bg-green-600">
                  <td className="py-5">
                    {village.rank === 1 ? (
                      <img src="/assets/images/medal_first.png" alt="1등" className="h-12 mx-auto" />
                    ) : village.rank === 2 ? (
                      <img src="/assets/images/medal_second.png" alt="2등" className="h-12 mx-auto" />
                    ) : village.rank === 3 ? (
                      <img src="/assets/images/medal_third.png" alt="3등" className="h-12 mx-auto" />
                    ) : (
                      village.rank
                    )}
                  </td>
                  <td>{village.name}</td>
                  <td>{village.participants}명</td>
                  <td>{village.score}점</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VillageRankList;
