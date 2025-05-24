import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Background from "../../components/ui/Background";
import GameContext from "../../components/ui/GameContext";
import GameTitle from "../../components/ui/GameTitle";

const Memory = () => {
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const navigate = useNavigate();

  // 하나 선택-> 3초 후 자동 이동
  useEffect(() => {
    if (selectedIndexes.length === 1) {
      const timer = setTimeout(() => {
        navigate("/survey");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [selectedIndexes, navigate]);

  const toggleSelection = (index: number) => {
    setSelectedIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [index] // 하나만 선택 가능
    );
  };

  const options = [
    { img: "/assets/images/quest1.png", label: "안전모 쓰기" },
    { img: "/assets/images/quest2.png", label: "구덩이 피하기" },
    { img: "/assets/images/quest3.png", label: "막걸리 치우기" },
    { img: "/assets/images/quest4.png", label: "무거운 짐 싣기" },
    { img: "/assets/images/quest5.png", label: "귀가시간 정하기" },
  ];

  const topRow = options.slice(0, 2);
  const bottomRow = options.slice(2);

  const renderCard = (option: any, index: number) => {
    const isSelected = selectedIndexes.includes(index);

    return (
      <div
        key={index}
        onClick={() => toggleSelection(index)}
        className="flex flex-col items-center cursor-pointer transition z-30"
      >
        <img
          src={option.img}
          alt={option.label}
          className={`w-[280px] h-[210px] object-cover rounded-[30px] transition 
          border-[10px] ${isSelected ? "border-red-500" : "border-transparent"} mb-1`}
        />
        <GameContext
          text={option.label}
          fontSize="text-[35px]"
          color="text-black"
          strokeWidth="5px"
        />
      </div>
    );
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-[#FFF9C4]/70 z-10" />
      <Background />

      <div className="relative z-30 flex flex-col items-center justify-start py-5 px-4">
        <GameContext
          text="가장 기억에 남는 장면을 골라주세요"
          fontSize="text-[55px]"
          color="text-[#0E8E12]"
          className="mt-7 mb-9"
        />

        {/* 윗줄 2개 */}
        <div className="flex justify-center gap-16 mb-4">
          {topRow.map((option, idx) => renderCard(option, idx))}
        </div>

        {/* 아랫줄 3개 */}
        <div className="flex justify-center gap-10">
          {bottomRow.map((option, idx) => renderCard(option, idx + 2))}
        </div>
      </div>
    </div>
  );
};

export default Memory;
