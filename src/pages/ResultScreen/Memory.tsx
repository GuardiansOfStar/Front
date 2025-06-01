import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useScale } from "../../hooks/useScale";
import Background from "../../components/ui/Background";
import GameTitle from "../../components/ui/GameTitle";
import { updateSessionScene } from "../../services/endpoints/session";

const Memory = () => {
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const navigate = useNavigate();
  const scale = useScale();

  const sessionId = localStorage.getItem("session_id") || "";

  const options = [
    { img: "/assets/images/quest1.png", label: "안전모 쓰기",      questId: "helmet"   },
    { img: "/assets/images/quest2.png", label: "구덩이 피하기",    questId: "pothole"  },
    { img: "/assets/images/quest3.png", label: "막걸리 치우기",    questId: "Makgeolli" },
    { img: "/assets/images/quest4.png", label: "무거운 짐 싣기",    questId: "Harvest"  },
    { img: "/assets/images/quest5.png", label: "귀가시간 정하기", questId: "Gohome"    },
  ];

  // 하나 선택 -> 1.5초 후 자동 이동
  useEffect(() => {
    if (selectedIndexes.length === 1) {
      const chosenIndex = selectedIndexes[0];
      const chosenQuestId = options[chosenIndex].questId;
      console.log("chosenQuestId : ", chosenQuestId);

      // API : favorite_scene만 먼저 PATCH
      updateSessionScene(sessionId, chosenQuestId)
        .then((res) => {
          console.log("[Memory] updateSessionScene 성공:", res.data);
        })
        .catch((err) => {
          console.error("[Memory] updateSessionScene 실패:", err);
        });

      // 1.5초 뒤에 /survey 로 이동
      const timer = setTimeout(() => {
        navigate(`/survey`);
      }, 1500);

      // cleanup function
      return () => clearTimeout(timer);
    }
  }, [selectedIndexes, navigate, sessionId]);

  const toggleSelection = (index: number) => {
    setSelectedIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [index] // 하나만 선택 가능
    );
  };

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
          className="object-cover transition"
          style={{
            width: `calc(280px * ${scale})`,
            height: `calc(210px * ${scale})`,
            borderRadius: `calc(30px * ${scale})`,
            border: `calc(10px * ${scale}) solid ${isSelected ? "#EF4444" : "#0E8E12"}`,
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
            strokeWidth={`calc(6px * ${scale})`}
          />
        </div>

        {/* 윗줄 2개 */}
        <div 
          className="absolute flex justify-center"
          style={{
            top: `calc(168px * ${scale})`,
            left: `calc(213px * ${scale})`,
            gap: `calc(64px * ${scale})`
          }}
        >
          {topRow.map((option, idx) => renderCard(option, idx))}
        </div>

        {/* 아랫줄 3개 */}
        <div 
          className="absolute flex justify-center"
          style={{
            top: `calc(462px * ${scale})`,
            left: `calc(52px * ${scale})`,
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