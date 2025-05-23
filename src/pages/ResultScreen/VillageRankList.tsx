import React from 'react';

const mockData = Array.from({ length: 30 }, (_, i) => ({
  rank: i + 1,
  name: `테스트 마을 ${i + 1}`,
  participants: 100 + i,
  score: 90 - i,
}));

const VillageRankList = () => {
  return (
    <div className="w-full h-full bg-[#F2F2F2] p-6">
      <h2 className="text-3xl font-bold mb-4 text-center text-green-800">우리마을 안전 등수</h2>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full table-auto text-center">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="py-2">등수</th>
              <th>마을 이름</th>
              <th>참여자 수</th>
              <th>안전 점수</th>
            </tr>
          </thead>
        </table>

        {/* ✅ 이 div에만 스크롤을 줌 */}
        <div className="max-h-[300px] overflow-y-scroll">
          <table className="w-full table-auto text-center">
            <tbody>
              {mockData.map((village, idx) => (
                <tr key={idx} className="text-black border-b hover:bg-green-100">
                  <td className="py-2">{village.rank}</td>
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
