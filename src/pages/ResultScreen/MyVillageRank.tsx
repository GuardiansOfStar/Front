import React from 'react';

const MyVillageRank = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-green-100">
      <div className="text-4xl font-bold text-white bg-green-700 px-10 py-6 rounded-2xl shadow-lg">
        우리 마을 안전 등수
      </div>
      <div className="mt-10 text-center bg-green-600 rounded-2xl p-8 text-white shadow-md text-3xl">
        <div className="mb-4">🥈 2등</div>
        <div>마을: <strong>예산군</strong></div>
        <div>참여자: <strong>150명</strong></div>
        <div>안전 점수: <strong>85점</strong></div>
      </div>
    </div>
  );
};

export default MyVillageRank;
