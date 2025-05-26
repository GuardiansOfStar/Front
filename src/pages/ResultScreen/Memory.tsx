import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useScale } from "../../hooks/useScale";
import Background from "../../components/ui/Background";
import GameTitle from "../../components/ui/GameTitle";
import BackButton from "../../components/ui/BackButton";

const Memory = () => {
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const navigate = useNavigate();
  const scale = useScale();

  // 하나 선택-> 3초 후 자동 이동
  useEffect(() => {
    if (selectedIndexes.length === 1) {
      const timer = setTimeout(() => {
        navigate("/survey");
      }, 1500);
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
        style={{
          // 카드별 위치 조정
          marginRight: index === 0 ? `calc(80px * ${scale})` : 
                      index === 2 ? `calc(40px * ${scale})` :
                      index === 3 ? `calc(40px * ${scale})` : '0px'
        }}
      >
        <img
          src={option.img}
          alt={option.label}
          className={`object-cover transition border-white
          ${isSelected ? "border-red-500" : "border-transparent"}`}
          style={{
            width: `calc(280px * ${scale})`,
            height: `calc(210px * ${scale})`,
            borderRadius: `calc(30px * ${scale})`,
            borderWidth: `calc(10px * ${scale})`,
            marginBottom: `calc(4px * ${scale})`
          }}
        />
        <div
          className="text-black font-black text-center"
          style={{
            fontSize: `calc(35px * ${scale})`,
            lineHeight: `calc(42px * ${scale})`,
            WebkitTextStroke: `calc(5px * ${scale}) white`,
            paintOrder: 'stroke'
          }}
        >
          {option.label}
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 bg-[#FFF9C4]/70 z-10" />
      <Background />
      <BackButton />

      <div className="absolute inset-0 z-30">
        {/* 질문 텍스트 */}
        <div 
          className="absolute"
          style={{
            top: `calc(68px * ${scale})`,
            left: `calc(166px * ${scale})`,
            width: `calc(692px * ${scale})`,
            height: `calc(60px * ${scale})`
          }}
        >
          <GameTitle
            text="가장 기억에 남는 장면을 골라주세요"
            fontSize={`calc(50px * ${scale})`}
            color="text-[#0E8E12]"
            strokeWidth={`calc(5px * ${scale})`}
          />
        </div>

        {/* 윗줄 2개 */}
        <div 
          className="absolute flex justify-center"
          style={{
            top: `calc(168px * ${scale})`,
            left: `calc(233px * ${scale})`,
            gap: `calc(64px * ${scale})`
          }}
        >
          {topRow.map((option, idx) => renderCard(option, idx))}
        </div>

        {/* 아랫줄 3개 */}
        <div 
          className="absolute flex justify-center"
          style={{
            top: `calc(422px * ${scale})`,
            left: `calc(72px * ${scale})`,
            gap: `calc(40px * ${scale})`
          }}
        >
          {bottomRow.map((option, idx) => renderCard(option, idx + 2))}
        </div>
      </div>
    </div>
  );
};

export default Memory;